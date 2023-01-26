// apollo.config.js
module.exports = {
    client: {
      service: {
        name: 'typeahead_map_integerated',
        // URL to the GraphQL API, URL might be different according to your graphQL endpoint
        url: 'http://localhost:40000',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }