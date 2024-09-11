import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import { ConvexClientProvider } from '~/provider/convex-client-provider';
import { Modals } from '~/provider/modal-provider';
import './globals.css';
import { Toaster } from '~/components/ui/sonner';
import Providers from '~/provider/query-client-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Slack App',
  description: 'A Slack clone built with Convex.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang='en'>
        <body className={inter.className}>
          <ConvexClientProvider>
            <Providers>
              <Toaster />
              <Modals />
              {children}
              <SpeedInsights />
            </Providers>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
