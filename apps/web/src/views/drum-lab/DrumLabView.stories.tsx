import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { DrumLabView as Component } from "./DrumLabView";
import type { DrumLabViewProps as ComponentProps } from "./DrumLabViewProps";
import {
  createStoryControls,
  createStoryDrums,
  playingPlayback,
  stoppedPlayback,
  storyFlowSteps,
} from "~/storybook/data/FlowData";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Views/Drum Lab",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  steps: storyFlowSteps,
  selectedIndex: 0,
  onSelect: fn(),
  drums: createStoryDrums(),
  playback: stoppedPlayback,
  controls: { ...createStoryControls(), muted: undefined, onMutedChange: undefined },
  onToggleHit: fn(),
  onAudition: fn(),
  onSuggestSelected: fn(),
  onSuggestAll: fn(),
  onReroll: fn(),
  onExportMidi: fn(),
  onNavigate: fn(),
  onOpenSettings: fn(),
} satisfies ComponentProps;

export const Default: Story = {
  args: defaultArgs,
  parameters: { viewport: { value: "full" } },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getAllByTestId("drum-grid__cell")).toHaveLength(8 * 7);
    await userEvent.click(canvas.getByRole("button", { name: "Kick slot 1: accent" }));
    await expect(args.onToggleHit).toHaveBeenCalledWith("main", "kick", 0);
    await userEvent.click(canvas.getByRole("button", { name: "Play Snare" }));
    await expect(args.onAudition).toHaveBeenCalledWith("snare");
    await userEvent.click(canvas.getByTestId("drum-suggest__export"));
    await expect(args.onExportMidi).toHaveBeenCalledOnce();
  },
};

export const EditingFill: Story = {
  args: defaultArgs,
  parameters: { viewport: { value: "full" } },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Fill" }));
    await userEvent.click(canvas.getByRole("button", { name: "Crash slot 1: off" }));
    await expect(args.onToggleHit).toHaveBeenCalledWith("fill", "crash", 0);
  },
};

export const Playing: Story = {
  args: { ...defaultArgs, selectedIndex: 1, playback: playingPlayback, controls: createStoryControls(true) },
  parameters: { viewport: { value: "full" } },
};

export const Phone: Story = {
  args: defaultArgs,
  globals: { viewport: { value: "iphonex" } },
};
