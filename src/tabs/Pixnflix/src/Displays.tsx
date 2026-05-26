import { copy_image } from '@sourceacademy/bundle-pix_n_flix/functions';
import type { CameraInputMode, ImageInputMode, PixNFlixGlobalState, Pixel, Pixels, VideoInputMode } from '@sourceacademy/bundle-pix_n_flix/types';
import { useAnimation, type AnimationHookContext } from '@sourceacademy/modules-lib/tabs/useAnimation';
import { isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
import { useCallback, useEffect, useRef } from 'react';
import { VideoControls } from './Controls';

/**
 * Creates a black image with the given height and width
 *
 * @param height Height of image (in number of pixels)
 * @param width Width of image (in number of pixels)
 */
function new_image(height: number, width: number): Pixels {
  const img: Pixels = [];
  for (let i = 0; i < height; i += 1) {
    img[i] = [];
    for (let j = 0; j < width; j += 1) {
      img[i][j] = [0, 0, 0, 255];
    }
  }
  return img;
}

/**
 * Determines whether the r,g,b and a values for the pixel
 * are valid (i.e between 0 and 255). If that value is out of range,
 * then that value gets set to 0.
 * Exported for testing.
 * @hidden
 */
export function isPixelValid(pixel: Pixel): boolean {
  let ok = true;
  for (let i = 0; i < 4; i += 1) {
    const value = pixel[i];
    if (isNumberWithinRange(value, 0, 255)) {
      continue;
    }

    ok = false;
    pixel[i] = 0;
  }
  return ok;
}

/**
 * Write the provided pixel data to the buffer, performing error checking
 * and resetting invalid pixels.
 * Exported for testing.
 * @hidden
 */
export function writeToBuffer(buffer: Uint8ClampedArray, data: Pixels, [width, height]: Dimensions) {
  let ok = true;

  for (let i = 0; i < Math.min(height, data.length); i++) {
    const row = data[i];

    for (let j = 0; j < Math.min(width, row.length); j++) {
      const p = i * width * 4 + j * 4;
      if (!isPixelValid(row[j])) {
        ok = false;
      }
      buffer[p] = row[j][0];
      buffer[p + 1] = row[j][1];
      buffer[p + 2] = row[j][2];
      buffer[p + 3] = row[j][3];
    }
  }

  if (!ok) {
    const warningMessage
      = 'You have invalid values for some pixels! Reseting them to default (0)';
    console.warn(warningMessage);
    errorLogger(warningMessage, false);
  }
}

/**
 * Retrieve pixel data from the buffer and convert it to the 2D array format.
 * @hidden
 */
function readFromBuffer(pixelData: Uint8ClampedArray, src: Pixels, [width, height]: Dimensions) {
  for (let i = 0; i < Math.min(height, src.length); i++) {
    const row = src[i];
    for (let j = 0; i < Math.min(width, row.length); j++) {
      const p = i * width * 4 + j * 4;
      row[j] = [
        pixelData[p],
        pixelData[p + 1],
        pixelData[p + 2],
        pixelData[p + 3]
      ];
    }
  }
}

/**
 * Draws the image from the provided input source out to the
 * canvas
 */
function drawImage(
  source: HTMLImageElement | HTMLVideoElement,
  renderContext: CanvasRenderingContext2D,
  state: PixNFlixGlobalState,
  keepAspectRatio: boolean,
): void {
  const [width, height] = state.expectedDimensions;

  if (keepAspectRatio) {
    renderContext.rect(0, 0, width, height);
    renderContext.fill();
    renderContext.drawImage(
      source,
      0,
      0,
      intrinsicWidth,
      intrinsicHeight,
      (width - displayWidth) / 2,
      (height - displayHeight) / 2,
      displayWidth,
      displayHeight
    );
  } else renderContext.drawImage(source, 0, 0, width, height);

  const pixelObj = renderContext.getImageData(0, 0, width, height);

  const srcBuffer = new_image(height, width);
  readFromBuffer(pixelObj.data, srcBuffer, state.expectedDimensions);

  const outBuffer = new_image(height, width);

  // Runtime checks to guard against crashes
  try {
    state.filter(srcBuffer, outBuffer);
    writeToBuffer(pixelObj.data, outBuffer, state.expectedDimensions);
  } catch (e: any) {
    console.error(JSON.stringify(e));
    const errMsg = `There is an error with filter function, filter will be reset to default. ${e.name}: ${e.message}`;
    console.error(errMsg);

    if (!e.name) {
      errorLogger('There is an error with filter function (error shown below). Filter will be reset back to the default. If you are facing an infinite loop error, you can consider increasing the timeout period (clock icon) at the top / reducing the frame dimensions.');

      errorLogger([e], true);
    } else {
      errorLogger(errMsg, false);
    }

    state.filter = copy_image;
  }

  renderContext.putImageData(pixelObj, 0, 0);
}

interface ImageDisplayProps {
  state: PixNFlixGlobalState;
  input: ImageInputMode;
  keepAspectRatio: boolean;
}

/**
 * Component used to display static images
 */
export function ImageDisplay({ input, state, keepAspectRatio }: ImageDisplayProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    imageRef.current.onloadedmetadata = () => {
      state.expectedDimensions = [
        imageRef.current!.naturalWidth,
        imageRef.current!.naturalHeight,
      ];
    };
  }, [imageRef.current, input]);

  useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    drawImage(imageRef.current, context, state, keepAspectRatio);

  }, [imageRef.current, canvasRef.current, input, keepAspectRatio]);

  return <>
    <img
      ref={imageRef}
      crossOrigin='anonymous'
      src={input.url}
      height={state.expectedDimensions[1]}
      width={state.expectedDimensions[0]}
    />
    <canvas
      height={state.expectedDimensions[1]}
      width={state.expectedDimensions[0]}
      ref={canvasRef}
    />
  </>;
}

interface VideoDisplayProps {
  state: PixNFlixGlobalState;
  input: VideoInputMode;
  keepAspectRatio: boolean;
}

export function VideoDisplay({
  state,
  input,
  keepAspectRatio
}: VideoDisplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopRef = useRef(0);
  const durationRef = useRef(0);

  useEffect(() => {
    // Effect triggers whenever a new video is loaded
    if (!videoRef.current) return;

    loopRef.current = 0;
    durationRef.current = videoRef.current.duration;

    videoRef.current.onloadedmetadata = () => {
      state.expectedDimensions = [
        videoRef.current!.videoWidth,
        videoRef.current!.videoHeight
      ];
    };
  }, [videoRef.current, input.url]);

  const animCallback = useCallback(({ canvas }: AnimationHookContext) => {
    if (!videoRef.current) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    drawImage(
      videoRef.current,
      context,
      state,
      keepAspectRatio
    );
  }, [keepAspectRatio, state, videoRef.current]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = input.volume;
  }, [videoRef.current, input.volume]);

  const { isPlaying, start, stop, setCanvas } = useAnimation({
    callback: animCallback,
    animationDuration: durationRef.current,
    frameDuration: 1000 / input.fps
  });

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.onended = () => {
      loopRef.current++;

      if (loopRef.current >= input.loopCount) {
        stop();
      }
    };
  }, [videoRef.current, input.loopCount]);

  return <>
    <VideoControls
      isPlaying={isPlaying}
      onClickStart={start}
      onClickStop={stop}
      fps={input.fps}
      onFpsChange={newValue => {
        input.fps = newValue;
      }}
    />
    <video
      ref={videoRef}
      src={input.url}
      crossOrigin='anonymous'
      height={state.expectedDimensions[1]}
      width={state.expectedDimensions[0]}
    />
    <canvas
      height={state.expectedDimensions[1]}
      width={state.expectedDimensions[0]}
      ref={r => {
        if (r) setCanvas(r);
      }} />
  </>;
}

interface CameraDisplayProps {
  state: PixNFlixGlobalState;
  input: CameraInputMode;
  keepAspectRatio: boolean;
}

export function CameraDisplay({ state, input, keepAspectRatio }: CameraDisplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const animCallback = useCallback(({ canvas }: AnimationHookContext) => {
    if (!videoRef.current) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    drawImage(
      videoRef.current,
      context,
      state,
      keepAspectRatio
    );
  }, [keepAspectRatio, state, videoRef.current]);

  useEffect(() => {
    if (!videoRef.current || !input.stream) return;
    videoRef.current.srcObject = input.stream;
  }, [videoRef.current, input.stream]);

  useEffect(() => {
    return () => {
      if (input.stream) {
        input.stream.getTracks().forEach(each => each.stop());
      }
    };
  }, [input.stream]);

  const { isPlaying, start, stop, setCanvas } = useAnimation({
    callback: animCallback,
    frameDuration: 1000 / input.fps
  });

  if (!input.stream) {
    return <p>
      You need to allow your browser access to your video camera to use camera mode!
    </p>;
  }

  return <>
    <VideoControls
      isPlaying={isPlaying}
      onClickStart={start}
      onClickStop={stop}
      fps={input.fps}
      onFpsChange={newValue => {
        // TODO: Check rerender
        input.fps = newValue;
      }}
    />
    <video
      height={state.expectedDimensions[1]}
      width={state.expectedDimensions[0]}
      ref={videoRef}
    />
    <canvas
      height={state.expectedDimensions[1]}
      width={state.expectedDimensions[0]}
      ref={r => {
        if (r) setCanvas(r);
      }} />
  </>;
}
