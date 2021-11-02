export const data = {
  "key": "v-8daa1a0e",
  "path": "/",
  "title": "",
  "lang": "en-US",
  "frontmatter": {
    "home": true,
    "heroImage": "/endify-header.jpg",
    "heroAlt": "Endify Logo",
    "heroText": "Endify",
    "tagline": "Endify is a JavaScript framework aimed at connecting frontend and backend code into one codebase, which opens new possibilities to the world of code.",
    "actions": [
      {
        "text": "Get started",
        "link": "/docs/getting-started/",
        "type": "primary"
      }
    ],
    "features": [
      {
        "title": "🦉 Modern Backend",
        "details": "Endify is built on top of Node.js, which allows you to run JavaScript as a server."
      },
      {
        "title": "🦄 Awesome Frontend",
        "details": "Thanks to Vue.js we've created an unique experience of writing next generation apps."
      },
      {
        "title": "🤯 Connect them both!",
        "details": "If JavaScript can be used server & client side, why not connect them? This is what Endify does."
      },
      {
        "title": "📂 One Codebase",
        "details": "Don't mess up with tons of repositories if you can have one!"
      },
      {
        "title": "💻 Desktop Support",
        "details": "You can easily bundle as an Electron app for Windows, Mac & Linux."
      },
      {
        "title": "💉 Hot Module Reload",
        "details": "As client side HMR is already well known we've also included it in Node.js & Electron. Happy coding!"
      },
      {
        "title": "📦 Install Extensions",
        "details": "You can find a lot of useful extensions in our catalog or create your own in minutes."
      },
      {
        "title": "🤖 Server Side Rendering",
        "details": "With SSR enabled Endify is SEO friendly out of the box."
      },
      {
        "title": "⚡ High Performance",
        "details": "Due to ES6 export syntax, code splitting and highly optimized code you don't need to worry about slow page loads anymore."
      },
      {
        "footer": "MIT Licensed | Copyright © 2019-present Evan You"
      }
    ]
  },
  "excerpt": "",
  "headers": [],
  "filePathRelative": "index.md",
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
