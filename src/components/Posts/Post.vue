<template>
  <v-container v-if="getPost" class="pd0 mb-5" flexbox center>
    <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
      <v-layout row wrap>
        <v-flex>
          <v-card hover>
            <v-card-title class="py-2">
              <v-list-tile-avatar
                color="grey light-3"
                class=""
                v-push:to="`/${getPost.author.username}`"
              >
                <v-img class="elevation-6" :src="getPost.author.avatar"></v-img>
              </v-list-tile-avatar>
              <h2
                class="font-weight-regular"
                v-push:to="`/${getPost.author.username}`"
              >
                {{ getPost.author.username }}
              </h2>
              <v-btn @click="toggleLike" icon v-if="user" class="ml-3">
                <v-icon middle :color="isPostLiked(getPost._id)?'red':'grey'"
                  >mdi-heart</v-icon
                >
              </v-btn>
              <h3 class="ml-2 font-weight-thin">{{ getPost.likes }} LIKES</h3>
              <v-spacer></v-spacer>
              <v-btn @click="geToPreviousPage()" icon>
                <v-icon color="info" large>mdi-arrow-left</v-icon>
              </v-btn>
            </v-card-title>

            <v-tooltip right>
              <span>点击放大图片</span>
              <v-img
                @click="toggleImageDialog"
                slot="activator"
                lazy-src="https://picsum.photos/10/6?image=10"
                :src="getPost.image.url"
                id="post__image"
              ></v-img>
            </v-tooltip>
            <!-- post image dialog -->
            <v-dialog v-model="dialog" max-width="80%">
              <v-card>
                <v-img
                  @click="toggleImageDialog"
                  :aspect-ratio="1"
                  :src="getPost.image.url"
                  height="100vh"
                ></v-img>
              </v-card>
            </v-dialog>

            <v-card-text>
              <span v-for="(tag, index) in getPost.tags" :key="index">
                <v-chip class="mb-3" color="accent" text-color="white">{{
                  tag
                }}</v-chip>
              </span>
              <h3 class="font-weight-regular">{{ getPost.description }}</h3>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- comments section -->
      <div class="mt-3">
        <!-- comment input -->
        <v-layout class="" v-if="user">
          <v-flex xs12>
            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="addPostComment"
            >
              <v-layout row>
                <v-textarea
                  v-model="commentBody"
                  :rules="commentRules"
                  counter="150"
                  solo
                  auto-grow
                  rows="2"
                  clearable
                  :append-icon="commentBody && 'mdi-send'"
                  label="此刻的想法..."
                  type="text"
                  @click:append="addPostComment"
                  prepend-inner-icon="mdi-comment-outline"
                  required
                ></v-textarea>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
        <!-- comments -->
        <v-layout row wrap>
          <v-flex xs12>
            <v-list subheader two-line>
              <v-subheader>评论 ({{ getPost.comments.length }})</v-subheader>

              <template v-for="comment in getPost.comments">
                <v-divider :key="comment._id"></v-divider>
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                    <img :src="comment.user.avatar" />
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{ comment.body }}</v-list-tile-title>
                    <v-list-tile-sub-title
                      v-push:to="`/${comment.user.username}`"
                      >{{ comment.user.username }}
                      <span class="grey--text text-lighten-1 hidden-xs-only">{{
                        getTimeFromNow(comment.created)
                      }}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action class="hidden-xs-only">
                    <v-icon :color="isOwnComment(comment)?'accent':'grey'"
                      >mdi-chat</v-icon
                    >
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
  </v-container>
</template>

<script>
  import moment from "moment";
  import { mapGetters } from "vuex";
  import {
    GET_POST,
    USER,
    POST,
    GET_USER,
    ADD_POST_COMMENT,
    LIKE_POST,
    UNLIKE_POST
  } from "../../queries";
  export default {
    name: "Post",
    props: ["postId"],
    data() {
      return {
        postLiked: false,
        dialog: false,
        commentBody: "",
        isFormValid: true,
        commentRules: [
          comment => !!comment || "内容不得为空",
          comment => (comment && comment.length <= 150) || "字数不得超过150"
        ]
      };
    },
    apollo: {
      getPost: {
        query: GET_POST,
        variables() {
          return {
            postId: this.postId
          };
        }
      }
    },
    computed: {
      ...mapGetters(["user", "_user"])
    },
    methods: {
      getTimeFromNow(time) {
        return moment(new Date(Number(time))).fromNow();
      },
      toggleLike() {
        this.likePost(this.postLiked ? false : true);
        // if (this.postLiked) {
        //   this.unlikePost();
        // } else {
        //   this.likePost();
        // }
      },
      isPostLiked() {
        // check if user favorites includes post with id of 'postid'
        if (
          this.user.favorites &&
          this.user.favorites.some(fave => fave._id === this.postId)
        ) {
          this.postLiked = true;
          return true;
        } else {
          this.postLiked = false;
          return false;
        }
      },
      geToPreviousPage() {
        this.$router.go(-1);
      },
      toggleImageDialog() {
        if (window.innerWidth > 500) {
          this.dialog = !this.dialog;
        }
      },
      isOwnComment(comment) {
        return this.user && this.user._id === comment.user._id;
      },

      addPostComment() {
        if (this.$refs.form.validate()) {
          const variables = {
            body: this.commentBody,
            userId: this.user._id,
            postId: this.postId
          };
          this.$apollo
            .mutate({
              mutation: ADD_POST_COMMENT,
              variables,
              update: (cache, { data: { addPostComment } }) => {
                const data = cache.readQuery({
                  query: GET_POST,
                  variables: { postId: this.postId }
                });
                // console.log("data", data);
                // console.log("add post comment", addPostComment);
                data.getPost.commentsSize++;
                data.getPost.comments.unshift(addPostComment);
                cache.writeQuery({
                  query: GET_POST,
                  variables: { postId: this.postId },
                  data
                });
                // if(this._user.username === this.post.createdBy) {
                //   this.
                // }
                console.log(
                  cache.readQuery({
                    query: GET_POST,
                    variables: { postId: this.postId }
                  }),
                  cache.readFragment({
                    fragment: POST,
                    id: "Post:" + this.postId
                  })
                );
              }
            })
            .then(({ data }) => {
              this.$refs.form.reset();
              console.log(data.addPostComment);
            })
            .catch(err => console.error(err));
        }
      },
      likePost(isLike) {
        const variables = {
          postId: this.postId,
          username: this.user.username,
          isLike
        };
        this.$apollo
          .mutate({
            mutation: LIKE_POST,
            variables,
            update: (cache, { data: { likePost } }) => {
              let postData = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              if (
                cache.data.data.ROOT_QUERY[
                  'getUser({"username":"' + this.user.username + '"})'
                ]
              ) {
                // let userData = cache.readQuery({
                //   query: GET_USER,
                //   variables: { username: this.user.username }
                // });
                // console.log("getUser", userData.getUser);
                // userData.getUser.favorites = likePost.favorites;
                // userData.getUser.favoritesSize = likePost.favorites.length;
                console.log(likePost);
                // cache.writeQuery({
                //   query: GET_USER,
                //   variables: { username: this.user.username },
                //   data: userData
                // });
                let userData = cache.readFragment({
                  fragment: USER,
                  id: "User:" + this.user._id
                });
                userData.favoritesSize = likePost.favorites.length;
                userData.favorites = likePost.favorites;
                cache.writeFragment({
                  fragment: USER,
                  id: "User:" + this.user._id,
                  data: userData
                });
                console.log(
                  // cache.readQuery({
                  //   query: GET_USER,
                  //   variables: { username: this.user.username }
                  // }),
                  cache.readFragment({
                    fragment: USER,
                    id: "User:" + this.user._id
                  })
                );
              }

              // let user = cache.readFragment({
              //   fragment: USER,
              //   id: "User:" + this.user._id
              // });
              if (!isLike) {
                postData.getPost.likes--;
                // user.favoritesSize--;
                // user.favorites.splice(0, 1);
              } else {
                // console.log(user.favoritesSize);
                // user.favoritesSize++;
                // user.favorites.unshift({ _id: this.postId });
                // console.log(user.favoritesSize);
              }
              // cache.writeFragment({
              //   fragment: USER,
              //   id: "User:" + this.user._id,
              //   data: user
              // });

              console.log(postData.getPost, postData.getPost.likes);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data: postData
              });
            }
          })
          .then(({ data }) => {
            console.log("user", this.user);
            console.log("like post", data.likePost);
            const updatedUser = {
              ...this.user,
              favoritesSize: data.likePost.favorites.length,
              favorites: data.likePost.favorites
            };
            this.$store.commit("setUser", updatedUser);
          })
          .catch(err => console.error(err));
      }
      // unlikePost() {
      //   const variables = {
      //     postId: this.postId,
      //     username: this.user.username
      //   };
      //   this.$apollo
      //     .mutate({
      //       mutation: LIKE_POST,
      //       variables,
      //       update: (cache, { data: { unlikePost } }) => {
      //         const data = cache.readQuery({
      //           query: GET_POST,
      //           variables: { postId: this.postId }
      //         });
      //         data.getPost.likes--;
      //         cache.writeQuery({
      //           query: GET_POST,
      //           variables: { postId: this.postId },
      //           data
      //         });
      //       }
      //     })
      //     .then(({ data }) => {
      //       // console.log("user", this.user);
      //       // console.log("like post", data.likePost);
      //       const updatedUser = {
      //         ...this.user,
      //         favorites: data.unlikePost.favorites
      //       };
      //       this.$store.commit("setUser", updatedUser);
      //     })
      //     .catch(err => console.error(err));
      // }
    }
  };
</script>
<style lang="stylus">
  #post__image {
    /* height: 400px !important; */
  }
  @media only screen and (max-width: 600px)
    .pd0
      padding 0;
</style>
