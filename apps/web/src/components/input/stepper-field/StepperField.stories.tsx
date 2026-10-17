import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { StepperField as Component } from "./StepperField";
import type { StepperFieldProps as ComponentProps } from "./StepperField";

const meta: Meta<typeof Component> = {
  title: "Input/Stepper Field",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  label: "Replays",
  value: 2,
  minValue: 1,
  maxValue: 32,
  onChange: fn(),
  prefix: "×",
} satisfies ComponentProps;

export const Default: Story = {
  args: defaultArgs,
  play: async ({ args, canvas, userEvent }) => {
    const buttons = canvas.getAllByRole("button");
    await userEvent.click(buttons[buttons.length - 1]!);
    await expect(args.onChange).toHaveBeenCalledWith(3);
  },
};

export const HiddenLabel: Story = {
  args: { ...defaultArgs, hideLabel: true, size: "sm" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("textbox", { name: "Replays" })).toBeInTheDocument();
  },
};

export const AtMinimum: Story = {
  args: { ...defaultArgs, value: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("button")[0]).toBeDisabled();
  },
};

export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <Component {...args} value={value} onChange={setValue} />;
  },
  args: { ...defaultArgs, label: "Beats", value: 7, minValue: 2, maxValue: 17, prefix: undefined },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole("button")[0]!);
    await expect(canvas.getByRole("textbox", { name: "Beats" })).toHaveValue("6");
  },
};
