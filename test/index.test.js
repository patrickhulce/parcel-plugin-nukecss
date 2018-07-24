const path = require('path')
const Bundler = require('parcel-bundler')
const plugin = require('../lib')
const CSSPackager = require('../lib/css-packager')

const DIST = path.join(__dirname, 'dist')
const simple = path.join(__dirname, 'fixtures/simple.html')

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

    it(
      'should eliminate unused css',
      async () => {
        bundle = await bundler.bundle()
        const css = Array.from(CSSPackager.collectAllAssets(bundle))
          .map(asset => asset.generated.css)
          .filter(Boolean)
          .join('\n\n')

        expect(css.replace(/}/g, '}\n')).toMatchSnapshot()
      },
      15000,
    )
  })
})
