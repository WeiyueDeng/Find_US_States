// apollo.config.js
module.exports = {
    client: {
      service: {
        name: 'typeahead_map_integerated',
        // URL to the GraphQL API
        url: 'http://localhost:40000',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }