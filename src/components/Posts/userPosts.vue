<template>
  <v-container>
    <!-- posts favorited by user -->
    <!-- <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no favorites currently. Go and add some</h2>
        </v-flex>
      </v-layout>
    </v-container> -->
    
    <!-- <v-container class=""> -->
      <v-flex xs12>
        <!-- <h2 class="font-weight-light">
          Favorited
          <span class="font-weight-regular">{{ userFavorites.length }}</span>
        </h2> -->
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 v-for="(post,index) in posts" :key="post._id">
          <!-- <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img
              height="30vh"
              :src="favorite.imageUrl"
              :lazy-src="`https://picsum.photos/10/6?image=${index * 5 + 10}`"
            ></v-img>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card> -->
          <v-hover>
            <v-card class="mt-3 ml-1 mr-2 mx-auto" hover slot-scope="{ hover }">
              <v-img height="30vh" :src="post.imageUrl" :lazy-src="`https://picsum.photos/10/6?image=${index * 5 + 8}`" @click.native="goToPost(post._id)">
                <v-layout>
                  <div
                    v-if="hover"
                    class="d-flex black v-card--reveal display-1 white--text"
                    style="height: 100%;"
                  ></div>
                  <v-layout
                    v-if="hover"
                    align-center
                    justify-center
                    class="v-card--reveal opc-1"
                  >
                    <v-icon color="white" class="mr-1">mdi-heart</v-icon>
                    <span color="white" class="subheading mr-3 white--text">{{
                      post.likes
                    }}</span>
                    <v-icon color="white" class="mr-1">mdi-comment</v-icon>
                    <span class="subheading white--text">{{
                      post.messagesSize
                    }}</span>
                  </v-layout>
                </v-layout>
              </v-img>
              <!-- https://vuetifyjs.com/en/framework/transitions#slide-x-transitions -->
              <v-card-actions class="cardTextH">
                <v-card-text>{{ post.title }}</v-card-text>
                <v-flex v-if="isUserPosts" shrink >
                  <v-expand-x-transition>
                    <div v-show="hover" style="white-space: nowrap">
                      <v-btn @click="loadPost(post)" flat fab small>
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn @click="deleteUserPost(post)" color="" flat fab small>
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </v-expand-x-transition>
                </v-flex>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    <!-- </v-container> -->

    <!-- edit post dialog -->
    <v-dialog
      xs12
      persistent
      max-width="70%"
      min-width="600px"
      class="mx-auto"
      v-model="isEditDialog"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">更新帖子</v-card-title>
        <v-container>
          <v-layout>
            <!-- Image preview -->
            <v-flex xs7 pr-4 pb-5 my-auto v-if="imageUrl" hidden-sm-only hidden-xs-only ref="preview">
              <v-img :src="imageUrl" height="350px" class="d-block mx-auto" />
            </v-flex>
            <v-flex >
              <v-form
                xs7
                v-model="isFormValid"
                lazy-validation
                ref="form"
                @submit.prevent="updateUserPost"
              >
                <!-- title input -->
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      :rules="titleRules"
                      v-model="title"
                      prepend-icon="mdi-text"
                      label="照片标题"
                      type="text"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <!-- image url input -->
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      label="上传照片"
                      :value="imageUrl"
                      prepend-icon="mdi-cloud-upload-outline"
                      readOnly
                      disabled
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <template>
                  <v-combobox
                    v-model="tags"
                    :items="tagsSearchList"
                    label="标签"
                    tags
                    clearable
                    prepend-icon="mdi-tag-text-outline"
                    
                    multiple
                  >
                    <template v-slot:selection="data">
                      <v-chip
                        :selected="data.selected"
                        close
                        @input="remove(data.item)"
                      >
                        <strong>{{ data.item }}</strong
                        >&nbsp;
                        <!-- <span>(interest)</span> -->
                      </v-chip>
                    </template>
                  </v-combobox>
                </template>

                <!-- description input -->
                <v-layout row>
                  <v-flex xs12>
                    <v-textarea
                      
                      :rules="descRules"
                      v-model="description"
                      prepend-icon="mdi-card-text-outline"
                      label="描述"
                      type="text"
                      required
                    ></v-textarea>
                  </v-flex>
                </v-layout>

                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="!isFormValid" type="submit" color="green darken-1" flat>保存</v-btn>
                  <v-btn class="error--text" flat @click="isEditDialog = false"
                    >取消</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";
  export default {
    name: "Profile",
    data() {
      return {
        posts: [],
        isUserPosts: true,
        isEditDialog: false,
        isFormValid: true,
        title: "",
        imageName: "",
        imageUrl: "",
        imageFile: "",
        tags: [],
        tagsSearchList: [
          "art",
          "Education",
          "Travel",
          "Photography",
          "Technology"
        ],
        description: "",
        titleRules: [
          title => !!title || "标题不得为空",
          title => title.length < 20 || "标题至多20个字符"
        ],
        imageRules: [image => !!image || "照片不得为空"],
        tagsRules: [tags => !!tags.length >= 1 || "至少选择一个分类"],
        descRules: [
          desc => !!desc || "描述不得为空",
          desc => desc.length <= 150 || "描述至多150个字符"
        ]
      };
    },
    computed: {
      ...mapGetters(["user","userFavorites", "userPosts"])
    },
    created() {},
    watch: {
      userPosts(newVal, oldVal) {
        console.log("watch", newVal, oldVal);
        if (newVal) {
          // await userPosts getted
          this.changePostsByRoute(this.$route);
        }
      }
    },
    methods: {
      changePostsByRoute(to) {
        console.log('to',to, this.$route)
        // console.log("le", to, from, Date.now(), this.user);
        if (/\/profile\/?$/.test(to.fullPath)) {
          console.log("userpost", this.userPosts);
          this.isUserPosts = true;
          this.posts = this.userPosts;
        } else if (/\/profile\/likes\/?$/.test(to.fullPath)) {
          console.log('likes')
          this.isUserPosts = false;
          this.posts = this.userFavorites;
        }
        console.log(this.user)
        console.log(this.posts)
      },
      goToPost(postId) {
        this.$router.push(`/posts/${postId}`);
      },
      loadPost(
        { _id, title, imageUrl, tags, description },
        isEditDialog = true
      ) {
        this.isEditDialog = isEditDialog;
        this.postId = _id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.tags = tags;
        this.description = description;
      },
      remove(item) {
        this.tags.splice(this.tags.indexOf(item), 1);
        this.tags = [...this.tags];
      },
      updateUserPost() {
        // update user post action
        if(this.$refs.form.validate()) {
          this.$store.dispatch('updateUserPost', {
            postId: this.postId,
            userId: this.user._id,
            title: this.title,
            tags: this.tags,
            description: this.description
          })
          this.isEditDialog = false
        }
      },
      deleteUserPost(post) {
        this.loadPost(post, false) // get postId
        const isDeletePost = window.confirm('你确定要删除这个帖子？')
        if(isDeletePost) {
          this.$store.dispatch('deleteUserPost', {
            postId: this.postId
          })
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      this.changePostsByRoute(to);
      next();
    },
    // showMorePosts() {
    //     console.log("hello.........");
    //     // this.pageNum++;
    //     // fetch more data and transfrom original result
    //     this.$apollo.queries.infiniteScrollPosts.fetchMore({
    //       // 新的变量
    //       variables: {
    //         pageNum: this.infiniteScrollPosts.posts.length / pageSize + 1,
    //         pageSize
    //       },
    //       // 用新数据转换之前的结果
    //       updateQuery: (prevResult, { fetchMoreResult }) => {
    //         console.log(
    //           "previous result",
    //           prevResult.infiniteScrollPosts.posts
    //         );
    //         console.log(
    //           "fetch more result",
    //           fetchMoreResult.infiniteScrollPosts
    //         );
    //         const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
    //         const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
    //         // this.showMoreEnabled = hasMore;
    //         return {
    //           infiniteScrollPosts: {
    //             __typename: prevResult.infiniteScrollPosts.__typename, //PostsPage
    //             // merge previous posts with new posts
    //             posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
    //             hasMore
    //           }
    //         };
    //       }
    //     });
    //   },
  };
</script>
<style scoped>
  .v-card--reveal {
    /* align-items: center;
    bottom: 0;
    justify-content: center; */
    opacity: 0.3;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .opc-1 {
    opacity: 1 !important;
  }
  .cardTextH {
    height: 53px;
  }
  /* .block {
    display: block;
  } */
  /* .v-dialog__content {
    max-width: 80% !important;
  } */
</style>
