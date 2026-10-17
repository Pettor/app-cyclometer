import type { ReactElement } from "react";
import { useDocumentTitle } from "@package/react";
import { createFileRoute } from "@tanstack/react-router";
import { useFlowRoute } from "./-UseFlowRoute";
import { CommandPaletteController } from "~/components/actions/command-palette/CommandPaletteController";
import { SettingsModalController } from "~/components/feedback/settings-modal/SettingsModalController";
import { RouteError } from "~/core/routes/logic/RouteError";
import { FlowView } from "~/views/flow/FlowView";

export const Route = createFileRoute("/")({
  component: FlowPageRoute,
  errorComponent: ({ error }) => <RouteError error={error} />,
});

function FlowPageRoute(): ReactElement {
  useDocumentTitle("Flow");
  const props = useFlowRoute();

  return (
    <>
      <FlowView {...props} />
      <SettingsModalController />
      <CommandPaletteController />
    </>
  );
}
