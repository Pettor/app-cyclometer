import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { FlowView as Component } from "./FlowView";
import type { FlowViewProps as ComponentProps } from "./FlowViewProps";
import { createStoryControls, createStoryFlow, playingPlayback, stoppedPlayback } from "~/storybook/data/FlowData";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Views/Flow",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  flow: createStoryFlow(),
  playback: stoppedPlayback,
  controls: createStoryControls(),
  onNavigate: fn(),
  onOpenSettings: fn(),
} satisfies ComponentProps;

export const Stopped: Story = {
  args: defaultArgs,
  parameters: { viewport: { value: "full" } },
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByTestId("cycle-stage__signature")).toHaveTextContent("7/16");
    await expect(canvas.getAllByTestId("flow-step-card")).toHaveLength(6);
    await userEvent.click(canvas.getByRole("button", { name: "Add 5/8" }));
    await expect(args.flow.add).toHaveBeenCalledWith({ num: 5, den: 8 });
    await userEvent.click(canvas.getAllByTestId("pattern-editor__slot")[0]!);
    await expect(args.flow.cycleSlot).toHaveBeenCalledWith(0, 0);
  },
};

export const Playing: Story = {
  args: { ...defaultArgs, playback: playingPlayback, controls: createStoryControls(true) },
  parameters: { viewport: { value: "full" } },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText("Pass 2 / 2").length).toBeGreaterThan(0);
  },
};

export const Phone: Story = {
  args: defaultArgs,
  globals: { viewport: { value: "iphonex" } },
};

export const PhonePlaying: Story = {
  args: { ...defaultArgs, playback: playingPlayback, controls: createStoryControls(true) },
  globals: { viewport: { value: "iphonex" } },
};
