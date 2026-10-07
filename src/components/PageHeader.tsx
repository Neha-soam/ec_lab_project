import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: ReactNode }) {
  return (
    <header className="page-header">
      <div className="page-header-row">
        <h1>{title}</h1>
        {badge}
      </div>
      {subtitle && <p className="muted">{subtitle}</p>}
    </header>
  );
}
