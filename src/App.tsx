import type { ReactElement } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { CalculatorPage } from './features/calculator/CalculatorPage';
import { ToolsPage } from './features/tools/ToolsPage';
import { NAV_ITEMS } from './data/navigation';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { SectionPlaceholder } from './pages/SectionPlaceholder';

/** Sections that have real content. Everything else falls back to a placeholder. */
const PAGES: Record<string, ReactElement> = {
  '/calculator': <CalculatorPage />,
  '/tools': <ToolsPage />,
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          {NAV_ITEMS.filter((item) => item.path !== '/').map((item) => (
            <Route key={item.path} path={item.path} element={PAGES[item.path] ?? <SectionPlaceholder item={item} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
