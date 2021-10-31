export const themeData = {
  "logo": "/endify-logo-horizontal.png",
  "navbar": [
    {
      "text": "Home",
      "link": "/"
    },
    {
      "text": "Docs",
      "link": "/docs/"
    },
    {
      "text": "GitHub",
      "link": "https://github.com/endify/endify/tree/next"
    }
  ],
  "sidebar": [
    {
      "text": "Getting started",
      "link": "/docs/getting-started/",
      "children": [
        {
          "text": "Install using hello-endify",
          "link": "/docs/getting-started/"
        },
        {
          "text": "Manual installation",
          "link": "/docs/getting-started/manual-installation"
        }
      ]
    },
    {
      "text": "Troubleshooting",
      "link": "/docs/troubleshooting/"
    }
  ],
  "locales": {
    "/": {
      "selectLanguageName": "English"
    }
  },
  "darkMode": true,
  "repo": null,
  "selectLanguageText": "Languages",
  "selectLanguageAriaLabel": "Select language",
  "sidebarDepth": 2,
  "editLink": true,
  "editLinkText": "Edit this page",
  "lastUpdated": true,
  "lastUpdatedText": "Last Updated",
  "contributors": true,
  "contributorsText": "Contributors",
  "notFound": [
    "There's nothing here.",
    "How did we get here?",
    "That's a Four-Oh-Four.",
    "Looks like we've got some broken links."
  ],
  "backToHome": "Take me home",
  "openInNewWindow": "open in new window",
  "toggleDarkMode": "toggle dark mode",
  "toggleSidebar": "toggle sidebar"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
