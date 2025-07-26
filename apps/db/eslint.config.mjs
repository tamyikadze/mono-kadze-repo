import baseConfig from '@repo/config-eslint/base'

export default [
  ...baseConfig,
  {
    ignores: ['node_modules', 'build', 'postcss.config.js'],
  },
]
