import reactConfig from '@repo/config-eslint/react'

export default [
  ...reactConfig,
  {
    ignores: ['node_modules', 'build', 'postcss.config.js'],
    rules: {
      ' import/no-anonymous-default-export': 'off',
    },
  },
]
