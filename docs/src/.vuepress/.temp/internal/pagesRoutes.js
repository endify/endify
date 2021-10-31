import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/","",["/index.html","/index.md"]],
  ["v-147825fb","/docs/","",["/docs/index.html","/docs/index.md"]],
  ["v-7b9f0aca","/docs/getting-started/manual-installation.html","Manual installation",["/docs/getting-started/manual-installation","/docs/getting-started/manual-installation.md"]],
  ["v-336cc832","/docs/getting-started/","Getting started",["/docs/getting-started/index.html","/docs/getting-started/README.md"]],
  ["v-cf15ade0","/docs/troubleshooting/","Troubleshooting",["/docs/troubleshooting/index.html","/docs/troubleshooting/README.md"]],
  ["v-51b8348a","/docs/versioning/","Versioning",["/docs/versioning/index.html","/docs/versioning/README.md"]],
  ["v-3706649a","/404.html","",["/404"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, title, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta: { title },
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)
