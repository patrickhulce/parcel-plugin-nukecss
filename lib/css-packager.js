const _ = require('lodash')
const nukecss = require('nukecss')
const CSSPackager_ = require('parcel-bundler/src/packagers/CSSPackager')

class CSSPackager extends CSSPackager_ {
  static collectAllAssets(bundle, collection = new Set()) {
    for (const asset of bundle.assets) {
      collection.add(asset)
    }

    for (const child of bundle.childBundles) {
      if (collection.has(child.entryAsset)) continue
      CSSPackager.collectAllAssets(child, collection)
    }

    return collection
  }

  _collectAllAssets() {
    if (this._allAssets) return this._allAssets
    const assets = CSSPackager.collectAllAssets(this.bundler.mainBundle)
    this._allAssets = Array.from(assets)
    return this._allAssets
  }

  async addAsset(asset) {
    if (this.options.production) {
      const assets = this._collectAllAssets()
      const sources = _(assets)
        .map(asset => [
          {type: 'js', content: asset.generated.js},
          {type: 'html', content: asset.generated.html},
        ])
        .flatten()
        .filter(entry => entry.content)
        .value()

      asset.generated.css = nukecss(sources, asset.generated.css || '')
    }

    return super.addAsset(asset)
  }
}

module.exports = CSSPackager
