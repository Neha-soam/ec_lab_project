import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { type NavItem, phaseLabel } from '../data/navigation';

export function SectionPlaceholder({ item }: { item: NavItem }) {
  return (
    <>
      <PageHeader title={item.label} subtitle={item.description} badge={<Badge>{phaseLabel(item)}</Badge>} />
      <div className="empty-state">
        <p>
          {item.phase === null
            ? 'This section is planned but not yet scheduled.'
            : `This section will be built in Phase ${item.phase}.`}
        </p>
      </div>
    </>
  );
}
