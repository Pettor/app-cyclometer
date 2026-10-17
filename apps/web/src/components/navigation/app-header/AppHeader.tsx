import type { ReactElement, ReactNode } from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { CyclometerMark } from "~/components/display/cyclometer-mark/CyclometerMark";

export type AppSection = "flow" | "drums";

export interface AppHeaderProps {
  activeSection: AppSection;
  subtitle: string;
  onNavigate: (section: AppSection) => void;
  onOpenSettings: () => void;
  /** Right-hand content, typically stats and transport controls. */
  children?: ReactNode;
}

/** App bar shared by every view: brand, section switcher, settings and a slot for controls. */
export function AppHeader({
  activeSection,
  subtitle,
  onNavigate,
  onOpenSettings,
  children,
}: AppHeaderProps): ReactElement {
  const intl = useIntl();
  const sections: { id: AppSection; label: string }[] = [
    {
      id: "flow",
      label: intl.formatMessage({
        description: "AppHeader - flow editor section link",
        defaultMessage: "Flow",
        id: "dySUBs",
      }),
    },
    {
      id: "drums",
      label: intl.formatMessage({
        description: "AppHeader - drum lab section link",
        defaultMessage: "Drum lab",
        id: "ZGp8E9",
      }),
    },
  ];

  return (
    <header className="flex flex-wrap items-center gap-4 border-b px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex min-w-0 flex-[1_1_260px] items-center gap-3">
        <CyclometerMark size={36} className="shrink-0" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="text-lg font-bold tracking-tight">
            {intl.formatMessage({ description: "AppHeader - app name", defaultMessage: "Cyclometer", id: "aVd8Jq" })}
          </h1>
          <p className="text-muted hidden truncate text-sm sm:block">{subtitle}</p>
        </div>
        <nav
          aria-label={intl.formatMessage({
            description: "AppHeader - sections nav aria-label",
            defaultMessage: "Sections",
            id: "lU2HE+",
          })}
          className="bg-surface ml-2 flex gap-1 rounded-full p-1"
        >
          {sections.map((section) => {
            const isActive = section.id === activeSection;
            return (
              <Button
                key={section.id}
                size="sm"
                variant={isActive ? "tertiary" : "ghost"}
                aria-current={isActive ? "page" : undefined}
                onPress={() => onNavigate(section.id)}
                className={clsx("rounded-full", isActive && "font-semibold")}
                data-testid={`app-header__nav-${section.id}`}
              >
                {section.label}
              </Button>
            );
          })}
        </nav>
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          onPress={onOpenSettings}
          className="ml-auto rounded-full lg:hidden"
          aria-label={intl.formatMessage({
            description: "AppHeader - settings button aria-label",
            defaultMessage: "Settings",
            id: "JdcZPH",
          })}
        >
          <Cog6ToothIcon className="size-5" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {children}
        <Button
          isIconOnly
          variant="ghost"
          onPress={onOpenSettings}
          className="hidden rounded-full lg:inline-flex"
          aria-label={intl.formatMessage({
            description: "AppHeader - settings button aria-label",
            defaultMessage: "Settings",
            id: "JdcZPH",
          })}
        >
          <Cog6ToothIcon className="size-5" />
        </Button>
      </div>
    </header>
  );
}
