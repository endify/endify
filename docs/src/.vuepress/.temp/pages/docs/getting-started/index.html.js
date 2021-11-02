export const data = {
  "key": "v-336cc832",
  "path": "/docs/getting-started/",
  "title": "Getting started",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Install",
      "slug": "install",
      "children": [
        {
          "level": 3,
          "title": "Using hello-endify (Preferred method)",
          "slug": "using-hello-endify-preferred-method",
          "children": []
        },
        {
          "level": 3,
          "title": "Manual installation",
          "slug": "manual-installation",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Run",
      "slug": "run",
      "children": []
    }
  ],
  "filePathRelative": "docs/getting-started/README.md",
  "git": {
    "updatedTime": 1635701567000,
    "contributors": [
      {
        "name": "pieczorx",
        "email": "pieczorex@gmail.com",
        "commits": 1
      }
    ]
  }
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
