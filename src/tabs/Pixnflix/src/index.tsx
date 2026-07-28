import { Button, ButtonGroup, Divider, NumericInput } from '@blueprintjs/core';
import {
  DEFAULT_FPS,
  DEFAULT_HEIGHT,
  DEFAULT_VOLUME,
  DEFAULT_WIDTH,
  MAX_FPS,
  MAX_HEIGHT,
  MAX_WIDTH,
  MIN_FPS,
  MIN_HEIGHT,
  MIN_WIDTH
} from '@sourceacademy/bundle-pix_n_flix/constants';
import {
  PIX_N_FLIX_CONTROL_CHANNEL_ID,
  PIX_N_FLIX_FRAME_CHANNEL_ID,
  PIX_N_FLIX_WEB_ID,
  type FrameChannelMessage,
  type PixNFlixTabRpc
} from '@sourceacademy/bundle-pix_n_flix/protocol';
import type { ITabService, Tab } from '@sourceacademy/common-tabs';
import { checkIsPluginClass, makeRpc, type IChannel, type IConduit, type IPlugin } from '@sourceacademy/conductor/conduit';
import { createElement, useEffect, useRef, useSyncExternalStore, type ChangeEvent, type DragEvent } from 'react';

export const PIX_N_FLIX_TAB_ID = 'pix_n_flix';

enum Mode {
  Video,
  Still,
  Accepting,
  Image
}

interface ViewState {
  width: number;
  height: number;
  fps: number;
  volume: number;
  hasAudio: boolean;
  mode: Mode;
}

/**
 * Host-side (browser main thread) counterpart of `PixNFlixModulePlugin` (in the pix_n_flix
 * bundle), implementing `PixNFlixTabRpc` - actual camera/video/canvas access only works here, not
 * inside Conductor's runner Worker. Mirrors `SoundTabPlugin`'s shape (one plugin instance is both
 * the RPC server and the tab's real state owner; the rendered React component is a thin view over
 * it), but additionally owns the raw video/image/canvas DOM elements and the per-frame capture
 * loop, since - unlike sound's play()/record() - pix_n_flix needs actual on-screen elements, not
 * just a one-shot AudioContext call.
 */
// eslint-disable-next-line @sourceacademy/tab-type
export default class PixNFlixTabPlugin implements IPlugin, PixNFlixTabRpc {
  readonly id = PIX_N_FLIX_WEB_ID;
  static readonly channelAttach = [PIX_N_FLIX_CONTROL_CHANNEL_ID, PIX_N_FLIX_FRAME_CHANNEL_ID];

  private readonly __tabService: ITabService;
  private readonly __frameChannel: IChannel<FrameChannelMessage>;
  private readonly __listeners = new Set<() => void>();

  private __video: HTMLVideoElement | null = null;
  private __image: HTMLImageElement | null = null;
  private __canvas: HTMLCanvasElement | null = null;
  private __canvasContext: CanvasRenderingContext2D | null = null;
  // Capture happens on this offscreen canvas, never the visible one - drawing the raw frame
  // directly onto __canvas and later overwriting it with putImageData(filtered result) produces a
  // double-image flicker (raw frame flashes every tick, however briefly, until the - currently
  // slow, pending the .sync fast path landing upstream - round trip finishes and overwrites it).
  // The visible canvas is only ever touched once, with the actual filtered result.
  private readonly __captureCanvas: HTMLCanvasElement = document.createElement('canvas');
  private readonly __captureContext: CanvasRenderingContext2D = this.__captureCanvas.getContext('2d')!;

  private __state: ViewState = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    fps: DEFAULT_FPS,
    volume: DEFAULT_VOLUME,
    hasAudio: false,
    mode: Mode.Video
  };

  private __keepAspectRatio = true;
  private __intrinsicWidth = DEFAULT_WIDTH;
  private __intrinsicHeight = DEFAULT_HEIGHT;
  private __displayWidth = DEFAULT_WIDTH;
  private __displayHeight = DEFAULT_HEIGHT;
  private __loopCount = -1;
  private __loopsPlayed = 0;
  // Laptop/front-camera feeds are conventionally mirrored at the driver/OS level (the "selfie"
  // convention) - that's independent of anything a student's filter does, since no filter here
  // touches pixel *position*, only color. Un-mirror the live camera capture so the unfiltered
  // default matches true left/right orientation, and a flip only ever comes from a filter that
  // deliberately does one (e.g. a student's own mirror-style filter). Not applied to a loaded
  // video/image URL or local file, which have no such camera-mirroring convention to correct for.
  private __usingCamera = true;
  // Set by useLocalFile/useImageUrl/useVideoUrl when __attachElements hasn't run yet (this.__image/
  // __video are still null) - replayed once it does. See __attachElements's doc comment.
  private __pendingInputSource: (() => void) | undefined;

  private __requestId: number | undefined;
  private __prevTimestamp: number | null = null;
  private __totalElapsedMs = 0;
  private __videoIsPlaying = false;
  // Only one captured-frame round trip is ever in flight at a time - the draw loop won't capture
  // the next frame until the previous one's filtered response has come back (see __tick). Carries
  // both resolve and reject so __stopCapture can settle (not just abandon) a frame that's still in
  // flight when capture stops - otherwise __captureAndSendFrame's awaiting async call would hang
  // forever, permanently pinning its closed-over capture buffer in memory.
  private __pendingFrame: { resolve: (buffer: ArrayBuffer) => void, reject: (reason: unknown) => void } | undefined;

  private __destroyed = false;

  constructor(_conduit: IConduit, [controlChannel, frameChannel]: IChannel<any>[], tabService: ITabService) {
    if (!controlChannel || !frameChannel) {
      throw new Error('Pix n Flix control/frame channels are required but were not provided.');
    }
    this.__tabService = tabService;
    this.__frameChannel = frameChannel as IChannel<FrameChannelMessage>;
    makeRpc<PixNFlixTabRpc, Record<string, never>>(controlChannel, this);
    this.__frameChannel.subscribe(message => {
      if (message.kind === 'filtered-frame' && this.__pendingFrame) {
        this.__pendingFrame.resolve(message.buffer);
        this.__pendingFrame = undefined;
      }
    });

    const subscribe = (listener: () => void) => this.__subscribe(listener);
    const getState = () => this.__state;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const plugin = this;
    function PixNFlixView() {
      const state = useSyncExternalStore(subscribe, getState);
      const videoRef = useRef<HTMLVideoElement | null>(null);
      const imageRef = useRef<HTMLImageElement | null>(null);
      const canvasRef = useRef<HTMLCanvasElement | null>(null);

      useEffect(() => {
        plugin.__attachElements(videoRef.current, imageRef.current, canvasRef.current);
        return () => plugin.__detachElements();
      }, []);

      return createElement(PixNFlixView_, { plugin, state, videoRef, imageRef, canvasRef });
    }

    const tab = {
      id: PIX_N_FLIX_TAB_ID,
      iconName: 'mobile-video',
      body: createElement(PixNFlixView),
      label: 'PixNFlix Live Feed',
      disabled: false
    } satisfies Tab;

    this.__tabService.registerTab(tab);
    this.__tabService.showTab(PIX_N_FLIX_TAB_ID);
  }

  destroy(): void {
    this.__destroyed = true;
    this.__stopCapture();
    this.__releaseCamera();
  }

  private __subscribe(listener: () => void): () => void {
    this.__listeners.add(listener);
    return () => this.__listeners.delete(listener);
  }

  private __emit(): void {
    this.__listeners.forEach(listener => listener());
  }

  private __setState(patch: Partial<ViewState>): void {
    this.__state = { ...this.__state, ...patch };
    this.__emit();
  }

  private __attachElements(video: HTMLVideoElement | null, image: HTMLImageElement | null, canvas: HTMLCanvasElement | null): void {
    this.__video = video;
    this.__image = image;
    this.__canvas = canvas;
    this.__canvasContext = canvas?.getContext('2d') ?? null;
    if (this.__pendingInputSource) {
      // useImageUrl/useVideoUrl/useLocalFile's RPC call can arrive (and, seeing no __image/
      // __video yet, no-op) before React has actually mounted this component and fired the
      // useEffect that calls __attachElements - the control channel's RPC listener goes live
      // synchronously in the constructor, well before that. Replay whichever one actually ran
      // last instead of defaulting to the camera in that case.
      const pending = this.__pendingInputSource;
      this.__pendingInputSource = undefined;
      pending();
    } else {
      this.__requestCamera();
    }
    this.__startCapture();
  }

  private __detachElements(): void {
    this.__stopCapture();
    this.__releaseCamera();
    this.__video = null;
    this.__image = null;
    this.__canvas = null;
    this.__canvasContext = null;
  }

  private __requestCamera(): void {
    if (!this.__video || !navigator.mediaDevices?.getUserMedia) return;
    if (this.__video.srcObject) return;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (!this.__video) return;
        this.__video.srcObject = stream;
        this.__video.onloadedmetadata = () => this.__setAspectRatioDimensions(this.__video!.videoWidth, this.__video!.videoHeight);
        this.__videoIsPlaying = true;
      })
      .catch(error => console.warn('pix_n_flix: getUserMedia failed:', error));
  }

  private __releaseCamera(): void {
    const stream = this.__video?.srcObject as MediaStream | undefined;
    stream?.getTracks().forEach(track => track.stop());
    // Without this, __requestCamera's own srcObject-truthy check (line above) would see this
    // now-dead stream as "already have a camera" and never re-acquire on a later detach/reattach
    // cycle (e.g. React StrictMode's double-invoked mount effect, or a tab hide/show cycle),
    // leaving a permanently frozen, all-tracks-stopped video element.
    if (this.__video) this.__video.srcObject = null;
  }

  private __setAspectRatioDimensions(w: number, h: number): void {
    this.__intrinsicWidth = w;
    this.__intrinsicHeight = h;
    const scale = Math.min(this.__state.width / w, this.__state.height / h);
    this.__displayWidth = scale * w;
    this.__displayHeight = scale * h;
  }

  private __startCapture(): void {
    if (this.__requestId !== undefined) return;
    this.__requestId = window.requestAnimationFrame(this.__tick);
  }

  private __stopCapture(): void {
    if (this.__requestId === undefined) return;
    window.cancelAnimationFrame(this.__requestId);
    this.__requestId = undefined;
    this.__prevTimestamp = null;
    // A frame already in flight when capture stops may never get a reply (e.g. the module's
    // Worker is gone by the time it would have replied) - reject it explicitly (rather than just
    // clearing the field) so __captureAndSendFrame's awaiting call settles instead of hanging on
    // an abandoned promise forever; __tick's own gate (`|| this.__pendingFrame`) is cleared either
    // way, so __startCapture can schedule frames again immediately.
    this.__pendingFrame?.reject(new Error('pix_n_flix: capture stopped'));
    this.__pendingFrame = undefined;
  }

  private __tick = (timestamp: number): void => {
    this.__requestId = window.requestAnimationFrame(this.__tick);
    if (this.__prevTimestamp === null) this.__prevTimestamp = timestamp;
    const elapsed = timestamp - this.__prevTimestamp;
    if (elapsed < 1000 / this.__state.fps || !this.__videoIsPlaying || this.__pendingFrame) return;
    this.__prevTimestamp = timestamp;
    this.__totalElapsedMs += elapsed;
    // Rejects only via __stopCapture's explicit abandonment of an in-flight frame - an expected,
    // benign outcome (not a real error), so it's swallowed here rather than logged.
    this.__captureAndSendFrame().catch(() => {});
  };

  private async __captureAndSendFrame(): Promise<void> {
    const source = this.__state.mode === Mode.Image ? this.__image : this.__video;
    if (!source) return;

    const { width, height } = this.__state;
    // Capture onto the offscreen canvas only - the visible one (__canvasContext) is never drawn
    // to here, so the student's actual filter output is the only thing ever displayed, not a
    // flickering mix of the raw frame and the (possibly much later) filtered result.
    const ctx = this.__captureContext;
    if (this.__captureCanvas.width !== width) this.__captureCanvas.width = width;
    if (this.__captureCanvas.height !== height) this.__captureCanvas.height = height;

    ctx.save();
    if (this.__usingCamera) {
      // Un-mirror the live camera driver's own "selfie" convention - see __usingCamera's doc
      // comment. Flipping the canvas transform before drawing (rather than the source element)
      // keeps this local to the capture step, with no effect on what's actually displayed to the
      // student (only the filtered result ever reaches the visible canvas).
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    if (this.__keepAspectRatio) {
      // beginPath() is required here: rect() appends to the *current* path rather than replacing
      // it, and neither save()/restore() nor drawImage() reset it - without this, the path grows
      // by one stacked (identical) rectangle every captured frame, and fill() re-rasterizes all
      // of them every time, a real and growing cost over a long-running video session.
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.fill();
      ctx.drawImage(source, 0, 0, this.__intrinsicWidth, this.__intrinsicHeight, (width - this.__displayWidth) / 2, (height - this.__displayHeight) / 2, this.__displayWidth, this.__displayHeight);
    } else {
      ctx.drawImage(source, 0, 0, width, height);
    }
    ctx.restore();

    const captured = ctx.getImageData(0, 0, width, height);
    const capturedBuffer = captured.data.buffer;
    const resultBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      this.__pendingFrame = { resolve, reject };
      this.__frameChannel.send({ kind: 'captured-frame', buffer: capturedBuffer, width, height }, [capturedBuffer]);
    });

    if (this.__destroyed || !this.__canvasContext) return;
    const resultData = new ImageData(new Uint8ClampedArray(resultBuffer), width, height);
    this.__canvasContext.putImageData(resultData, 0, 0);
  }

  private __handleVideoEnded = (): void => {
    this.__loopsPlayed += 1;
    if (this.__loopCount >= 0 && this.__loopsPlayed > this.__loopCount) {
      this.__loopsPlayed = 0;
      this.__pause();
    } else {
      void this.__video?.play();
    }
  };

  private __pause(): void {
    this.__videoIsPlaying = false;
    this.__setState({ mode: Mode.Still });
  }

  private __resume(): void {
    this.__videoIsPlaying = true;
    this.__setState({ mode: Mode.Video });
  }

  async updateDimensions(width: number, height: number): Promise<void> {
    if (this.__video) {
      this.__video.width = width;
      this.__video.height = height;
    }
    if (this.__image) {
      this.__image.width = width;
      this.__image.height = height;
    }
    if (this.__canvas) {
      this.__canvas.width = width;
      this.__canvas.height = height;
    }
    this.__setState({ width, height });
  }

  $updateFPS(fps: number): void {
    this.__setState({ fps });
  }

  $updateVolume(volume: number): void {
    if (this.__video) this.__video.volume = volume;
    this.__setState({ volume: volume * 100 });
  }

  async useLocalFile(): Promise<void> {
    this.__releaseCamera();
    this.__usingCamera = false;
    this.__videoIsPlaying = false;
    this.__setState({ mode: Mode.Accepting });
  }

  async useImageUrl(url: string): Promise<void> {
    this.__usingCamera = false;
    if (!this.__image) {
      this.__pendingInputSource = () => void this.useImageUrl(url);
      return;
    }
    this.__releaseCamera();
    this.__image.crossOrigin = 'anonymous';
    this.__image.onload = () => {
      this.__setAspectRatioDimensions(this.__image!.naturalWidth, this.__image!.naturalHeight);
      this.__videoIsPlaying = true;
    };
    this.__image.onerror = () => console.warn('pix_n_flix: failed to load image URL:', url);
    this.__image.src = url;
    this.__setState({ mode: Mode.Image });
  }

  async useVideoUrl(url: string): Promise<void> {
    this.__usingCamera = false;
    if (!this.__video) {
      this.__pendingInputSource = () => void this.useVideoUrl(url);
      return;
    }
    this.__releaseCamera();
    this.__video.crossOrigin = 'anonymous';
    this.__video.onended = this.__handleVideoEnded;
    this.__video.onloadedmetadata = () => this.__setAspectRatioDimensions(this.__video!.videoWidth, this.__video!.videoHeight);
    this.__video.src = url;
    this.__setState({ mode: Mode.Video, hasAudio: true });
    this.__videoIsPlaying = true;
    void this.__video.play();
  }

  $keepAspectRatio(keep: boolean): void {
    this.__keepAspectRatio = keep;
  }

  $setLoopCount(n: number): void {
    this.__loopCount = n;
  }

  $pauseAt(pauseTimeMs: number): void {
    setTimeout(() => this.__pause(), pauseTimeMs);
  }

  async getVideoTime(): Promise<number> {
    return this.__totalElapsedMs;
  }

  $stopStreaming(): void {
    this.__stopCapture();
    this.__releaseCamera();
  }

  // Exposed for the view component's play/pause buttons - not part of PixNFlixTabRpc, since
  // play/pause is purely tab-side UI state with no module involvement (see protocol.ts).
  __handlePlay(): void {
    this.__resume();
  }

  __handleStill(): void {
    this.__pause();
  }

  __handleFileDrop(file: File): void {
    if (this.__state.mode !== Mode.Accepting) return;
    if (file.type.match('video.*') && this.__video) {
      this.__video.src = URL.createObjectURL(file);
      this.__video.onended = this.__handleVideoEnded;
      this.__setState({ mode: Mode.Video, hasAudio: true });
      this.__videoIsPlaying = true;
      void this.__video.play();
    } else if (file.type.match('image.*') && this.__image) {
      this.__image.src = URL.createObjectURL(file);
      this.__setState({ mode: Mode.Image });
      this.__videoIsPlaying = true;
    }
  }
}
checkIsPluginClass(PixNFlixTabPlugin);

interface ViewProps {
  plugin: PixNFlixTabPlugin;
  state: ViewState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  imageRef: React.RefObject<HTMLImageElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

function PixNFlixView_({ plugin, state, videoRef, imageRef, canvasRef }: ViewProps) {
  const { mode, width, height, fps, volume, hasAudio } = state;
  const displayOptions = mode === Mode.Still || mode === Mode.Video;
  const videoIsActive = mode === Mode.Video;
  const isAccepting = mode === Mode.Accepting;

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) plugin.__handleFileDrop(file);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) plugin.__handleFileDrop(file);
  };
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    plugin.$updateVolume(parseFloat(e.target.value));
  };

  return (
    <div className="sa-video" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="sa-video-header">
        <div className="sa-video-header-element" style={{ display: displayOptions ? 'inherit' : 'none' }}>
          <ButtonGroup>
            <Button className="sa-live-video-button" icon="video" active={videoIsActive} onClick={() => plugin.__handlePlay()} text="Play Video" />
            <Button className="sa-still-image-button" icon="camera" active={!videoIsActive} onClick={() => plugin.__handleStill()} text="Pause Video" />
          </ButtonGroup>
        </div>
        <Divider />
        <div className="sa-video-header-element" style={{ display: displayOptions ? 'inherit' : 'none' }}>
          <div className="sa-video-header-numeric-input">
            <NumericInput disabled leftIcon="horizontal-distribution" style={{ width: 70 }} value={width} minorStepSize={1} stepSize={10} majorStepSize={100} max={MAX_WIDTH} min={MIN_WIDTH} />
          </div>
          <div className="sa-video-header-numeric-input">
            <NumericInput disabled leftIcon="vertical-distribution" style={{ width: 70 }} value={height} minorStepSize={1} stepSize={10} majorStepSize={100} max={MAX_HEIGHT} min={MIN_HEIGHT} />
          </div>
          <div className="sa-video-header-numeric-input">
            <NumericInput leftIcon="stopwatch" style={{ width: 60 }} value={fps} onValueChange={value => plugin.$updateFPS(value)} minorStepSize={null} stepSize={1} majorStepSize={null} max={MAX_FPS} min={MIN_FPS} />
          </div>
        </div>
      </div>
      <div className="sa-video-element">
        <img ref={imageRef} width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} style={{ display: 'none' }} />
        <video ref={videoRef} autoPlay width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} style={{ display: 'none' }} />
        <canvas ref={canvasRef} width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} style={{ display: !isAccepting ? 'initial' : 'none' }} />
        <br />
        <div style={{ display: isAccepting ? 'inherit' : 'none' }}>
          <div style={{ fontSize: 40 }}>Drag file here</div>
          <br />
          <input type="file" onChange={handleFileUpload} />
        </div>
        <br />
        <div style={{ display: hasAudio && !isAccepting ? 'inherit' : 'none' }}>
          Volume:
          <input type="range" onChange={handleVolumeChange} min={0} max={1} value={volume / 100} step={0.01} />
        </div>
        <p style={{ display: displayOptions ? 'inherit' : 'none', fontFamily: 'arial' }}>
          Note: Is video lagging? Switch to &apos;still image&apos; or adjust FPS rate!
        </p>
      </div>
    </div>
  );
}
