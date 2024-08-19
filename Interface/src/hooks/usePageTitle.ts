import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles: { [key: string]: string } = {
  '/': 'Tag Management',
  '/monitoring': 'Real-time Monitoring',
  '/control': 'Process Control',
  '/simulation': 'Failure Simulation',
  '/grouping': 'Tag Grouping',
};

export const usePageTitle = (defaultTitle: string = 'Factory I/O Web Interface') => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = routeTitles[location.pathname] || defaultTitle;
    document.title = `${pageTitle} | F I/O Interface`;
  }, [location, defaultTitle]);
};