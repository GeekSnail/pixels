<template>
  <!-- <v-container text-xs-center v-if="infiniteScrollPosts">
    <div v-for="post in infiniteScrollPosts.posts" :key="post._id">
      <img :src="post.imageUrl" height="100px" />
      <h3>{{ post.title }}</h3>
    </div>
    <v-btn @click="showMorePosts" v-if="showMoreEnabled">加载更多...</v-btn>
  </v-container> -->
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-container fluid grid-list-xl>
        <v-layout row wrap v-if="infiniteScrollPosts">
          <v-flex
            xs12
            sm6
            md4
            v-for="(post,index) in infiniteScrollPosts.posts"
            :key="post._id"
            ><!-- white background and hover shadow -->
            <v-card hover>
              <v-img
                @click.native="goToPost(post._id)"
                :src="post.imageUrl"
                :lazy-src="`https://picsum.photos/10/6?image=${index * 5 + 10}`"
                height="30vh"
                lazy
              ></v-img>
              <v-card-actions>
                <v-card-title primary class="py-2">
                  <div>
                    <h2 class="font-weight-regular overflow-hidden">
                      {{ post.title }}
                    </h2>
                    <span class="grey--text"
                      >{{ post.likes }} likes -
                      {{ post.messages.length }} comments</span
                    >
                  </div>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn @click="showPostCreator = !showPostCreator" icon>
                  <v-icon
                    >{{`mdi-chevron-${showPostCreator ? 'up': 'down'}`}}</v-icon
                  >
                </v-btn>
              </v-card-actions>
              <!-- post creator tile -->
              <v-slide-y-transition>
                <v-card-text v-show="showPostCreator" class="grey lighten-4">
                  <v-list-tile avatar>
                    <v-list-tile-avatar>
                      <img :src="post.createdBy.avatar" />
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title class="text--primary">{{
                        post.createdBy.username
                      }}</v-list-tile-title>
                      <v-list-tile-sub-title class="font-weight-thin"
                        >Added
                        {{
                          formatCreatedDate(post.created)
                        }}</v-list-tile-sub-title
                      >
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-btn icon ripple>
                        <v-icon color="grey lighten-1"
                          >mdi-information-outline</v-icon
                        >
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-card-text>
              </v-slide-y-transition>
            </v-card>
          </v-flex>
        </v-layout>
        <!-- fetch more button -->
        <!-- <v-layout v-if="showMoreEnabled" column>
          <v-flex xs12>
            <v-layout justify-center row>
              <v-btn color="info" @click="showMorePosts">加载更多...</v-btn>
            </v-layout>
          </v-flex>
        </v-layout> -->
        <v-layout class="my-3">
          <v-container>
            <v-layout row justify-center align-center>
              <v-progress-circular
                v-if="$apollo.loading"
                indeterminate
                :size="50"
                :with="10"
                color="primary"
              ></v-progress-circular>
            </v-layout>
            <v-layout v-if="!showMoreEnabled" justify-center>
              <div>没有更多了...</div>
            </v-layout>
          </v-container>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  // https://vue-apollo.netlify.com/zh-cn/guide/apollo/pagination.html
  import moment from "moment";
  import { INFINITE_SCROLL_POSTS } from "../../queries";
  const pageSize = 6;
  export default {
    name: "Posts",
    data() {
      return {
        // showMoreEnabled: true,
        showPostCreator: false
      };
    },
    apollo: {
      infiniteScrollPosts: {
        query: INFINITE_SCROLL_POSTS,
        // 初始变量
        variables: {
          pageNum: 1,
          pageSize
        }
      }
    },
    computed: {
      showMoreEnabled() {
        return this.infiniteScrollPosts && this.infiniteScrollPosts.hasMore;
      }
    },
    mounted() {
      window.onscroll = this.waitScrollToBottom;
    },

    methods: {
      formatCreatedDate(date) {
        return moment(new Date(Number(date))).format("YYYY-MM-DD hh:mm");
      },
      goToPost(postId) {
        this.$router.push(`/posts/${postId}`);
      },
      showMorePosts() {
        console.log("hello........."); //可能会同时进入两次
        // this.pageNum++;
        // fetch more data and transfrom original result
        this.$apollo.queries.infiniteScrollPosts.fetchMore({
          // 新的变量
          variables: {
            pageNum: this.infiniteScrollPosts.posts.length / pageSize + 1,
            pageSize
          },
          // 用新数据转换之前的结果
          updateQuery: (prevResult, { fetchMoreResult }) => {
            console.log(
              "previous result",
              prevResult.infiniteScrollPosts.posts
            );
            console.log(
              "fetch more result",
              fetchMoreResult.infiniteScrollPosts
            );
            const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
            const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
            // this.showMoreEnabled = hasMore;
            window.onscroll = this.waitScrollToBottom; //异步获取完数据后再恢复滚动监听
            return {
              infiniteScrollPosts: {
                __typename: prevResult.infiniteScrollPosts.__typename, //PostsPage
                // merge previous posts with new posts
                posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
                hasMore
              }
            };
          }
        });
      },
      waitScrollToBottom() {
        let isToBottom =
          document.documentElement.scrollTop + window.innerHeight + 0.5 >=
          document.documentElement.offsetHeight;
        if (isToBottom) {
          console.log("hi.........");
          window.onscroll = null;
          if (this.showMoreEnabled) {
            this.showMorePosts();
          }
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      window.onscroll = null;
      next();
    }
  };
</script>
<!-- 
data: {infiniteScrollPosts: {hasMore: true,…}}
  infiniteScrollPosts: {hasMore: true,…}
  hasMore: true
  posts: [{_id: "5ca7ac3ed2c297f99cc8c0eb", title: "sea",…}, {_id: "5ca7a796e16591dc6cdd89ee", title: "jump",…}]
    0: {_id: "5ca7ac3ed2c297f99cc8c0eb", title: "sea",…}
    1: {_id: "5ca7a796e16591dc6cdd89ee", title: "jump",…}
  __typename: "PostsPage" 
-->
