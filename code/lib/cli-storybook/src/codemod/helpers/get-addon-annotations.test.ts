import { describe, expect, it } from 'vitest';

import { getAnnotationsName } from './get-addon-annotations';

describe('getAnnotationsName', () => {
  it('should handle @storybook namespace and camel case conversion', () => {
    expect(getAnnotationsName('@storybook/addon-essentials')).toBe('addonEssentialsAnnotations');
  });

  it('should handle other namespaces and camel case conversion', () => {
    expect(getAnnotationsName('@kudos-components/testing/module')).toBe(
      'kudosComponentsTestingModuleAnnotations'
    );
  });

  it('should handle strings without namespaces', () => {
    expect(getAnnotationsName('plain-text/example')).toBe('plainTextExampleAnnotations');
  });

  it('should handle strings with multiple special characters', () => {
    expect(getAnnotationsName('@storybook/multi-part/example-test')).toBe(
      'multiPartExampleTestAnnotations'
    );
  });
});
