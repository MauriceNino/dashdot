import { Inter } from 'next/font/google';
import { Provider } from '@/components/provider';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  icons: {
    icon: '/img/favicon.ico',
  },
  title: 'Dashdot Documentation',
  description: 'Documentation for Dashdot, the self-hosted server monitoring dashboard for single node servers.',
  keywords: 'dashdot, documentation, self-hosted, server monitoring, dashboard, single node servers',
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
