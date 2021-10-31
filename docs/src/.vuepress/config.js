module.exports = {
  title: 'Endify',
  description: "Testowo",
  themeConfig: {
    logo: '/endify-logo-horizontal.png',
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/' },
      { text: 'GitHub', link: 'https://github.com/endify/endify/tree/next' }
    ],
    sidebar: [
      {
        text: 'Getting started',
        link: '/docs/getting-started/',
        children: [
          {
            text: 'Install using hello-endify',
            link: '/docs/getting-started/',
          },
          {
            text: 'Manual installation',
            link: '/docs/getting-started/manual-installation',
          },
        ]
      },
      {
        text: 'Troubleshooting',
        link: '/docs/troubleshooting/',
      },
    ]
  }
}