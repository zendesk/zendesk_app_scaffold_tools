/**
 * Generate jsdelivr url for Zendesk garden css components
 * @param {Object} devDependencies devDependencies section in project's package.json
 * @return {String} '' or jsdelivr url
 */
function getGardenLink (devDependencies) {
  const zendeskGardenPkgs = Object.keys(devDependencies).filter(item => item.includes('@zendeskgarden/css'))

  const zendeskGardenJsDelivrUrls = zendeskGardenPkgs.map((pkg) => {
    const version = devDependencies[pkg].replace(/^[\^~]/g, '').replace(/\.\d$/, '')
    return `npm/${pkg}@${version}`
  })

  return 'https://cdn.jsdelivr.net/combine/' + zendeskGardenJsDelivrUrls.join(',')
}

module.exports = {
  getGardenLink
}
