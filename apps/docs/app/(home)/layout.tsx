import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
        { url: '/docs', text: 'Documentation' },
        { url: `https://discord.gg/3teHFBNQ9W`, text: 'Discord' },
        { url: 'https://dash.mauz.dev', text: 'Demo' },
        { url: 'https://ko-fi.com/mauricenino', text: 'Ko-Fi' },
      ]}
    >
      {children}
    </HomeLayout>
  );
}
