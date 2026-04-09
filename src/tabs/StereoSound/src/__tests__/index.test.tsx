import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
import { expect, test, vi, type MockedFunction } from 'vitest';
import StereoSoundTab from '..';

function getContextObject() {
  const propertyAccessor = vi.fn((target: any, prop: string, _receiver: any) => {
    return target[prop];
  });

  const contextObject: DebuggerContext = {
    context: {
      moduleContexts: new Proxy({
        stereo_sound: {
          state: {
            audioPlayed: [],
          },
          tabs: null,
        }
      }, {
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
