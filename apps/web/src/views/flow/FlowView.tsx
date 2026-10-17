import type { ReactElement } from "react";
import { Chip, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import type { Key } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { CycleStagePanel } from "./CycleStagePanel";
import { CycleTimeline } from "./CycleTimeline";
import { FlowListPanel } from "./FlowListPanel";
import type { FlowViewProps } from "./FlowViewProps";
import { PatternEditorPanel } from "./PatternEditorPanel";
import { useFlowView } from "./UseFlowView";
import type { FlowMobileTab } from "./UseFlowView";
import { CompactTransportControls } from "~/components/actions/transport-controls/CompactTransportControls";
import { TransportControls } from "~/components/actions/transport-controls/TransportControls";
import { AppHeader } from "~/components/navigation/app-header/AppHeader";
import { formatDuration } from "~/core/flow/FlowMath";

export function FlowView(props: FlowViewProps): ReactElement {
  const { flow, playback, controls, onNavigate, onOpenSettings } = props;
  const intl = useIntl();
  const view = useFlowView(props);

  const tabs: { id: FlowMobileTab; label: string }[] = [
    {
      id: "play",
      label: intl.formatMessage({ description: "FlowView - mobile play tab", defaultMessage: "Play", id: "gbpFXE" }),
    },
    {
      id: "flow",
      label: intl.formatMessage({ description: "FlowView - mobile flow tab", defaultMessage: "Flow", id: "BvlBJF" }),
    },
    {
      id: "edit",
      label: intl.formatMessage({ description: "FlowView - mobile edit tab", defaultMessage: "Edit", id: "DwmErF" }),
    },
  ];

  function panelVisibility(tab: FlowMobileTab): string {
    return clsx(view.tab === tab ? "flex" : "hidden", "lg:flex");
  }

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <AppHeader
        activeSection="flow"
        subtitle={intl.formatMessage({
          description: "FlowView - header subtitle",
          defaultMessage: "Odd-meter study flow",
          id: "pBRKkf",
        })}
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings}
      >
        <div className="hidden gap-2 xl:flex">
          <Chip variant="secondary">
            {intl.formatMessage(
              {
                description: "FlowView - pattern count chip",
                defaultMessage: "{count, plural, one {# pattern} other {# patterns}}",
                id: "c9+yo8",
              },
              { count: view.stats.patterns }
            )}
          </Chip>
          <Chip variant="secondary">
            {intl.formatMessage(
              {
                description: "FlowView - bar count chip",
                defaultMessage: "{count, plural, one {# bar} other {# bars}}",
                id: "L0I/Yr",
              },
              { count: view.stats.bars }
            )}
          </Chip>
          <Chip variant="secondary">
            {intl.formatMessage(
              { description: "FlowView - cycle length chip", defaultMessage: "{time} per cycle", id: "XDAB2U" },
              { time: formatDuration(view.stats.seconds) }
            )}
          </Chip>
        </div>
        <TransportControls {...controls} onTogglePlay={view.togglePlay} className="hidden lg:flex" />
      </AppHeader>

      <ToggleButtonGroup
        fullWidth
        size="sm"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={new Set<Key>([view.tab])}
        onSelectionChange={(keys) => {
          const key = keys.values().next().value;
          if (key) view.setTab(key as FlowMobileTab);
        }}
        aria-label={intl.formatMessage({
          description: "FlowView - mobile view switcher aria-label",
          defaultMessage: "Views",
          id: "aY/nQ7",
        })}
        className="mx-4 mt-3 w-auto lg:hidden"
      >
        {tabs.map((tab) => (
          <ToggleButton key={tab.id} id={tab.id} data-testid={`flow-view__tab-${tab.id}`}>
            {tab.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:flex-wrap lg:items-start lg:px-6 lg:pt-4 lg:pb-6">
        <FlowListPanel
          flow={flow}
          playingIndex={view.playingIndex}
          position={playback.position}
          stats={view.stats}
          onSelect={view.selectAndEdit}
          className={panelVisibility("flow")}
        />

        <section
          aria-label={intl.formatMessage({
            description: "FlowView - stage section aria-label",
            defaultMessage: "Cycle",
            id: "+/OEJV",
          })}
          className={clsx("min-w-0 flex-col gap-4 lg:flex-[999_1_480px]", panelVisibility("play"))}
        >
          <CycleStagePanel
            steps={flow.steps}
            activeIndex={view.activeIndex}
            activeSlot={view.activeSlot}
            playback={playback}
            onSelectUpNext={view.selectAndEdit}
          />
          <CycleTimeline
            steps={flow.steps}
            progress={view.progress}
            selectedIndex={flow.selectedIndex}
            playingIndex={view.playingIndex}
            onSelect={flow.select}
            className="hidden lg:flex"
          />
        </section>

        <PatternEditorPanel flow={flow} className={panelVisibility("edit")} />
      </main>

      <CompactTransportControls
        {...controls}
        onTogglePlay={view.togglePlay}
        progress={view.progress}
        className="sticky bottom-0 z-10 lg:hidden"
      />
    </div>
  );
}
