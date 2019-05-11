import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import ApolloClient from "apollo-boost";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
//import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { onError } from "apollo-link-error";
import { withClientState } from "apollo-link-state";
import { setContext } from "apollo-link-context";
import { ApolloLink, Observable, concat } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import VueApollo from "vue-apollo";
import FormAlert from "./components/Shared/FormAlert";
// import { VLazyImagePlugin } from './plugin/VLazyImage';
// Vue.use(VLazyImagePlugin);

// import ElementUI from "element-ui";
// import "./assets/styles.scss";
// Vue.use(ElementUI);

import "./assets/global.styl";
Vue.component("form-alert", FormAlert);
//https://vuejs.org/v2/guide/custom-directive.html#Directive-Hook-Arguments
//https://blog.csdn.net/webfansplz/article/details/78880582
Vue.directive("push", {
  bind: function(el, { value }) {
    el.addEventListener("click", function() {
      router.push(value);
    });
  }
});
// v-push:to="`/${user.username}`"
Vue.use(VueApollo);
// Setup ApolloClient
const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      getPost: (_, { postId }, { getCacheKey }) =>
        getCacheKey({ __typename: "Post", id: postId }),
      getUser: (_, { userId }, { getCacheKey }) =>
        getCacheKey({ __typename: "User", id: userId })
    }
  },
  // dataIdFromObject: object => object._id,
  addTypename: true
});
const request = operation => {
  // if no token with key of 'token' in localStorage, add it
  if (!localStorage.token) {
    localStorage.setItem("token", "");
  }
  operation.setContext({
    headers: {
      //when http options method, request headers:
      //Access-Control-Request-Headers: authorization,content-type
      //Access-Control-Request-Method: POST
      //when http post method, request headers: authorization: xxx
      authorization: localStorage.getItem("token")
    }
  });
};
const requestLink = new ApolloLink(
  operation =>
    // new Observable(observer => {
    //   let handle;
    Promise.resolve(operation).then(oper => request(oper))
  //   .then(() => {
  //     handle = forward(operation).subscribe({
  //       next: observer.next.bind(observer),
  //       error: observer.error.bind(observer),
  //       complete: observer.complete.bind(observer)
  //     });
  //   })
  //   .catch(observer.error.bind(observer));

  // return () => {
  //   if (handle) handle.unsubscribe();
  // };
  // })
);
console.log(
  process.env.NODE_ENV,
  "=",
  process.env.VUE_APP_GRAPHQL_URI,
  process.env.VUE_APP_WS_GRQPHQL_URI,
  process.env.BASE_URL
);
const httpLink = createUploadLink({
  uri: process.env.VUE_APP_GRAPHQL_URI,
  credentials: "include"
});
// 创建订阅的 websocket 连接
const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_WS_GRQPHQL_URI,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("token")
    }
  }
});
// 使用分割连接的功能, 你可以根据发送的操作类型将数据发送到不同的连接
const link = split(
  // 根据操作类型分割
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);
export const defaultClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (networkError) {
        console.log("[networkError]", networkError);
      }
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          console.dir(err);
          if (err.name === "AuthenticationError") {
            store.commit("setAuthError", err);
            store.dispatch("signoutUser");
          }
        }
      }
    }),
    //requestLink,
    setContext(request => {
      if (!localStorage.token) {
        localStorage.setItem("token", "");
      }
      return {
        headers: {
          authorization: localStorage.getItem("token")
        }
      };
    }),
    // new ApolloLink((operation, forward) => {
    //   operation.setContext({
    //       headers: {
    //           authorization: localStorage.getItem("token")
    //       },
    //   });
    //   return forward(operation);
    // }),

    withClientState({
      cache,
      resolvers: {
        Mutation: {
          addPost_: (_, post, { cache }) => {
            console.log("client", cache, post);
            const data = {
              Post: {
                _id: -1,
                __typename: "Post",
                ...post
              }
            };
            cache.writeData({ data });
            return null;
          }
        }
      },
      defaults: {
        Post: {
          __typename: "Post",
          _id: -1,
          imageUrl: "",
          naturalWidth: 0,
          naturalHeight: 0,
          tags: [],
          description: ""
        }
      }
    }),
    // new HttpLink({
    //   uri: "http://localhost:4000/graphql"
    //   //credentials: "include"
    //   // headers: {
    //   //   authorization: localStorage.getItem("token")
    //   // }
    // }),
    // createUploadLink({
    //   uri: "http://localhost:4000/graphql"
    //   //credentials: "include"
    // })
    link
  ]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
      // pollInterval: 1000
    }
  },
  queryDeduplication: true,
  connectToDevTools: true,
  cache
  // uri: "http://localhost:4000/graphiql",
  // // include auth token with the requests made to backend
  // fetchOptions: {
  //   credentials: "include"
  // },
  // // set request option, which is sent to backend:
  // // new ApolloServer({ context: ({req}) => {} })
  // request: operation => {
  //   // if no token with key of 'token' in localStorage, add it
  //   if (!localStorage.token) {
  //     localStorage.setItem("token", "");
  //   }
  //   // operation add the token to an authorization headers
  //   operation.setContext({
  //     headers: {
  //       //when http options method, request headers:
  //       //Access-Control-Request-Headers: authorization,content-type
  //       //Access-Control-Request-Method: POST
  //       //when http post method, request headers: authorization: xxx
  //       authorization: localStorage.getItem("token")
  //     }
  //   });
  // },
  // onError: ({ graphQLErrors, networkError }) => {
  //   if (networkError) {
  //     console.log("[networkError]", networkError);
  //   }
  //   if (graphQLErrors) {
  //     for (let err of graphQLErrors) {
  //       console.dir(err);
  //       // when token is failed (after server.js formatError)
  //       if (err.name === "AuthenticationError") {
  //         // set authError in state (to show in snackbar)
  //         store.commit("setAuthError", err);
  //         // signout user (to clean token)
  //         store.dispatch("signoutUser");
  //       }
  //     }
  //   }
  // }
});
const apolloProvider = new VueApollo({ defaultClient });
Vue.config.productionTip = false;

new Vue({
  apolloProvider,
  router,
  store,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    if (!this.$store.getters.user) {
      this.$store.dispatch("getCurrentUser");
    }
  }
}).$mount("#app");
