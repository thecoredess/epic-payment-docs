import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * EPIC Payment Gateway - Technical Documentation Sidebar
 * Focused on system design, architecture, and implementation
 */
const sidebars: SidebarsConfig = {
  // Main technical documentation sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🏗️ System Architecture',
      items: [
        'integration/architecture',
      ],
    },
    {
      type: 'category', 
      label: '💻 Implementation Methods',
      items: [
        'examples/php',
      ],
    },
    {
      type: 'category',
      label: '🚀 Quick Start',
      items: [
        'getting-started/overview',
      ],
    },
  ],

  // API Reference sidebar
  apiSidebar: [
    'api/overview',
  ],

  // System Design & Business Requirements sidebar
  businessSidebar: [
    'business/overview',
  ],
};

export default sidebars;
