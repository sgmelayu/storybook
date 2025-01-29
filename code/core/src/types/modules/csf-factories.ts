import { composeConfigs, normalizeProjectAnnotations } from '@storybook/core/preview-api';

import type { Args, ComponentAnnotations, Renderer, StoryAnnotations } from './csf';
import type {
  NormalizedComponentAnnotations,
  NormalizedProjectAnnotations,
  NormalizedStoryAnnotations,
  ProjectAnnotations,
} from './story';

export interface Preview<TRenderer extends Renderer> {
  readonly _tag: 'Preview';
  input: ProjectAnnotations<TRenderer>;
  composed: NormalizedProjectAnnotations<TRenderer>;

  meta(input: ComponentAnnotations<TRenderer>): Meta<TRenderer>;
}

export function definePreview<TRenderer extends Renderer>(
  preview: Preview<TRenderer>['input']
): Preview<TRenderer> {
  return {
    _tag: 'Preview',
    input: preview,
    get composed() {
      const { addons, ...rest } = preview;
      return normalizeProjectAnnotations<TRenderer>(composeConfigs([...(addons ?? []), rest]));
    },
    meta(meta: ComponentAnnotations<TRenderer>) {
      return defineMeta(meta, this);
    },
  };
}

function isPreview(input: unknown): input is Preview<Renderer> {
  return input != null && typeof input === 'object' && '_tag' in input && input?._tag === 'Preview';
}

export interface Meta<TRenderer extends Renderer, TArgs extends Args = Args> {
  readonly _tag: 'Meta';
  input: ComponentAnnotations<TRenderer, TArgs>;
  composed: NormalizedComponentAnnotations<TRenderer>;
  preview: Preview<TRenderer>;

  story(input: ComponentAnnotations<TRenderer, TArgs>): Story<TRenderer, TArgs>;
}

function isMeta(input: unknown): input is Meta<Renderer> {
  return input != null && typeof input === 'object' && '_tag' in input && input?._tag === 'Meta';
}

function defineMeta<TRenderer extends Renderer>(
  input: ComponentAnnotations<TRenderer>,
  preview: Preview<TRenderer>
): Meta<TRenderer> {
  return {
    _tag: 'Meta',
    input,
    preview,
    get composed(): never {
      throw new Error('Not implemented');
    },
    story(story: StoryAnnotations<TRenderer>) {
      return defineStory(story, this);
    },
  };
}

export interface Story<TRenderer extends Renderer, TArgs extends Args = Args> {
  readonly _tag: 'Story';
  input: StoryAnnotations<TRenderer, TArgs>;
  composed: NormalizedStoryAnnotations<TRenderer>;
  meta: Meta<TRenderer, TArgs>;
}

function defineStory<TRenderer extends Renderer>(
  input: ComponentAnnotations<TRenderer>,
  meta: Meta<TRenderer>
): Story<TRenderer> {
  return {
    _tag: 'Story',
    input,
    meta,
    get composed(): never {
      throw new Error('Not implemented');
    },
  };
}

function isStory(input: unknown): input is Meta<Renderer> {
  return input != null && typeof input === 'object' && '_tag' in input && input?._tag === 'Story';
}
