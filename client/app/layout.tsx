import type { Metadata } from 'next';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from '@/components/SnackbarContext';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ApplicationProvider from '@/context/ApplicationProvider';

export const metadata: Metadata = {
  title: 'Phantom Fleet',
};

const provider = 'api';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <CssBaseline />
      <body>
        <AppRouterCacheProvider>
          <SnackbarProvider>
            <ApplicationProvider contextProvider={provider}>
              {children}
            </ApplicationProvider>
          </SnackbarProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
