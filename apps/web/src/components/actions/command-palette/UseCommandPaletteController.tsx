import { useMemo } from "react";
import { ComputerDesktopIcon, MoonIcon, MusicalNoteIcon, QueueListIcon, SunIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { useIntl } from "react-intl";
import type { Command } from "./Command";
import type { CommandPaletteProps } from "./CommandPalette";
import { useCommandPalette } from "./UseCommandPalette";
import { useCommandPaletteShortcut } from "./UseCommandPaletteShortcut";
import { useCommandShortcuts } from "./UseCommandShortcuts";
import { themeModeAtom } from "~/core/theme/ThemeAtoms";
import type { ThemeMode } from "~/core/theme/ThemeMode";

/**
 * Builds the app's default command list (navigation, theme), wires up the
 * Cmd/Ctrl+K shortcut and per-command shortcuts, and returns props ready to
 * spread onto `<CommandPalette>`. To add or change commands, extend the array
 * returned from `useMemo` below — `Command` is intentionally minimal.
 */
export function useCommandPaletteController(): CommandPaletteProps {
  const intl = useIntl();
  const navigate = useNavigate();
  const setThemeMode = useSetAtom(themeModeAtom);
  const { isOpen, close } = useCommandPalette();

  const navigationGroup = intl.formatMessage({
    description: "CommandPaletteController: label - navigation group",
    defaultMessage: "Navigation",
    id: "RCtY7O",
  });
  const appearanceGroup = intl.formatMessage({
    description: "CommandPaletteController: label - appearance group",
    defaultMessage: "Appearance",
    id: "vWoN3+",
  });

  const commands = useMemo<Command[]>(() => {
    function setTheme(mode: ThemeMode): void {
      setThemeMode(mode);
    }

    return [
      {
        id: "goto-flow",
        label: intl.formatMessage({
          description: "CommandPaletteController: label - go to flow editor command",
          defaultMessage: "Go to Flow",
          id: "nAh4Jk",
        }),
        description: intl.formatMessage({
          description: "CommandPaletteController: caption - go to flow editor command",
          defaultMessage: "Build and practise a flow of time signatures",
          id: "nGfH97",
        }),
        group: navigationGroup,
        keywords: ["home", "flow", "metronome", "meter"],
        icon: <QueueListIcon className="h-4 w-4" />,
        shortcut: { mod: true, shift: true, key: "h" },
        perform: () => {
          void navigate({ to: "/" });
        },
      },
      {
        id: "goto-drums",
        label: intl.formatMessage({
          description: "CommandPaletteController: label - go to drum lab command",
          defaultMessage: "Go to Drum lab",
          id: "lspZBE",
        }),
        description: intl.formatMessage({
          description: "CommandPaletteController: caption - go to drum lab command",
          defaultMessage: "Turn the flow into a drum part",
          id: "uA5Rw7",
        }),
        group: navigationGroup,
        keywords: ["drums", "groove", "midi"],
        icon: <MusicalNoteIcon className="h-4 w-4" />,
        shortcut: { mod: true, shift: true, key: "d" },
        perform: () => {
          void navigate({ to: "/drums" });
        },
      },
      {
        id: "theme-auto",
        label: intl.formatMessage({
          description: "CommandPaletteController: label - theme system command",
          defaultMessage: "Theme: System",
          id: "xr2NN2",
        }),
        group: appearanceGroup,
        keywords: ["auto", "system", "theme"],
        icon: <ComputerDesktopIcon className="h-4 w-4" />,
        perform: () => setTheme("auto"),
      },
      {
        id: "theme-light",
        label: intl.formatMessage({
          description: "CommandPaletteController: label - theme light command",
          defaultMessage: "Theme: Light",
          id: "MibXHq",
        }),
        group: appearanceGroup,
        keywords: ["light", "theme"],
        icon: <SunIcon className="h-4 w-4" />,
        shortcut: { mod: true, shift: true, key: "l" },
        perform: () => setTheme("light"),
      },
      {
        id: "theme-dark",
        label: intl.formatMessage({
          description: "CommandPaletteController: label - theme dark command",
          defaultMessage: "Theme: Dark",
          id: "5ywSOX",
        }),
        group: appearanceGroup,
        keywords: ["dark", "theme"],
        icon: <MoonIcon className="h-4 w-4" />,
        shortcut: { mod: true, shift: true, key: "k" },
        perform: () => setTheme("dark"),
      },
    ];
  }, [intl, navigate, setThemeMode, navigationGroup, appearanceGroup]);

  useCommandPaletteShortcut();
  useCommandShortcuts(commands);

  return { isOpen, commands, onClose: close };
}
