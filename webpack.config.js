const path = require("path");

module.exports = {
  // ...other webpack configuration options...

  resolve: {
    fallback: {
      fs: false, // You can set this to 'empty' or require.resolve('fs') if needed
      path: false, // You can set this to 'empty' or require.resolve('path-browserify') if needed
    },
  },
};
