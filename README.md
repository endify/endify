![Endify logo](https://github.com/endify/endify/blob/master/endify-header.png)
 
 # Endify (Work in progress)
  JS Framework connecting backend, frontend and native JavaScript based apps
 
 ## Install
 You can get a fresh Endify project with one simple command:
 ```coffee
 npx create-endify-app
 ```
 
 Check the guide if you want to setup it on your own.
 
 Guide:
 
 ```coffee
 npm i endify
 ```
 or
 ```coffee
 yarn add endify
 ```
 
 Then create `endify.config.client` in the root dir of your project 
 
 Then fill it with configuration:
 ```javascript
 export default {
   // Configuration
 }
 ```
 
 ## Motivation
 I was working with Vue Storefront and Nuxt for a while, but their biggest mistake was that it's not everything to make the website work. Of course you need an API in another project, some workers, services and so on... So I realized that why not to connect them both? And here it is - Endify.
 
 ## Features
 It supports a lot of things (out of the box!):

 ✔️ Frontend with **Vue.js**

 ✔️ Backend in **Node.js**
 
 ✔️ One codebase
 
 ✔️ Extending frontend & backend with **plugins**
 
 ✔️ **Vuex** store
 
 ✔️ Code splitting

 ✔️ Great treeshaking (isn't it the same as above?)

 ✔️ **Electron** - Yeah, you write once, you get a website and an app for Windows & Mac, so cool!
 
 ✔️ Service container with **awilix**
 
 ✔️ **SSR** (Server side rendering)
 
 ✔️ **Hot reload of frontend and backend** (woah! I worked a few weeks on that)
 
 ✔️ It's fully **dockerized**
 
 ✔️ It allows to test itself with **jest**
 
 ✔️ It includes **`pnpm`** instead of `npm` for the fastest installing experience
 
 ✔️ It has some **Github Actions** examples of Testing & Building
 
 ✔️ And even it has some great tutorial on how to apply image to **kubernetes** with Github Actions!
 
 ✔️ You install it with one command
`


## Getting started

### Install Endify
Installing Endify is easy and should take less than a minute. All you have to do is type one of the following commands into your console:
```bash
# Recommended for beginners
$ npx hello-endify 

# Use yarn as default package manager
$ yarn create endify

# Use npm as default package manager
$ npm create endify
```
