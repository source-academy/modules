import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
import { expect, test, vi, type MockedFunction } from 'vitest';
import StereoSoundTab from '..';

function getContextObject() {
  const propertyAccessor = vi.fn((_target: any, _p: string, _receiver: any) => ({
    state: {
      audioPlayed: []
    }
  }));

  const contextObject: DebuggerContext = {
    context: {
      moduleContexts: new Proxy({}, {
        get: propertyAccessor,
      })
    }
  } as any;

  return [contextObject, propertyAccessor] as [DebuggerContext, MockedFunction<typeof propertyAccessor>];
}

test('tosSpawn asks for the stereo_sound context', () => {
  const [contextObject, propertyAccessor] = getContextObject();

  expect(StereoSoundTab.toSpawn(contextObject)).toEqual(false);
  expect(propertyAccessor).toHaveBeenCalledExactlyOnceWith(expect.any(Object), 'stereo_sound', expect.any(Object));
});
