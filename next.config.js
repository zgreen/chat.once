const baseConfig = {
  webpack: config => ({ ...config, node: { ...config.node, fs: 'empty' } })
}
const analyzeConfig = {
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  }
}
module.exports = ['browser', 'server', 'both'].includes(
  process.env.BUNDLE_ANALYZE
)
  ? require('@zeit/next-bundle-analyzer')({ ...baseConfig, ...analyzeConfig })
  : baseConfig
