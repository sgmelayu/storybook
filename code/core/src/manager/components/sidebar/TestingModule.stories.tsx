import React from 'react';

import { styled } from '@storybook/core/theming';
import { Addon_TypesEnum } from '@storybook/core/types';
import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent } from '@storybook/test';

import type { TestProviders } from '@storybook/core/core-events';
import { ManagerContext } from '@storybook/core/manager-api';

import { TestingModule } from './TestingModule';

const TestProvider = styled.div({
  padding: 8,
  fontSize: 12,
});

const baseState = {
  details: {},
  cancellable: false,
  cancelling: false,
  running: false,
  watching: false,
  failed: false,
  crashed: false,
};

const testProviders: TestProviders[keyof TestProviders][] = [
  {
    type: Addon_TypesEnum.experimental_TEST_PROVIDER,
    id: 'component-tests',
    name: 'Component tests',
    render: () => (
      <TestProvider>
        Component tests
        <br />
        Ran 2 seconds ago
      </TestProvider>
    ),
    runnable: true,
    watchable: true,
    ...baseState,
  },
  {
    type: Addon_TypesEnum.experimental_TEST_PROVIDER,
    id: 'visual-tests',
    name: 'Visual tests',
    render: () => (
      <TestProvider>
        Visual tests
        <br />
        Not run
      </TestProvider>
    ),
    runnable: true,
    ...baseState,
  },
  {
    type: Addon_TypesEnum.experimental_TEST_PROVIDER,
    id: 'linting',
    name: 'Linting',
    render: () => (
      <TestProvider>
        Linting
        <br />
        Watching for changes
      </TestProvider>
    ),
    ...baseState,
    watching: true,
  },
];

const managerContext: any = {
  api: {
    on: fn().mockName('api::on'),
    off: fn().mockName('api::off'),
    runTestProvider: fn().mockName('api::runTestProvider'),
    cancelTestProvider: fn().mockName('api::cancelTestProvider'),
    updateTestProviderState: fn().mockName('api::updateTestProviderState'),
    setTestProviderWatchMode: fn().mockName('api::setTestProviderWatchMode'),
  },
};

const meta = {
  component: TestingModule,
  title: 'Sidebar/TestingModule',
  args: {
    testProviders,
    errorCount: 0,
    errorsActive: false,
    setErrorsActive: fn(),
    warningCount: 0,
    warningsActive: false,
    setWarningsActive: fn(),
  },
  decorators: [
    (storyFn) => (
      <ManagerContext.Provider value={managerContext}>{storyFn()}</ManagerContext.Provider>
    ),
    (StoryFn) => (
      <div style={{ maxWidth: 232 }}>
        <StoryFn />
      </div>
    ),
  ],
} satisfies Meta<typeof TestingModule>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Expanded: Story = {
  play: async ({ canvas }) => {
    const button = await canvas.findByRole('button', { name: /Expand/ });
    await userEvent.click(button);
  },
};

export const Statuses: Story = {
  args: {
    errorCount: 14,
    warningCount: 42,
  },
  play: Expanded.play,
};

export const ErrorsActive: Story = {
  args: {
    ...Statuses.args,
    errorsActive: true,
  },
  play: Expanded.play,
};

export const WarningsActive: Story = {
  args: {
    ...Statuses.args,
    warningsActive: true,
  },
  play: Expanded.play,
};

export const BothActive: Story = {
  args: {
    ...Statuses.args,
    errorsActive: true,
    warningsActive: true,
  },
  play: Expanded.play,
};

export const CollapsedStatuses: Story = {
  args: Statuses.args,
  play: Expanded.play,
};

export const Running: Story = {
  args: {
    testProviders: [{ ...testProviders[0], running: true }, ...testProviders.slice(1)],
  },
  play: Expanded.play,
};

export const RunningAll: Story = {
  args: {
    testProviders: testProviders.map((tp) => ({ ...tp, running: !!tp.runnable })),
  },
  play: Expanded.play,
};

export const CollapsedRunning: Story = {
  args: RunningAll.args,
  play: Expanded.play,
};

export const Cancellable: Story = {
  args: {
    testProviders: [
      { ...testProviders[0], running: true, cancellable: true },
      ...testProviders.slice(1),
    ],
  },
  play: Expanded.play,
};

export const Cancelling: Story = {
  args: {
    testProviders: [
      { ...testProviders[0], running: true, cancellable: true, cancelling: true },
      ...testProviders.slice(1),
    ],
  },
  play: Expanded.play,
};

export const Watching: Story = {
  args: {
    testProviders: [{ ...testProviders[0], watching: true }, ...testProviders.slice(1)],
  },
  play: Expanded.play,
};

export const Failing: Story = {
  args: {
    testProviders: [
      { ...testProviders[0], failed: true, running: true },
      ...testProviders.slice(1),
    ],
  },
  play: Expanded.play,
};

export const Failed: Story = {
  args: {
    testProviders: [{ ...testProviders[0], failed: true }, ...testProviders.slice(1)],
  },
  play: Expanded.play,
};

export const Crashed: Story = {
  args: {
    testProviders: [
      {
        ...testProviders[0],
        render: () => (
          <TestProvider>
            Component tests didn't complete
            <br />
            Problems!
          </TestProvider>
        ),
        crashed: true,
      },
      ...testProviders.slice(1),
    ],
  },
  play: Expanded.play,
};
