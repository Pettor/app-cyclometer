import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { CompactTransportControls } from "./CompactTransportControls";
import { TransportControls as Component } from "./TransportControls";
import type { TransportControlsProps as ComponentProps } from "./TransportControls";

const meta: Meta<typeof Component> = {
  title: "Actions/Transport Controls",
  component: Component,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  tempo: 84,
  onTempoChange: fn(),
  loop: true,
  onLoopChange: fn(),
  muted: false,
  onMutedChange: fn(),
  isPlaying: false,
  onTogglePlay: fn(),
  onStop: fn(),
} satisfies ComponentProps;

export const Default: Story = {
  args: defaultArgs,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /play/i }));
    await expect(args.onTogglePlay).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: /stop/i }));
    await expect(args.onStop).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("switch", { name: /loop flow/i }));
    await expect(args.onLoopChange).toHaveBeenCalledWith(false);
    await userEvent.click(canvas.getByRole("button", { name: "Mute" }));
    await expect(args.onMutedChange).toHaveBeenCalledWith(true);
  },
};

export const Playing: Story = {
  args: { ...defaultArgs, isPlaying: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  },
};

export const WithoutMute: Story = {
  args: { ...defaultArgs, muted: undefined, onMutedChange: undefined },
};

export const Interactive: Story = {
  render: function Render(args) {
    const [tempo, setTempo] = useState(args.tempo);
    const [loop, setLoop] = useState(args.loop);
    const [isPlaying, setIsPlaying] = useState(false);
    return (
      <Component
        {...args}
        tempo={tempo}
        onTempoChange={setTempo}
        loop={loop}
        onLoopChange={setLoop}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
      />
    );
  },
  args: defaultArgs,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /play/i }));
    await expect(canvas.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  },
};

export const Compact: Story = {
  render: (args) => (
    <div className="w-[390px]">
      <CompactTransportControls
        {...args}
        progress={[
          { weight: 7, fill: 100 },
          { weight: 7, fill: 40 },
          { weight: 10, fill: 0 },
        ]}
      />
    </div>
  ),
  args: defaultArgs,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Play" }));
    await expect(args.onTogglePlay).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Loop flow" }));
    await expect(args.onLoopChange).toHaveBeenCalledWith(false);
  },
};
