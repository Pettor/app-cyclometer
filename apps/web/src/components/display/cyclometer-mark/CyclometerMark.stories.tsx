import type { Meta, StoryObj } from "@storybook/react-vite";
import { CyclometerMark as Component } from "./CyclometerMark";

const meta: Meta<typeof Component> = {
  title: "Display/Cyclometer Mark",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 36 },
};

export const Large: Story = {
  args: { size: 240 },
};

export const Favicon: Story = {
  args: { size: 24 },
};
