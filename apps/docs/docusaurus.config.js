// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'dash.',
  tagline: 'a modern server dashboard',
  url: 'https://getdashdot.com',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'MauriceNino',
  projectName: 'dashdot',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/MauriceNino/dashdot/edit/dev/apps/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'dash.',
        logo: {
          alt: 'Logo',
          src: 'img/logo512.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'quick-setup',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://dash.mauz.io',
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
                to: '/docs/install',
              },
              {
                label: 'Configuration',
                to: '/docs/config',
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
    }),

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
      },
    ],
  ],

  plugins: ['docusaurus-plugin-sass'],
};

module.exports = config;
