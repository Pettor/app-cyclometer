import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { AppHeader as Component } from "./AppHeader";
import type { AppHeaderProps as ComponentProps } from "./AppHeader";

const meta: Meta<typeof Component> = {
  title: "Navigation/App Header",
  component: Component,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  activeSection: "flow",
  subtitle: "Odd-meter study flow",
  onNavigate: fn(),
  onOpenSettings: fn(),
} satisfies ComponentProps;

export const Flow: Story = {
  args: defaultArgs,
  play: async ({ args, canvas, userEvent }) => {
    await expect(canvas.getByTestId("app-header__nav-flow")).toHaveAttribute("aria-current", "page");
    await userEvent.click(canvas.getByTestId("app-header__nav-drums"));
    await expect(args.onNavigate).toHaveBeenCalledWith("drums");
  },
};

export const DrumLab: Story = {
  args: { ...defaultArgs, activeSection: "drums", subtitle: "Turn the time signature flow into a drum part" },
};
