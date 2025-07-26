import reactjsConfig from '@repo/config-eslint/react'

export default [
  ...reactjsConfig,
  {
    ignores: ['node_modules', 'build', 'postcss.config.js'],
  },
]
