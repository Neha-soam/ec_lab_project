import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface TabDef {
  id: string;
  label: string;
  panel: ReactNode;
}

/** Accessible tabs. All panels stay mounted (just hidden) so typed values survive switching tabs. */
export function Tabs({ label, tabs }: { label: string; tabs: readonly TabDef[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // ARIA tabs pattern: arrow keys move between tabs, Home/End jump to the first/last.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  };

  return (
    <>
      <div className="tabs" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el;
            }}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            tabIndex={active === t.id ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, i)}
            aria-controls={`panel-${t.id}`}
            className={`tab${active === t.id ? ' selected' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={active !== t.id} className="panel">
          {t.panel}
        </div>
      ))}
    </>
  );
}
