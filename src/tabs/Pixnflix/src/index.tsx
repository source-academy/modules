import { DEFAULT_FPS, DEFAULT_LOOP } from '@sourceacademy/bundle-pix_n_flix/constants';
import type { InputMode, PixNFlixGlobalState } from '@sourceacademy/bundle-pix_n_flix/types';
import { defineTab, getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import type { ModuleTab } from '@sourceacademy/modules-lib/types';
import type { DragEvent, ReactNode } from 'react';
import { CameraDisplay, ImageDisplay, VideoDisplay } from './Displays';

const PixNFlix: ModuleTab = ({ debuggerCtx }) => {
  const state = getModuleState<PixNFlixGlobalState>(debuggerCtx, 'pix_n_flix')!;

  const setInputMode = (mode: InputMode) => {
    state.changeInputMode(mode);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length === 0) return;
    const [file] = e.dataTransfer.files;

    if (file.type.match('video.*')) {
      setInputMode({
        type: 'video',
        url: URL.createObjectURL(file),
        volume: 0.5,
        fps: DEFAULT_FPS,
        loopCount: DEFAULT_LOOP
      });
    } else if (file.type.match('image.*')) {
      setInputMode({
        type: 'image',
        url: URL.createObjectURL(file),
      });
    }
  };

  let displayElement: ReactNode;

  switch (state.inputMode.type) {
    case 'camera': {
      displayElement = <CameraDisplay
        keepAspectRatio
        state={state}
        input={state.inputMode}
      />;
      break;
    }
    case 'image': {
      displayElement = <ImageDisplay
        keepAspectRatio
        state={state}
        input={state.inputMode}
      />;
      break;
    }
    case 'video': {
      displayElement = <VideoDisplay
        keepAspectRatio
        state={state}
        input={state.inputMode}
      />;
      break;
    }
    case 'local': {
      displayElement = <p>
        You need to upload a video or image!
      </p>;
      break;
    }
  }

  return <div
    className="sa-video"
    onDragOver={e => e.preventDefault()}
    onDrop={handleDrop}
  >
    {displayElement}
  </div>;
};

export default defineTab({
  toSpawn: ctx => {
    const state = getModuleState(ctx, 'pix_n_flix');
    return state !== null;
  },
  body: debuggerContext => <PixNFlix debuggerCtx={debuggerContext} />,
  label: 'PixNFlix Live Feed',
  iconName: 'mobile-video'
});
