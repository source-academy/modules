export const PIX_N_FLIX_CONTROL_CHANNEL_ID = 'sourceacademy-pix-n-flix-control-channel';
/**
 * A dedicated channel for raw captured/processed video frames, deliberately separate from
 * {@link PIX_N_FLIX_CONTROL_CHANNEL_ID} and never routed through `makeRpc`: every `makeRpc` call
 * structured-clones its arguments (see conductor's `makeRpc.ts` - `channel.send` is only ever
 * called there without a `transfer` list), which would silently copy a whole video frame twice
 * per frame. Frame messages on this channel are sent directly via `IChannel.send(message,
 * [buffer])`, transferring the underlying `ArrayBuffer` instead of cloning it.
 */
export const PIX_N_FLIX_FRAME_CHANNEL_ID = 'sourceacademy-pix-n-flix-frame-channel';
export const PIX_N_FLIX_WEB_ID = 'pix-n-flix-web';
export const PIX_N_FLIX_TAB_NAME = 'Pixnflix';

/** Tab → module: a freshly captured frame, ready to be filtered. */
export interface CapturedFrameMessage {
  kind: 'captured-frame';
  /** RGBA, width * height * 4 bytes - the same layout `ImageData.data` uses. */
  buffer: ArrayBuffer;
  width: number;
  height: number;
}

/** Module → tab: the filtered result of a previously sent {@link CapturedFrameMessage}. */
export interface FilteredFrameMessage {
  kind: 'filtered-frame';
  buffer: ArrayBuffer;
}

export type FrameChannelMessage = CapturedFrameMessage | FilteredFrameMessage;

/**
 * Host-side (browser main thread) operations the pix_n_flix module's runner-side plugin invokes
 * over {@link PIX_N_FLIX_CONTROL_CHANNEL_ID} via Conductor's `makeRpc` helper. Actual camera/
 * video/canvas access only works on the browser main thread, not inside Conductor's runner
 * Worker, hence the round trip instead of touching those APIs directly from the module - mirrors
 * `SoundTabRpc` in `sound/src/protocol.ts`.
 *
 * Methods prefixed with `$` are fire-and-forget (no reply is awaited); everything else is a
 * normal RPC call that resolves/rejects once the tab replies.
 */
export interface PixNFlixTabRpc {
  /**
   * Requests new display dimensions; resolves once the tab has resized its video/canvas elements.
   * Play/pause, by contrast, are purely tab-side UI state (the "Play Video"/"Pause Video" buttons)
   * with no module involvement at all - unlike the pre-migration version, the module never
   * touches DOM elements, so it has no reason to track or drive playback state itself; its only
   * job per frame is receiving a captured frame and returning a filtered one (see
   * `FrameChannelMessage`).
   */
  updateDimensions(width: number, height: number): Promise<void>;
  /** Sets the frame rate the tab's draw loop targets. */
  $updateFPS(fps: number): void;
  /** Sets the local video element's playback volume (0-1). */
  $updateVolume(volume: number): void;
  /** Switches to reading from the local camera (getUserMedia). */
  useLocalFile(): Promise<void>;
  /** Switches to loading a still image from the given URL. */
  useImageUrl(url: string): Promise<void>;
  /** Switches to loading a video from the given URL. */
  useVideoUrl(url: string): Promise<void>;
  /** Sets whether the tab preserves the source's aspect ratio when drawing into the display canvas. */
  $keepAspectRatio(keep: boolean): void;
  /** Sets how many times a URL-sourced video repeats before it settles on a still frame. */
  $setLoopCount(n: number): void;
  /**
   * Schedules the tab to pause the video (switching to a still frame) `pauseTimeMs` after it
   * started - the tab owns this timer entirely (mirrors the pre-migration `pause_at`'s
   * `lateEnqueue(() => setTimeout(tabsPackage.onClickStill, pause_time))`, but the timer and the
   * state it affects are both tab-side now, so no callback back into the module is needed).
   */
  $pauseAt(pauseTimeMs: number): void;
  /** Reads the elapsed playback time (ms) - accumulated by the tab's own draw loop. */
  getVideoTime(): Promise<number>;
  /**
   * Stops the capture loop and releases the camera - the actual "stop the feed" action, called
   * from the module's stop() alongside endPendingWork().
   */
  $stopStreaming(): void;
}
