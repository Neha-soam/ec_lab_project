import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" subtitle="That page doesn't exist in OhmLab." />
      <Link to="/" className="btn">Back to Home</Link>
    </>
  );
}
