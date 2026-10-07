import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { NAV_ITEMS, phaseLabel } from '../data/navigation';

const WORKFLOW = ['Learn', 'Calculate', 'Build', 'Measure', 'Experiment', 'Analyze', 'Diagnose', 'Practice', 'Report'];

export function Home() {
  const sections = NAV_ITEMS.filter((item) => item.path !== '/');

  return (
    <>
      <PageHeader
        title="OhmLab"
        subtitle="An interactive virtual electrical laboratory for learning and performing Ohm's Law experiments."
      />

      <ol className="workflow" aria-label="Lab workflow">
        {WORKFLOW.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <div className="grid">
        {sections.map((item) => (
          <Link key={item.path} to={item.path} className="card-link">
            <Card title={item.label} badge={<Badge>{phaseLabel(item)}</Badge>}>
              <p className="muted">{item.description}</p>
            </Card>
          </Link>
        ))}
      </div>

      <aside className="note" aria-label="Safety">
        <strong>Safety:</strong> OhmLab is an educational simulator for low-voltage circuits. Never experiment with
        household mains electricity, and do real laboratory work under supervision, within component ratings.
      </aside>
    </>
  );
}
