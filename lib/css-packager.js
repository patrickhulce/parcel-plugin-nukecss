const _ = require('lodash')
const nukecss = require('nukecss')
const CSSPackager_ = require('parcel-bundler/src/packagers/CSSPackager')

const SYMBOL = Symbol('parcel-plugin-nukecss')

class CSSPackager extends CSSPackager_ {
  static traverseAndNuke(mainBundle) {
    if (mainBundle[SYMBOL] && mainBundle[SYMBOL].nukedCSS) return mainBundle[SYMBOL].nukedCSS

    const assets = CSSPackager.collectAllAssets(mainBundle)
    const sources = _(assets)
      .map(asset => [
        {type: 'js', content: asset.generated.js},
        {type: 'html', content: asset.generated.html},
      ])
      .flatten()
      .filter(entry => entry.content)
      .value()

    const nukedCSS = new Map()
    for (const asset of assets) {
      if (asset.generated.css) {
        nukedCSS.set(asset.id, nukecss(sources, asset.generated.css || ''))
      }
    }

    mainBundle[SYMBOL].nukedCSS = nukedCSS
    return nukedCSS
  }

  static collectAllAssets(mainBundle) {
    if (mainBundle[SYMBOL] && mainBundle[SYMBOL].allAssets) return mainBundle[SYMBOL].allAssets

    const collection = new Set()

    function recurse(bundle) {
      for (const asset of bundle.assets) {
        collection.add(asset)
      }

      for (const child of bundle.childBundles) {
        if (collection.has(child.entryAsset)) continue
        recurse(child, collection)
      }
    }

    recurse(mainBundle)
    mainBundle[SYMBOL] = mainBundle[SYMBOL] || {}
    mainBundle[SYMBOL].allAssets = Array.from(collection)
    return mainBundle[SYMBOL].allAssets
  }

  async addAsset(asset) {
    if (this.options.production) {
      const nukedCSS = CSSPackager.traverseAndNuke(this.bundler.mainBundle)
      asset.generated.css = nukedCSS.get(asset.id)
    }

    return super.addAsset(asset)
  }
}

module.exports = CSSPackager
