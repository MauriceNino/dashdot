import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'dash.',
  tagline: 'a modern server dashboard',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://getdashdot.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'MauriceNino', // Usually your GitHub org/user name.
  projectName: 'dashdot', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/MauriceNino/dashdot/edit/main/apps/docs',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'dash.',
      logo: {
        alt: 'Logo',
        src: 'img/logo512.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'installation/docker',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://dash.mauz.dev',
          label: 'Demo',
          position: 'left',
        },
        {
          href: 'https://ko-fi.com/mauricenino',
          label: 'Donate on Ko-Fi',
          position: 'right',
        },
        {
          href: 'https://github.com/MauriceNino/dashdot',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Help',
          items: [
            {
              label: 'Installation',
              to: 'docs/installation/docker',
            },
            {
              label: 'Configuration',
              to: 'docs/configuration/basic',
            },
            {
              label: 'Changelog',
              href: 'https://github.com/MauriceNino/dashdot/blob/main/.github/CHANGELOG.md',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/3teHFBNQ9W',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/MauriceNino/dashdot',
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    zoom: {
      selector: 'img',
      config: {
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)',
        },
      },
    },
  } satisfies Preset.ThemeConfig,
  plugins: ['docusaurus-plugin-sass', 'docusaurus-plugin-image-zoom'],
};

export default config;
