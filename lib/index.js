const CSSPackager = require('./css-packager')

module.exports = function(bundler) {
  bundler.addPackager('css', require.resolve('./css-packager'))
}

module.exports.CSSPackager = CSSPackager
