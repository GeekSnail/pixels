<template>
  <v-container text-xs-center style="max-height:400px">
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular
              indeterminate
              :size="70"
              :with="17"
              color="primary"
            ></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- <div v-if="$apollo.loading">Loading...</div> -->
    <v-flex xs12>
      <v-carousel
        v-if="!loading && getPosts"
        v-bind="{'cycle': true}"
        interval="3000"
        height="50%"
      >
        <v-carousel-item
          height="400px"
          v-for="(post,index) in getPosts"
          :key="post._id"
          :src="post.imageUrl"
          :lazy-src="`https://picsum.photos/10/6?image=${index * 5 + 8}`"
          class="hauto"
          @click.native="goToPost(post._id)"
        >
          <h1 class="hidden-xs-only hidden-sm-only carousel__title">
            {{ post.title }}
          </h1>
        </v-carousel-item>
      </v-carousel>

      <br />
      <v-layout column>
        <p>
          [subscription example] 请再打开一个标签，为同域名下 /graphql 回车
        </p>
        <p>输入以下mutation, 点击中间的play按钮，再来看这变化！</p>
        <code>
          mutation { addMsg(id:3,content:"three") { id content } }
        </code>
        <div v-for="(msg,index) in msgs">{{ msg }}</div>
        <br />
      </v-layout>
    </v-flex>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";
  import {
    POST_CREATED,
    GET_POSTS,
    MSGS,
    MSG_CREATED,
    ADD_MSG
  } from "../queries";
  export default {
    name: "home",
    data() {
      return {
        msgs: [],
        //posts: [],
        postsSub: null
      };
    },
    components: {},
    apollo: {
      msgs: MSGS,
      getPosts: GET_POSTS
    },
    mounted() {},
    created() {
      // this.$apollo
      //   .query({
      //     query: POST
      //   })
      //   .then(({ data }) => {
      //     console.log(data);
      //   })
      //   .catch(err => console.error(err));

      //this.$store.dispatch("getPosts");
      this.$apollo.queries.msgs.subscribeToMore({
        // GraphQL 文档
        document: MSG_CREATED,

        // 变更之前的结果
        updateQuery: (prevResult, { subscriptionData }) => {
          // 在这里用之前的结果和新数据组合成新的结果
          console.log(prevResult, subscriptionData);
          if (!subscriptionData.data) return prevResult;

          return {
            msgs: [...prevResult.msgs, subscriptionData.data.msgCreated]
          };
        }
      });
      // 我们需要在重新订阅之前取消订阅
      if (this.postsSub) {
        this.postsSub.unsubscribe();
      }
      // 在查询上订阅
      this.postsSub = this.$apollo.queries.getPosts.subscribeToMore({
        document: POST_CREATED,
        // 变更之前的结果
        updateQuery: (prevResult, { subscriptionData }) => {
          // 如果我们在没有做操作的情况下已经添加了标签
          // 这可能是由 addTag 变更上的 `updateQuery` 导致
          console.log("subscription posts", prevResult, subscriptionData);
          if (
            prevResult.getPosts.find(
              post => post._id === subscriptionData.data.postCreated._id
            )
          ) {
            return prevResult;
          }
          return {
            getPosts: [
              // 添加新的标签
              subscriptionData.data.postCreated,
              ...prevResult.getPosts
            ]
          };
        }
      });
      const observer = this.$apollo.subscribe({
        query: MSG_CREATED
      });
      observer.subscribe({
        next(data) {
          console.log("observer", data);
        },
        error(error) {
          console.error(error);
        }
      });
    },
    computed: {
      // posts() {
      //   return this.$store.getters.posts;
      // }
      ...mapGetters(["loading"])
    },
    methods: {
      goToPost(postId) {
        this.$router.push(`/posts/${postId}`);
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .v-progress-linear
    margin 0
  >>>.v-carousel__controls
    background none
  >>>.v-responsive.v-image.v-carousel__item
    height 50% !important
  >>>.v-responsive__sizer
    padding-bottom: 50% !important
  .carousel__title
    position absolute
    cursor pointer
    //background-color rgba(0,0,0,0.5)
    color white
    border-radius 5px 5px 0 0
    padding-top 0.5em
    padding-bottom 0.1em
    bottom 50px
    left 0
    right 0
    text-align center
  @media only screen and (max-width: 599px)
    >>>.v-carousel__controls
      display: none !important;
</style>
