import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'EPIC Payment Gateway',
  tagline: 'Electronic Payment Integrated Console - System Design Document',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://thecoredess.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/epic-payment-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'thecoredess', // Usually your GitHub org/user name.
  projectName: 'epic-payment-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          routeBasePath: '/', // Serve docs at the site's root
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/DBKL/epic-payment-docs/tree/main/',
        },
        blog: false, // Disable blog for this documentation
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],
  // In order for Mermaid code blocks in Markdown to work,
  // you also need to enable the Remark plugin with this option
  markdown: {
    mermaid: true,
  },

  themeConfig: {
    // Replace with your project's social card
    image: 'img/epic-social-card.jpg',
    navbar: {
      title: 'EPIC Payment Gateway',
      logo: {
        alt: 'EPIC Logo',
        src: 'img/epic-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Integration Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          href: 'https://github.com/DBKL/epic-payment-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Technical Documentation',
          items: [
            {
              label: 'System Architecture',
              to: '/integration/architecture',
            },
            {
              label: 'Integration Methods',
              to: '/examples/php',
            },
            {
              label: 'API Endpoints',
              to: '/api/overview',
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Contact Support',
              href: 'mailto:support@dbkl.gov.my',
            },
            {
              label: 'System Status',
              href: 'https://status.epayment.dbkl.gov.my',
            },
          ],
        },
        {
          title: 'DBKL',
          items: [
            {
              label: 'Official Website',
              href: 'https://www.dbkl.gov.my',
            },
            {
              label: 'Payment Portal',
              href: 'https://epayment.dbkl.gov.my',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dewan Bandaraya Kuala Lumpur (DBKL). Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php', 'java', 'csharp', 'ruby'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
