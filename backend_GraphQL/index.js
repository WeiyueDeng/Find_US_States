const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields: 'title' and 'author'.
  type State {
    name: String!
    latitude: Float!
    longitude: Float!
  } 

  input StatesInputFilter {
    keyword: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    #getStates: [State]
    states(keyword:String!): [State]! 
    #matchedStates(input: StatesInputFilter):[State]!
    #getStates:[State]
  }
`;
// const filter = {
//     "keyword": "New"
// }
const states = [
        {
            name:"Alaska",
            latitude:61.3850,
            longitude:-152.2683
        },
        {
            name:"Alabama",
            latitude:32.7990,
            longitude:-86.8073
        },
        {
            name:"Arkansas",
            latitude:34.9513,
            longitude:-92.3809
        },
        {
            name:"Arizona",
            latitude:33.7712,
            longitude:-111.3877
        },
        {
            name:"California",
            latitude:36.1700,
            longitude:-119.7462
        },
        {
            name:"Colorado",
            latitude:39.0646,
            longitude:-105.3272
        },
        {
            name:"Connecticut",
            latitude:41.5834,
            longitude:-72.7622
        },
        {
            name:"Delaware",
            latitude:39.3498,
            longitude:-75.5148
        },
        {
            name:"Florida",
            latitude:27.8333,
            longitude:-81.7170
        },
        {
            name:"Georgia",
            latitude:32.9866,
            longitude:-83.6487
        },
        {
            name:"Hawaii",
            latitude:21.1098,
            longitude:-157.5311
        },
        {
            name:"Iowa",
            latitude:42.0046,
            longitude:-93.2140
        },
        {
            name:"Idaho",
            latitude:44.2394,
            longitude:-114.5103
        },
        {
            name:"Illinois",
            latitude:40.3363,
            longitude:-89.0022
        },
        {
            name:"Indiana",
            latitude:39.8647,
            longitude:-86.2604
        },
        {
            name:"Kansas",
            latitude:38.5111,
            longitude:-96.8005
        },
        {
            name:"Kentucky",
            latitude:37.6690,
            longitude:-84.6514
        },
        {
            name:"Louisiana",
            latitude:31.1801,
            longitude:-91.8749
        },
        {
            name:"Massachusetts",
            latitude:42.2373,
            longitude:-71.5314
        },
        {
            name:"Maryland",
            latitude:39.0724,
            longitude:-76.7902
        },
        {
            name:"Maine",
            latitude:44.6074,
            longitude:-69.3977
        },
        {
            name:"Michigan",
            latitude:43.3504,
            longitude:-84.5603
        },
        {
            name:"Minnesota",
            latitude:45.7326,
            longitude:-93.9196
        },
        {
            name:"Missouri",
            latitude:38.4623,
            longitude:-92.3020
        },
        {
            name:"Mississippi",
            latitude:32.7673,
            longitude:-89.6812
        },
        {
            name:"Montana",
            latitude:46.9048,
            longitude:-110.3261
        },
        {
            name:"North Carolina",
            latitude:35.6411,
            longitude:-79.8431
        },
        {
            name:"North Dakota",
            latitude:47.5362,
            longitude:-99.7930
        },
        {
            name:"Nebraska",
            latitude:41.1289,
            longitude:-98.2883
        },
        {
            name:"New Hampshire",
            latitude:43.4108,
            longitude:-71.5653
        },
        {
            name:"New Jersey",
            latitude:40.3140,
            longitude:-74.5089
        },
        {
            name:"New Mexico",
            latitude:34.8375,
            longitude:-106.2371
        },
        {
            name:"Nevada",
            latitude:38.4199,
            longitude:-117.1219
        },
        {
            name:"New York",
            latitude:42.1497,
            longitude:-74.9384
        },
        {
            name:"Ohio",
            latitude:40.3736,
            longitude:-82.7755
        },
        {
            name:"Oklahoma",
            latitude:35.5376,
            longitude:-96.9247
        },
        {
            name:"Oregon",
            latitude:44.5672,
            longitude:-122.1269
        },
        {
            name:"Pennsylvania",
            latitude:40.5773,
            longitude:-77.2640
        },
        {
            name:"Rhode Island",
            latitude:41.6772,
            longitude:-71.5101
        },
        {
            name:"South Carolina",
            latitude:33.8191,
            longitude:-80.9066
        },
        {
            name:"South Dakota",
            latitude:44.2853,
            longitude:-99.4632
        },
        {
            name:"Tennessee",
            latitude:35.7449,
            longitude:-86.7489
        },
        {
            name:"Texas",
            latitude:31.1060,
            longitude:-97.6475
        },
        {
            name:"Utah",
            latitude:40.1135,
            longitude:-111.8535
        },
        {
            name:"Virginia",
            latitude:37.7680,
            longitude:-78.2057
        },
        {
            name:"Vermont",
            latitude:44.0407,
            longitude:-72.7093
        },
        {
            name:"Washington",
            latitude:47.3917,
            longitude:-121.5708
        },
        {
            name:"Wisconsin",
            latitude:44.2563,
            longitude:-89.6385
        },
        {
            name:"West Virginia",
            latitude:38.4680,
            longitude:-80.9696
        },
        {
            name:"Wyoming",
            latitude:42.7475,
            longitude:-107.2085
        }
    ]

const resolvers = {
    Query: {
        // getStates(){
        //     return states;
        // },
        states(parent, args, contextValue, info) {
            // console.log(args.keyword);
            console.log("key->",args.keyword);
            return states.filter((state) => {
                var stateName = state.name;
                var targetMatch = new RegExp(args.keyword, "gi");
                console.log("state",state.name);
                var hasMatched = stateName.match(targetMatch);
                console.log("matched",hasMatched);
                return !(hasMatched == null);
            });
        }
        // matchedStates(){
        //     return states;
        // }
    },
};

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});