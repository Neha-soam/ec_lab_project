import type { ReactNode } from 'react';

interface Props {
  title: string;
  badge?: ReactNode;
  children?: ReactNode;
}

export function Card({ title, badge, children }: Props) {
  return (
    <section className="card">
      <header className="card-header">
        <h3 className="card-title">{title}</h3>
        {badge}
      </header>
      {children}
    </section>
  );
}
