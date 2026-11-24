import { describe, expect, it, vi } from 'vitest';
import * as academy from '../UnityAcademy';
import { Vector3 } from '../UnityAcademyMaths';
import * as funcs from '../functions';

const mockedGetInstance = vi.spyOn(academy, 'getInstance');
const testIdentifier = new academy.GameObjectIdentifier('test');

/**
 * For the `testInstance` parameter:
 * - Passing `undefined` simulates uninitialized instance
 * - Passing `'destroyed'` simulates a destroyed object
 * - Passing anything else is given as the return value to `getInstance`.
 *
 * If the instance is anything other than `undefined`, the `gameObjectIdentifierWrapperClass`
 * is automatically set to {@link academy.GameObjectIdentifier}
 *
 * Game objects will always not be destroyed unless `testInstance` is `'destroyed'`.
 */
function testWithInstance<T extends Partial<academy.UnityAcademyJsInteropContext> | undefined>(
  desc: string,
  testInstance: T,
  testFn: (instance: T) => void,
  skipOrOnly?: 'only' | 'skip',
): void;
function testWithInstance(
  desc: string,
  testInstance: 'destroyed',
  testFn: (instance: undefined) => void,
  skipOrOnly?: 'only' | 'skip',
): void;
function testWithInstance<T extends Partial<academy.UnityAcademyJsInteropContext> | undefined>(
  desc: string,
  testInstance: T | 'destroyed',
  testFn: (instance: T) => void,
  skipOrOnly?: 'only' | 'skip',
) {
  let fn: (desc: string, testFn: () => void) => void;
  if (skipOrOnly === 'skip') {
    fn = it.skip;
  } else if (skipOrOnly === 'only') {
    fn = it.only;
  } else {
    fn = it;
  }

  let instance: any;
  if (testInstance === 'destroyed') {
    instance = {
      gameObjectIdentifierWrapperClass: academy.GameObjectIdentifier,
      getStudentGameObject: () => ({ isDestroyed: true } as any)
    };
  } else {
    if (testInstance === undefined) {
      instance = testInstance;
    } else {
      instance = {
        gameObjectIdentifierWrapperClass: academy.GameObjectIdentifier,
        ...testInstance,
      };

      if (!instance.getStudentGameObject) {
        instance.getStudentGameObject = () => ({ isDestroyed: false } as any);
      }
    }
  }

  fn(desc, () => {
    mockedGetInstance.mockReturnValue(instance);
    try {
      testFn(instance);
      expect(mockedGetInstance).toHaveBeenCalled();
    } finally {
      mockedGetInstance.mockClear();
    }
  });
};

describe(funcs.add_impulse_force, () => {
  testWithInstance('throws when instance has not been initializede', undefined, () => {
    expect(() => funcs.add_impulse_force(
      new academy.GameObjectIdentifier('test'),
      new Vector3(0, 0, 0)
    )).toThrow(
      'add_impulse_force: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });

  testWithInstance(
    'throws when identifier isn\'t valid',
    {},
    () => {
      expect(() => funcs.add_impulse_force(0 as any, new Vector3(0, 0, 0))).toThrow(
        'add_impulse_force: Expected GameObjectIdentifier, got 0.'
      );
    }
  );

  testWithInstance(
    'works',
    { addImpulseForceInternal: vi.fn() },
    ({ addImpulseForceInternal }) => {
      expect(funcs.add_impulse_force(
        testIdentifier,
        new Vector3(0, 0, 0)
      )).toBeUndefined();

      expect(addImpulseForceInternal).toHaveBeenCalledOnce();
    }
  );
});

describe(funcs.add_vectors, () => {
  it('throws when first parameter is not Vector3', () => {
    expect(() => funcs.add_vectors(0 as any, new Vector3(0, 0, 0)))
      .toThrow('add_vectors: Expected 3D vector for vectorA, got 0.');
  });

  it('throws when second parameter is not Vector3', () => {
    expect(() => funcs.add_vectors(new Vector3(0, 0, 0), 0 as any))
      .toThrow('add_vectors: Expected 3D vector for vectorB, got 0.');
  });

  it('works', () => {
    const lhs = new Vector3(1, 1, 1);
    const rhs = new Vector3(1, 2, 3);
    const expected = new Vector3(2, 3, 4);
    expect(funcs.add_vectors(lhs, rhs).equals(expected)).toEqual(true);
  });
});

describe(funcs.apply_rigidbody, () => {
  testWithInstance(
    'throws when instance has not been initialized',
    undefined,
    () => {
      expect(() => funcs.apply_rigidbody(testIdentifier))
        .toThrow(
          'apply_rigidbody: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
        );
    },
  );

  testWithInstance(
    'throws when game object is destroyed',
    'destroyed',
    () => {
      expect(() => funcs.apply_rigidbody(testIdentifier))
        .toThrow('apply_rigidbody: Trying to use a GameObject that is already destroyed.');
    },
  );

  testWithInstance(
    'works',
    { applyRigidbodyInternal: vi.fn() },
    ({ applyRigidbodyInternal }) => {
      expect(funcs.apply_rigidbody(testIdentifier)).toBeUndefined();
      expect(applyRigidbodyInternal).toHaveBeenCalledOnce();
    },
  );
});

describe(funcs.assertIsValidKeyCode, () => {
  it('throws when provided not a string', () => {
    expect(() => funcs.assertIsValidKeyCode(0, 'foo')).toThrow('foo: Expected KeyCode, got 0.');
  });

  it('throws when provided a string of length 2', () => {
    expect(() => funcs.assertIsValidKeyCode('hi', 'foo')).toThrow('foo: Expected KeyCode, got "hi".');
  });

  describe('doesn\'t throw for the button codes', () => {
    it.each(funcs.BUTTON_KEY_CODES)('%s', (code) => {
      expect(() => funcs.assertIsValidKeyCode(code, 'foo')).not.toThrow();
    });
  });

  describe('doesn\'t throw for letters and numbers', () => {
    let letters = 'abcdefghijklmnopqrstuvwxyz';

    letters += letters.toUpperCase();
    letters += '0123456789';

    it.each(letters.split(''))('%s', code => {
      expect(() => funcs.assertIsValidKeyCode(code, 'foo')).not.toThrow();
    });
  });
});

describe(funcs.change_audio_clip, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.change_audio_clip(
      testIdentifier,
      new academy.AudioClipIdentifier('test')
    )).toThrow(
      'change_audio_clip: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });

  testWithInstance(
    'throws when audioSrc is not a GameObjectIdentifier',
    {},
    () => {
      expect(() => funcs.change_audio_clip(
        0 as any,
        new academy.AudioClipIdentifier('test')
      )).toThrow(
        'change_audio_clip: Expected GameObjectIdentifier, got 0.'
      );
    }
  );

  testWithInstance(
    'throws when audioSrc is destroyed',
    'destroyed',
    () => {
      expect(() => funcs.change_audio_clip(
        testIdentifier,
        new academy.AudioClipIdentifier('test')
      )).toThrow(
        'change_audio_clip: Trying to use a GameObject that is already destroyed.'
      );
    }
  );

  testWithInstance(
    'works',
    { setAudioSourceProp: vi.fn() },
    ({ setAudioSourceProp }) => {
      const audioId = new academy.AudioClipIdentifier('test');

      expect(funcs.change_audio_clip(
        testIdentifier,
        audioId
      )).toBeUndefined();

      expect(setAudioSourceProp)
        .toHaveBeenCalledExactlyOnceWith(
          'audioClipIdentifier',
          testIdentifier,
          audioId,
        );
    }
  );
});

describe(funcs.copy_position, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.copy_position(
      testIdentifier,
      testIdentifier,
      new Vector3(0, 0, 0)
    )).toThrow(
      'copy_position: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });

  testWithInstance(
    'throws when from is not a GameObjectIdentifier',
    {},
    () => {
      expect(() => funcs.copy_position(
        0 as any,
        testIdentifier,
        new Vector3(0, 0, 0)
      )).toThrow(
        'copy_position: Expected GameObjectIdentifier for from, got 0.'
      );
    }
  );

  testWithInstance(
    'throws when to is not a GameObjectIdentifier',
    {},
    () => {
      expect(() => funcs.copy_position(
        testIdentifier,
        0 as any,
        new Vector3(0, 0, 0)
      )).toThrow(
        'copy_position: Expected GameObjectIdentifier for to, got 0.'
      );
    }
  );

  testWithInstance(
    'works',
    { copyTransformPropertiesInternal: vi.fn() },
    ({ copyTransformPropertiesInternal }) => {
      const testVector = new Vector3(0, 0, 0);
      expect(funcs.copy_position(testIdentifier, testIdentifier, testVector)).toBeUndefined();

      expect(copyTransformPropertiesInternal).toHaveBeenCalledExactlyOnceWith(
        'position',
        testIdentifier,
        testIdentifier,
        testVector
      );
    }
  );
});

describe(funcs.copy_rotation, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.copy_rotation(
      testIdentifier,
      testIdentifier,
      new Vector3(0, 0, 0)
    )).toThrow(
      'copy_rotation: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });

  testWithInstance(
    'throws when from is not a GameObjectIdentifier',
    {},
    () => {
      expect(() => funcs.copy_rotation(
        0 as any,
        testIdentifier,
        new Vector3(0, 0, 0)
      )).toThrow(
        'copy_rotation: Expected GameObjectIdentifier for from, got 0.'
      );
    }
  );

  testWithInstance(
    'throws when to is not a GameObjectIdentifier',
    {},
    () => {
      expect(() => funcs.copy_rotation(
        testIdentifier,
        0 as any,
        new Vector3(0, 0, 0)
      )).toThrow(
        'copy_rotation: Expected GameObjectIdentifier for to, got 0.'
      );
    }
  );

  testWithInstance(
    'works',
    { copyTransformPropertiesInternal: vi.fn() },
    ({ copyTransformPropertiesInternal }) => {
      const testVector = new Vector3(0, 0, 0);
      expect(funcs.copy_rotation(testIdentifier, testIdentifier, testVector)).toBeUndefined();

      expect(copyTransformPropertiesInternal).toHaveBeenCalledExactlyOnceWith(
        'rotation',
        testIdentifier,
        testIdentifier,
        testVector
      );
    }
  );
});

describe(funcs.copy_scale, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.copy_scale(
      testIdentifier,
      testIdentifier,
      new Vector3(0, 0, 0)
    )).toThrow(
      'copy_scale: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });

  testWithInstance(
    'throws when from is not a GameObjectIdentifier',
    {},
    () => {
      expect(() => funcs.copy_scale(
        0 as any,
        testIdentifier,
        new Vector3(0, 0, 0)
      )).toThrow(
        'copy_scale: Expected GameObjectIdentifier for from, got 0.'
      );
    }
  );

  testWithInstance(
    'throws when to is not a GameObjectIdentifier',
    {},
    () => {
      expect(() => funcs.copy_scale(
        testIdentifier,
        0 as any,
        new Vector3(0, 0, 0)
      )).toThrow(
        'copy_scale: Expected GameObjectIdentifier for to, got 0.'
      );
    }
  );

  testWithInstance(
    'works',
    { copyTransformPropertiesInternal: vi.fn() },
    ({ copyTransformPropertiesInternal }) => {
      const testVector = new Vector3(0, 0, 0);
      expect(funcs.copy_scale(testIdentifier, testIdentifier, testVector)).toBeUndefined();

      expect(copyTransformPropertiesInternal).toHaveBeenCalledExactlyOnceWith(
        'scale',
        testIdentifier,
        testIdentifier,
        testVector
      );
    }
  );
});

describe(funcs.cross, () => {
  it('throws when first parameter is not Vector3', () => {
    expect(() => funcs.cross(0 as any, new Vector3(0, 0, 0)))
      .toThrow('cross: Expected 3D vector for vectorA, got 0.');
  });

  it('throws when second parameter is not Vector3', () => {
    expect(() => funcs.cross(new Vector3(0, 0, 0), 0 as any))
      .toThrow('cross: Expected 3D vector for vectorB, got 0.');
  });

  it('works', () => {
    const lhs = new Vector3(1, 1, 1);
    const rhs = new Vector3(1, 2, 3);
    const expected = new Vector3(1, -2, 1);
    expect(funcs.cross(lhs, rhs).equals(expected)).toEqual(true);
  });
});

describe(funcs.debug_log, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.debug_log(0)).toThrow(
      'debug_log: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.debug_logerror, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.debug_logerror(0)).toThrow(
      'debug_logerror: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.debug_logwarning, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.debug_logwarning(0)).toThrow(
      'debug_logwarning: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.delta_time, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    mockedGetInstance.mockReturnValueOnce(undefined);
    expect(() => funcs.delta_time()).toThrow(
      'delta_time: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.destroy, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.destroy(
      new academy.GameObjectIdentifier('test')
    )).toThrow(
      'destroy: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.dot, () => {
  it('throws when first parameter is not Vector3', () => {
    expect(() => funcs.dot(0 as any, new Vector3(0, 0, 0)))
      .toThrow('dot: Expected 3D vector for vectorA, got 0.');
  });

  it('throws when second parameter is not Vector3', () => {
    expect(() => funcs.dot(new Vector3(0, 0, 0), 0 as any))
      .toThrow('dot: Expected 3D vector for vectorB, got 0.');
  });

  it('works', () => {
    const lhs = new Vector3(1, 1, 1);
    const rhs = new Vector3(1, 2, 3);
    expect(funcs.dot(lhs, rhs)).toEqual(6);
  });
});

describe(funcs.gameobject_distance, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.gameobject_distance(
      new academy.GameObjectIdentifier('test'),
      new academy.GameObjectIdentifier('test')
    )).toThrow(
      'gameobject_distance: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.get_angular_velocity, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.get_angular_velocity(
      new academy.GameObjectIdentifier('test')
    )).toThrow(
      'get_angular_velocity: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.get_audio_play_progress, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.get_audio_play_progress(
      new academy.GameObjectIdentifier('test')
    )).toThrow(
      'get_audio_play_progress: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.get_custom_prop, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.get_custom_prop(
      new academy.GameObjectIdentifier('test'),
      'prop'
    )).toThrow(
      'get_custom_prop: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.get_key, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.get_key('0')).toThrow(
      'get_key: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.get_key_down, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.get_key_down('0')).toThrow(
      'get_key_down: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.get_key_up, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.get_key_up('0')).toThrow(
      'get_key_up: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.get_main_camera_following_target, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.get_main_camera_following_target()).toThrow(
      'get_main_camera_following_target: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });
});

describe(funcs.get_mass, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.get_mass(testIdentifier)).toThrow(
      'get_mass: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });

  testWithInstance(
    'throws when identifier isn\'t valid',
    {},
    () => {
      expect(() => funcs.get_mass(0 as any)).toThrow(
        'get_mass: Expected GameObjectIdentifier, got 0.'
      );
    }
  );

  testWithInstance(
    'works',
    { getRigidbodyNumericalProp: vi.fn().mockReturnValue(10) },
    ({ getRigidbodyNumericalProp }) => {
      expect(funcs.get_mass(testIdentifier)).toEqual(10);

      expect(getRigidbodyNumericalProp).toHaveBeenCalledExactlyOnceWith('mass', testIdentifier);
    }
  );
});

describe(funcs.instantiate, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.instantiate('test')).toThrow(
      'instantiate: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });

  testWithInstance(
    'throws when instance is a 2D instance',
    { dimensionMode: '2d' },
    () => {
      expect(() => funcs.instantiate('test')).toThrow(
        'instantiate: You are calling a "3D mode only" function in non-3d mode.'
      );
    }
  );

  testWithInstance(
    'throws when prefab_name is not a string',
    { dimensionMode: '3d' },
    () => {
      expect(() => funcs.instantiate(0 as any)).toThrow('instantiate: Expected string, got 0.');
    }
  );

  testWithInstance(
    'works',
    {
      dimensionMode: '3d',
      instantiateInternal: vi.fn().mockReturnValueOnce(testIdentifier)
    },
    ({ instantiateInternal }) => {
      expect(funcs.instantiate('test')).toBe(testIdentifier);
      expect(instantiateInternal).toHaveBeenCalledExactlyOnceWith('test');
    }
  );
});

describe(funcs.instantiate_sprite, () => {
  testWithInstance('throws when instance has not been initialized', undefined, () => {
    expect(() => funcs.instantiate_sprite('test')).toThrow(
      'instantiate_sprite: Unity module is not initialized, please call init_unity_academy_3d / init_unity_academy_2d first before calling this function'
    );
  });

  testWithInstance(
    'throws when instance is a 2D instance',
    { dimensionMode: '3d' },
    () => {
      expect(() => funcs.instantiate_sprite('test')).toThrow(
        'instantiate_sprite: You are calling a "2D mode only" function in non-2d mode.'
      );
    }
  );

  testWithInstance(
    'throws when prefab_name is not a string',
    { dimensionMode: '2d' },
    () => {
      expect(() => funcs.instantiate_sprite(0 as any)).toThrow('instantiate_sprite: Expected string, got 0.');
    }
  );

  testWithInstance(
    'works',
    {
      dimensionMode: '2d',
      instantiate2DSpriteUrlInternal: vi.fn().mockReturnValueOnce(testIdentifier)
    },
    ({ instantiate2DSpriteUrlInternal }) => {
      expect(funcs.instantiate_sprite('test')).toBe(testIdentifier);
      expect(instantiate2DSpriteUrlInternal).toHaveBeenCalledExactlyOnceWith('test');
    }
  );
});
