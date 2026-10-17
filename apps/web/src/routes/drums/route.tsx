import type { ReactElement } from "react";
import { useDocumentTitle } from "@package/react";
import { createFileRoute } from "@tanstack/react-router";
import { useDrumsRoute } from "./-UseDrumsRoute";
import { CommandPaletteController } from "~/components/actions/command-palette/CommandPaletteController";
import { SettingsModalController } from "~/components/feedback/settings-modal/SettingsModalController";
import { RouteError } from "~/core/routes/logic/RouteError";
import { DrumLabView } from "~/views/drum-lab/DrumLabView";

export const Route = createFileRoute("/drums")({
  component: DrumsPageRoute,
  errorComponent: ({ error }) => <RouteError error={error} />,
});

function DrumsPageRoute(): ReactElement {
  useDocumentTitle("Drum lab");
  const props = useDrumsRoute();

  return (
    <>
      <DrumLabView {...props} />
      <SettingsModalController />
      <CommandPaletteController />
    </>
  );
}
