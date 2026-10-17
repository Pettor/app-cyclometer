import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SlotStrip as Component } from "./SlotStrip";
import type { SlotStripProps as ComponentProps } from "./SlotStrip";

const meta: Meta<typeof Component> = {
  title: "Display/Slot Strip",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  step: { num: 7, groups: [4, 3], slots: ["a", "r", "n", "r", "a", "r", "n"] },
} satisfies ComponentProps;

export const Default: Story = {
  args: defaultArgs,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "7 slots, 2 accented, 3 rests" })).toBeInTheDocument();
  },
};

export const Playing: Story = {
  args: { ...defaultArgs, activeSlot: 2 },
};

export const Small: Story = {
  args: {
    step: { num: 11, groups: [3, 3, 3, 2], slots: ["n", "n", "n", "a", "n", "n", "a", "n", "n", "a", "n"] },
    size: "sm",
  },
};
