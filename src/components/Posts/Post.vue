<template>
  <v-container v-if="getPost" class=" mb-5" flexbox center>
    <v-flex xs10 offset-xs1>
      <v-layout row wrap>
        <v-flex>
          <v-card hover>
            <v-card-title class="py-2">
              <v-list-tile-avatar color="grey darken-3" class="">
                <v-img
                  class="elevation-6"
                  :src="getPost.createdBy.avatar"
                ></v-img>
              </v-list-tile-avatar>
              <h2 class="font-weight-regular">{{ getPost.title }}</h2>
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
                :aspect-ratio="16/9"
                :src="getPost.imageUrl"
                id="post__image"
              ></v-img>
            </v-tooltip>
            <!-- post image dialog -->
            <v-dialog v-model="dialog" max-width="80%">
              <v-card>
                <v-img
                  @click="toggleImageDialog"
                  :aspect-ratio="1"
                  :src="getPost.imageUrl"
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

      <!-- messages section -->
      <div class="mt-3">
        <!-- message input -->
        <v-layout class="" v-if="user">
          <v-flex xs12>
            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="addPostMessage"
            >
              <v-layout row>
                <v-textarea
                  v-model="messageBody"
                  :rules="messageRules"
                  counter="150"
                  solo
                  auto-grow
                  rows="2"
                  clearable
                  :append-outer-icon="messageBody && 'mdi-send'"
                  label="此刻的想法..."
                  type="text"
                  @click:append-outer="addPostMessage"
                  prepend-inner-icon="mdi-comment-outline"
                  required
                ></v-textarea>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
        <!-- messages -->
        <v-layout row wrap>
          <v-flex xs12>
            <v-list subheader two-line>
              <v-subheader>评论 ({{ getPost.messages.length }})</v-subheader>

              <template v-for="message in getPost.messages">
                <v-divider :key="message._id"></v-divider>
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                    <img :src="message.messageUser.avatar" />
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>{{
                      message.messageBody
                    }}</v-list-tile-title>
                    <v-list-tile-sub-title
                      >{{ message.messageUser.username }}
                      <span class="grey--text text-lighten-1 hidden-xs-only">{{
                        getTimeFromNow(message.messageDate)
                      }}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action class="hidden-xs-only">
                    <v-icon :color="isOwnMessage(message)?'accent':'grey'"
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
    ADD_POST_MESSAGE,
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
        messageBody: "",
        isFormValid: true,
        messageRules: [
          message => !!message || "内容不得为空",
          message => (message && message.length <= 150) || "字数不得超过150"
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
      ...mapGetters(["user", "userFavorites"])
    },
    methods: {
      getTimeFromNow(time) {
        return moment(new Date(Number(time))).fromNow();
      },
      toggleLike() {
        if (this.postLiked) {
          this.unlikePost();
        } else {
          this.likePost();
        }
      },
      isPostLiked() {
        // check if user favorites includes post with id of 'postid'
        if (
          this.userFavorites &&
          this.userFavorites.some(fave => fave._id === this.postId)
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
      isOwnMessage(message) {
        return this.user && this.user._id === message.messageUser._id;
      },

      addPostMessage() {
        if (this.$refs.form.validate()) {
          const variables = {
            messageBody: this.messageBody,
            userId: this.user._id,
            postId: this.postId
          };
          this.$apollo
            .mutate({
              mutation: ADD_POST_MESSAGE,
              variables,
              update: (cache, { data: { addPostMessage } }) => {
                const data = cache.readQuery({
                  query: GET_POST,
                  variables: { postId: this.postId }
                });
                // console.log("data", data);
                // console.log("add post message", addPostMessage);
                data.getPost.messages.unshift(addPostMessage);
                cache.writeQuery({
                  query: GET_POST,
                  variables: { postId: this.postId },
                  data
                });
              }
            })
            .then(({ data }) => {
              this.$refs.form.reset();
              console.log(data.addPostMessage);
            })
            .catch(err => console.error(err));
        }
      },
      likePost() {
        const variables = {
          postId: this.postId,
          username: this.user.username
        };
        this.$apollo
          .mutate({
            mutation: LIKE_POST,
            variables,
            update: (cache, { data: { likePost } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              data.getPost.likes++;
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(({ data }) => {
            // console.log("user", this.user);
            // console.log("like post", data.likePost);
            const updatedUser = {
              ...this.user,
              favorites: data.likePost.favorites
            };
            this.$store.commit("setUser", updatedUser);
          })
          .catch(err => console.error(err));
      },
      unlikePost() {
        const variables = {
          postId: this.postId,
          username: this.user.username
        };
        this.$apollo
          .mutate({
            mutation: UNLIKE_POST,
            variables,
            update: (cache, { data: { unlikePost } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              data.getPost.likes--;
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(({ data }) => {
            // console.log("user", this.user);
            // console.log("like post", data.likePost);
            const updatedUser = {
              ...this.user,
              favorites: data.unlikePost.favorites
            };
            this.$store.commit("setUser", updatedUser);
          })
          .catch(err => console.error(err));
      }
    }
  };
</script>
<style>
  #post__image {
    /* height: 400px !important; */
  }
</style>
