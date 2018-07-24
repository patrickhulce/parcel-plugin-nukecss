const Bundler = require('parcel-bundler')
const NukecssPlugin = require('../../lib')

const bundle = new Bundler(`${__dirname}/simple.html`, {
  minify: true,
  production: true,
})

NukecssPlugin(bundle)

bundle.bundle()
