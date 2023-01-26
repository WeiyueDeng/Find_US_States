import {createApp, provide, h} from 'vue'
import './style.css'
import App from './App.vue'
import { ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client/core'
import VueApollo from 'vue-apollo'
import { ApolloClients } from '@vue/apollo-composable'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here, graphql endpoint
  uri: 'http://localhost:4000',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

// app.use(VueApollo)

// const apolloProvider = new VueApollo({
//     defaultClient: apolloClient,
// })

const app = createApp({
    setup () {
        provide(ApolloClients, {
            default: apolloClient,
          })
      },
    
      render: () => h(App),
  })

  app.mount('#app');
