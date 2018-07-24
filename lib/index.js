module.exports = function(bundler) {
  bundler.addPackager('css', require.resolve('./css-packager'))
}
