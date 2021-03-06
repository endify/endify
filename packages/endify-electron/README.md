# [WIP] endify-electron
This package adds Electron based apps support to Endify.

## Install
1. `yarn add @endify/electron`
2. Add this to your Endify configuration
```js
{
  packages: [
    {
      name: '@endify/electron',
      options: {
        buildOptions: {
          // Options from electron-builder
        },
        version: '1.2.6'
      }
    }
  ]
}
```