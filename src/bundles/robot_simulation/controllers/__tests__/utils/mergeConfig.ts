import { mergeConfig } from '../../utils/mergeConfig'; // Update the path accordingly

describe('mergeConfig function', () => {
  // Test default configuration alone
  it('should return the default configuration when user configuration is undefined', () => {
    const defaultConfig = { color: 'blue', size: 'large' };
    const result = mergeConfig(defaultConfig);
    expect(result).toEqual(defaultConfig);
  });

  // Test overriding some properties
  it('should override default properties with user properties', () => {
    const defaultConfig = { color: 'blue', size: 'large', theme: 'light' };
    const userConfig = { color: 'red' }; // only overriding the color
    const expectedConfig = { color: 'red', size: 'large', theme: 'light' };
    const result = mergeConfig(defaultConfig, userConfig);
    expect(result).toEqual(expectedConfig);
  });

  // Test adding new properties
  it('should add new properties from user configuration', () => {
    type Config = { color: string, size: string, opacity?: number };
    const defaultConfig = { color: 'blue', size: 'large' };
    const userConfig = { opacity: 0.5 };
    const expectedConfig = { color: 'blue', size: 'large', opacity: 0.5 };
    const result = mergeConfig<Config>(defaultConfig, userConfig);
    expect(result).toEqual(expectedConfig);
  });

  // Test nested objects
  it('should correctly merge nested configurations', () => {
    const defaultConfig = { window: { color: 'blue', size: 'large' }, isEnabled: true };
    const userConfig = { window: { color: 'red' }, isEnabled: false };
    const expectedConfig = {
      window: { color: 'red', size: 'large' },
      isEnabled: false
    };
    const result = mergeConfig(defaultConfig, userConfig);
    expect(result).toEqual(expectedConfig);
  });

  // Test to ensure that defaultConfig is not mutated
  it('should not mutate the default configuration object', () => {
    const defaultConfig = { color: 'blue', size: 'large' };
    const userConfig = { color: 'red' };
    mergeConfig(defaultConfig, userConfig);
    expect(defaultConfig).toEqual({ color: 'blue', size: 'large' }); // Check defaultConfig remains unchanged
  });
});
