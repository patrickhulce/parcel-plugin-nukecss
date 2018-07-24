const path = require('path')
const Bundler = require('parcel-bundler')
const plugin = require('../lib')

const DIST = path.join(__dirname, 'dist')
const simple = path.join(__dirname, 'fixtures/simple.html')

function findCSSBundle(bundle) {
  for (const child of bundle.childBundles) {
    if (child.type === 'css') return child
    const recursive = findCSSBundle(child)
    if (recursive) return recursive
  }
}

/* eslint-env jest */

describe('lib/index.js', () => {
  let bundler, bundle

  describe('simple case', () => {
    beforeAll(async () => {
      bundler = new Bundler(simple, {
        watch: false,
        logLevel: 0,
        production: true,
        outDir: DIST,
      })

      plugin(bundler)
    })

    it('should eliminate unused css', async () => {
      bundle = await bundler.bundle()
      const cssBundle = findCSSBundle(bundle)
      const css = [...cssBundle.assets][0].generated.css

      expect(css).toMatchSnapshot()
    })
  })
})
