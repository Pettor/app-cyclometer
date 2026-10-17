import type { ReactElement } from "react";
import { useIntl } from "react-intl";
import { DrumArrangement } from "./DrumArrangement";
import { DrumGridPanel } from "./DrumGridPanel";
import { DrumLabFlowPanel } from "./DrumLabFlowPanel";
import type { DrumLabViewProps } from "./DrumLabViewProps";
import { DrumSuggestPanel } from "./DrumSuggestPanel";
import { useDrumLabView } from "./UseDrumLabView";
import { TransportControls } from "~/components/actions/transport-controls/TransportControls";
import { AppHeader } from "~/components/navigation/app-header/AppHeader";

export function DrumLabView(props: DrumLabViewProps): ReactElement {
  const { steps, selectedIndex, onSelect, drums, playback, controls, onNavigate, onOpenSettings } = props;
  const intl = useIntl();
  const view = useDrumLabView(props);

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <AppHeader
        activeSection="drums"
        subtitle={intl.formatMessage({
          description: "DrumLabView - header subtitle",
          defaultMessage: "Turn the time signature flow into a drum part",
          id: "OKJZrn",
        })}
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings}
      >
        <TransportControls {...controls} />
      </AppHeader>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:flex-wrap lg:items-start lg:px-6 lg:pt-4 lg:pb-6">
        <DrumLabFlowPanel
          steps={steps}
          parts={drums.parts}
          selectedIndex={selectedIndex}
          playingIndex={view.playingIndex}
          playback={playback}
          cycleSeconds={view.cycleSeconds}
          onSelect={onSelect}
        />

        {view.step && view.part && view.grid && (
          <>
            <section
              aria-label={intl.formatMessage({
                description: "DrumLabView - grid section aria-label",
                defaultMessage: "Drum grid",
                id: "m+2O+t",
              })}
              className="flex min-w-0 flex-col gap-4 lg:flex-[999_1_640px]"
            >
              <DrumGridPanel
                index={selectedIndex}
                step={view.step}
                part={view.part}
                grid={view.grid}
                view={view.view}
                stepHasFill={view.stepHasFill}
                gridSlot={view.gridSlot}
                mutes={drums.mutes}
                onViewChange={view.setView}
                onUseFillChange={(useFill) => drums.setUseFill(selectedIndex, useFill)}
                onToggleHit={(key, slot) => props.onToggleHit(view.view, key, slot)}
                onToggleMute={drums.toggleMute}
                onAudition={props.onAudition}
              />
              <DrumArrangement
                steps={steps}
                parts={drums.parts}
                selectedIndex={selectedIndex}
                playingIndex={view.playingIndex}
                playback={playback}
                onSelect={onSelect}
              />
            </section>

            <DrumSuggestPanel
              index={selectedIndex}
              step={view.step}
              part={view.part}
              style={drums.style}
              onStyleChange={drums.setStyle}
              keepRestsSilent={drums.keepRestsSilent}
              onKeepRestsSilentChange={drums.setKeepRestsSilent}
              exportCycles={drums.exportCycles}
              onExportCyclesChange={drums.setExportCycles}
              onSuggestSelected={props.onSuggestSelected}
              onSuggestAll={props.onSuggestAll}
              onReroll={props.onReroll}
              onExportMidi={props.onExportMidi}
            />
          </>
        )}
      </main>
    </div>
  );
}
