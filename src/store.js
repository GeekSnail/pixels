import Vue from "vue";
import Vuex from "vuex";
import { defaultClient as apolloClient } from "./main";
import router from "./router";
// import { gql } from "apollo-boost";

import {
  GET_CURRENT_USER,
  GET_POSTS,
  POST_FRAG,
  SEARCH_POSTS,
  ADD_POST,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS
} from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null, // signin form
    authError: null // token
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearSearchResults: state => (state.searchResults = []),
    clearError: state => (state.error = null)
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          // add user data to state
          commit("setUser", data.getCurrentUser);
          commit("setLoading", false);
          // console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          console.log("action getPosts", data);
          // if (data.Post.imageUrl) {
          //   data.getPosts.unshift(data.Post);
          // }
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          console.log("userPosts", data.getUserPosts);
          commit("setUserPosts", data.getUserPosts);
        })
        .catch(err => console.error(err));
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          console.log("search", data.searchPosts);
          commit("setSearchResults", data.searchPosts);
        })
        .catch(err => console.error(err));
    },

    addPost: ({ commit }, { payload, imageUrl }) => {
      // console.log("payload", payload);
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            console.log(cache);
            // first read the query you want to update
            console.log(cache.data.data);
            // console.log(cache.readFragment({
            //   id:
            // }))
            if (
              (!!cache.data.data.ROOT_QUERY &&
                cache.data.data.ROOT_QUERY.hasOwnProperty("getPosts")) ||
              (!!cache.data.parent &&
                cache.data.parent.data.ROOT_QUERY.hasOwnProperty("getPosts"))
            ) {
              let data = cache.readQuery({ query: GET_POSTS }); //has added optRes
              if (data.getPosts.find(post => post._id === addPost._id)) {
                return;
              } else {
                console.log("readquery", data);
                data.getPosts.unshift(addPost);
                // write updated data back to query
                console.log("data.getPosts.unshift", data);
                cache.writeQuery({
                  query: GET_POSTS,
                  data
                });
              }
              // commit(
              //   "setPosts",
              //   cache.readQuery({ query: GET_POSTS }).getPosts
              // );
              // console.log("writequery", cache.data.data);
              // console.log("readquery 2", cache.readQuery({ query: GET_POSTS }));
            }
          },
          // optimistic response ensures data is added immidiately as we specified the update function
          // 首先写入 cache.data.data.ROOT_QUERY, 添加一条记录 {id:-1...}
          optimisticResponse: () => {
            console.log(payload);
            const { title, tags, description } = payload;
            return {
              __typename: "Mutation",
              addPost: {
                __typename: "Post",
                _id: -1, //fake
                title,
                imageUrl
                // tags,
                // description
              }
            };
          },
          // return specified queries queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 6
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          console.log("user posts", state.userPosts);
          console.log("updated post", data);
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => console.error(err));
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => console.error(err));
    },

    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      // clear token to prevent errors before sigin
      // localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          // to make sure getCurrentUser method is run in main.js reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signupUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      // clear token to prevent errors before sigin
      // localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          // to make sure getCurrentUser method is run in main.js reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clean user in state
      commit("clearUser");
      // remove token in localStorage
      localStorage.setItem("token", "");
      // end session
      await apolloClient.clearStore();
      // redirect home
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
