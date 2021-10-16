export default async function({hooks, config, globalConfig}) {
  hooks.tap('before-route-resolve', ({router, app}) => {
    const matchedComponents = router.matchedCompoinents
    await Promise.all(matchedComponents.map(e => {
      return e[config.functionName]()
    }))
  })
}