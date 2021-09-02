module.exports = {
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    overrides: [
      // Eslint for backend
      {
        files: ['src/**/*.js'],
        extends: ['airbnb','prettier'],
        plugins: ['prettier'],
        env: {
          commonjs: true,
          es6: true,
          node: true,
        },
        rules: {
          "arrow-body-style": "warn"
        }
      },
    ],
  };
  