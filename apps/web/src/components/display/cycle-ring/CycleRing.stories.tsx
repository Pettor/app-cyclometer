import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { CycleRing as Component } from "./CycleRing";
import type { CycleRingProps as ComponentProps } from "./CycleRing";

const meta: Meta<typeof Component> = {
  title: "Display/Cycle Ring",
  component: Component,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[400px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  step: { num: 7, groups: [4, 3], slots: ["a", "r", "n", "r", "a", "r", "n"] },
  slot: -1,
  status: "ready",
} satisfies ComponentProps;

export const Ready: Story = {
  args: defaultArgs,
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("cycle-ring__badge")).toHaveTextContent("Ready");
    await expect(canvas.getByText("Press play")).toBeInTheDocument();
  },
};

export const Downbeat: Story = {
  args: { ...defaultArgs, slot: 0, status: "playing" },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("cycle-ring__badge")).toHaveTextContent("Downbeat");
  },
};

export const Rest: Story = {
  args: { ...defaultArgs, slot: 3, status: "playing" },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("cycle-ring__badge")).toHaveTextContent("Rest");
    await expect(canvas.getByText("Slot 4 / 7")).toBeInTheDocument();
  },
};

export const SecondGroup: Story = {
  args: {
    step: { num: 11, groups: [3, 3, 3, 2], slots: ["n", "n", "n", "a", "n", "n", "a", "n", "n", "a", "n"] },
    slot: 7,
    status: "playing",
  },
};

export const Paused: Story = {
  args: { ...defaultArgs, status: "paused" },
};
