import React from 'react';
import usePageTheme from '../hooks/usePageTheme';

interface PageThemeProviderProps {
  children: React.ReactNode;
}

const PageThemeProvider: React.FC<PageThemeProviderProps> = ({ children }) => {
  usePageTheme();
  return <>{children}</>;
};

export default PageThemeProvider;