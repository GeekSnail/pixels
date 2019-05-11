import Vue from "vue";
import Vuex from "vuex";
import { defaultClient as apolloClient } from "./main";
import router from "./router";
// import { gql } from "apollo-boost";

import {
  GET_CURRENT_USER,
  GET_USER,
  USER,
  GET_POSTS,
  SEARCH_POSTS,
  ADD_POST,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS,
  POSTS_BY_IDS
} from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    user: null,
    _user: null,
    loading: false,
    error: null, // signin form
    authError: null // token
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUserPosts: (state, payload) => {
      // state.userPosts = payload;
      state.user.posts = payload;
    },
    // addPost: (state, payload) => {
    //   state.user.posts.unshift(payload);
    // },
    setUserFavorites: (state, payload) => {
      // state.userPosts = payload;
      state.user.favorites = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    set_user: (state, payload) => {
      state._user = payload;
    },
    add_userPost: (state, payload) => {
      if (state._user && state._user.username === state.user.username) {
        console.log("add_user_post");
        state._user.posts.unshift(payload);
      }
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
    getCurrentUser: async ({ commit }) => {
      // await apolloClient.resetStore();
      // console.log(apolloClient.cache.data.data);
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER,
          fetchPolicy: "network-only" //
        })
        .then(({ data }) => {
          // add user data to state
          console.log(data);
          commit("setUser", data.getCurrentUser);
          commit("setLoading", false);
          // console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit("setLoading", false);
          //console.error(err);
        });
    },
    getUser: ({ commit }, payload) => {
      // console.log(apolloClient.cache.data.data);
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_USER,
          variables: payload
        })
        .then(({ data }) => {
          // add user data to state
          commit("set_user", data.getUser);
          commit("setLoading", false);
          console.log("getUser", data.getUser);
        })
        .catch(err => {
          console.error(err);
          commit("setLoading", false);
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
    getUserFavorites: ({ commit }, payload) => {
      apolloClient
        .query({
          query: POSTS_BY_IDS,
          variables: payload
        })
        .then(({ data }) => {
          console.log("postsByIds", data.postsByIds);
          commit("setUserFavorites", data.postsByIds);
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
              console.log(data);
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
            // commit("add_userPost", addPost);
            // if (
            //   cache.data.data.ROOT_QUERY[
            //     'getUser({"username":"' + addPost.username + '"})'
            //   ]
            // ) {
            //   let userData = cache.readFragment({
            //     fragment: USER,
            //     id: "User:" + payload.userId
            //   });
            //   userData.posts.unshift(addPost);
            //   cache.writeFragment({
            //     fragment: USER,
            //     id: "User:" + payload.userId,
            //     data: userData
            //   });
            //   console.log(
            //     "add",
            //     // cache.readQuery({
            //     //   query: GET_USER,
            //     //   variables: { username: addPost.username }
            //     // }),
            //     cache.readFragment({
            //       fragment: USER,
            //       id: "User:" + payload.userId
            //     })
            //   );
            // }
          },
          // optimistic response ensures data is added immidiately as we specified the update function
          // 首先写入 cache.data.data.ROOT_QUERY, 添加一条记录 {id:-1...}
          // optimisticResponse: () => {
          //   console.log(payload);
          //   const { naturalWidth, naturalHeight, tags, description } = payload;
          //   return {
          //     __typename: "Mutation",
          //     addPost: {
          //       __typename: "Post",
          //       _id: -1, //fake
          //       // title,
          //       image: {
          //         __typename: "Image",
          //         url: imageUrl,
          //         naturalWidth,
          //         naturalHeight
          //       }
          //     }
          //   };
          // },
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
          // console.log(
          //   data.addPost,
          //   apolloClient.cache.data.data,
          //   'getUser({"username":"' + data.addPost.createdBy + '"})'
          // );
          if (
            apolloClient.cache.data.data.ROOT_QUERY[
              'getUser({"username":"' + data.addPost.createdBy + '"})'
            ]
          ) {
            // let userData = apolloClient.cache.readFragment({
            //   fragment: USER,
            //   id: "User:" + payload.userId
            // });
            let userData = apolloClient.cache.readQuery({
              query: GET_USER,
              variables: { username: data.addPost.createdBy }
            });
            console.log(userData, payload.userId);
            userData.getUser.posts.unshift(data.addPost);
            // apolloClient.cache.writeFragment({
            //   fragment: USER,
            //   id: "User:" + payload.userId,
            //   data: userData
            // });
            apolloClient.cache.writeQuery({
              query: GET_USER,
              variables: { username: data.addPost.createdBy },
              data: userData
            });
            console.log(
              "add",
              // cache.readQuery({
              //   query: GET_USER,
              //   variables: { username: addPost.username }
              // }),
              apolloClient.cache.readFragment({
                fragment: USER,
                id: "User:" + payload.userId
              })
            );
          }
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

    signinUser: ({ commit, dispatch }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      // clear token to prevent errors before sigin
      // localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
          update: (cache, { data: { token } }) => {
            console.log(cache, token);
          }
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          // to make sure getCurrentUser method is run in main.js reload the page
          // router.go(0);
          console.log("si", router.currentRoute);
          dispatch("getCurrentUser");

          router.replace("/");
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signupUser: ({ commit, dispatch }, payload) => {
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
          // router.go();
          console.log(router.currentRoute);
          dispatch("getCurrentUser");
          router.replace("/");
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
      console.log(apolloClient.cache);
      // remove token in localStorage
      localStorage.setItem("token", "");
      // end session
      await apolloClient.clearStore();
      await apolloClient.cache.reset();
      await apolloClient.resetStore(); // query was in flight
      console.log(apolloClient.cache);
      // redirect home
      // await apolloClient.cache.reset();
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    user: state => state.user,
    _user: state => state._user,
    profileUser: state => state.profileUser,
    // userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
