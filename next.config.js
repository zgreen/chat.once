module.exports = {
  webpack: config => ({ ...config, node: { ...config.node, fs: 'empty' } }),
  target: 'serverless'
}
