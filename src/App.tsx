// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LanguageProvider } from '@/context/LanguageProvider';
import { populateDB } from '@/db';
import AppShell from '@/components/layout/AppShell';
import AppRouter from '@/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false, // Personal preference for demos
      retry: 1, // Retry failed queries once
    },
  },
});

const App: React.FC = () => {
  useEffect(() => {
    // Populate Dexie DB on app start for development
    if (import.meta.env.DEV) { // Vite specific dev check
      populateDB().catch(err => {
        console.error("Failed to populate Dexie DB:", err);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <AppShell> {/* AppShell fetches global layout labels and provides overall structure */}
            <AppRouter /> {/* AppRouter handles page-specific content and routing */}
          </AppShell>
        </BrowserRouter>
      </LanguageProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
export default App; 