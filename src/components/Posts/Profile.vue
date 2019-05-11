<template>
  <v-container class="text-xs-center">
    <!-- user detail card -->
    <v-flex sm6 offset-sm3>
      <!-- <v-card class="" color="secondary"> -->
      <v-layout v-if="_user">
        <v-flex xs1></v-flex>
        <v-flex xs4>
          <v-img
            max-width="135px"
            class="mx-auto round"
            contain
            fab
            lazy-src="https://picsum.photos/10/6?image=10"
            :src="this._user?this._user.avatar:'https://picsum.photos/10/6?image=10'"
          ></v-img>
        </v-flex>
        <v-flex xs7 offset-xs1>
          <v-card-title primary-title>
            <div>
              <div class="headline">
                {{ !!_user && _user.username }}
              </div>
              <div class=" mt-3 font-weight-regular">
                <span v-if="_user.posts" class="mr-2"
                  >{{ !!_user && _user.postsSize }}
                  帖子
                </span>
                {{ !!_user && _user.favoritesSize }} 喜欢
              </div>
              <div>
                <span class="ml-2"
                  >{{ formatCreatedDate(!!_user && _user.created) }} 加入.</span
                >
              </div>
            </div>
          </v-card-title>
        </v-flex>
      </v-layout>
      <!-- </v-card> -->
    </v-flex>

    <v-spacer></v-spacer>
    <v-tabs
      centered
      icons-and-text
      class="mt-4"
      color="transparent"
      v-model="activeTab"
      slider-color="transparent"
    >
      <!-- <v-tabs-slider></v-tabs-slider> -->
      <v-tab v-for="(tab,index) of tabs" :key="index" :to="tab.route" exact>
        {{`${tab.name}(${index?!!_user&&_user.favoritesSize:!!_user && _user.postsSize})`}}
        <v-icon>{{ tab.icon }}</v-icon>
      </v-tab>
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab-item :value="activeTab">
        <router-view :meta="$route.meta"></router-view>
      </v-tab-item>
    </v-tabs>

    <!-- posts favorited by user -->
    <!-- <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no favorites currently. Go and add some</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Favorited
          <span class="font-weight-regular">{{ userFavorites.length }}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img height="30vh" :src="favorite.imageUrl"></v-img>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container> -->

    <!-- posts created by user -->
    <!-- <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no posts currently. Go and add some</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          posts
          <span class="font-weight-regular">{{ userPosts.length }}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm4 v-for="post in userPosts" :key="post._id">
          <v-hover>
            <v-card class="mt-3 ml-1 mr-2 mx-auto" hover slot-scope="{ hover }">
              <v-img height="30vh" :src="post.imageUrl">
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
                      post.commentsSize
                    }}</span>
                  </v-layout>
                </v-layout>
              </v-img>
              <v-card-text>{{ post.title }}</v-card-text>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container> -->
  </v-container>
</template>

<script>
  import moment from "moment";
  import { mapGetters, mapMutations } from "vuex";
  // import { GET_USER } from "../queries";
  export default {
    name: "Profile",
    props: ["username"],
    data() {
      return {
        activeTab: ""
      };
    },
    // apollo: {
    //   getUser: {
    //     query: GET_USER,
    //     variables: { username }
    //   }
    // },
    computed: {
      ...mapGetters(["user", "_user"]),
      tabs() {
        return [
          {
            name: "帖子",
            icon: "mdi-grid",
            route: { path: "/" + this.username }
            // route: { name: "userPosts" }
          },
          {
            name: "喜欢",
            icon: "mdi-bookmark-outline",
            route: { path: "/" + this.username + "/likes" }
            // route: { name: "likes" }
          }
        ];
      }
    },
    created() {
      this.changeUserByRoute(this.$route);
      console.log(
        "profile cr",
        !!this._user && this._user.posts,
        !!this._user && this._user.username
      );
    },
    mounted() {
      this.$store.watch(
        (state, getters) => getters._user,
        (newVal, oldVal) => {
          console.log(newVal, oldVal);
        }
      );
    },
    beforeRouteUpdate(to, from, next) {
      // this.activeTab = to.path;
      console.log("beforeUpdate", this.activeTab);
      this.changeUserByRoute(to);
      next();
    },
    // beforeRouteLeave(to, from, next) {
    //   console.log("beforeLeave", to, from, this._user);
    //   next();
    // },
    watch: {
      user(newVal, oldVal) {
        console.log("user", newVal, oldVal);
      },
      // userPosts(newVal, oldVal) {
      //   console.log("userPosts", newVal, oldVal);
      //   if (newVal) {
      //     this._user.posts = this.userPosts;
      //   }
      // },
      _user(newVal, oldVal) {
        console.log("_user", newVal, oldVal, this._user); //outer view hooked watch varibles first
      }
    },
    methods: {
      ...mapMutations(["set_user"]),
      changeUserByRoute(to) {
        // had current user and to
        if (this.user && to.params.username === this.user.username) {
          console.log("cur user", this.user);
          if (!this._user || this._user.username !== this.user.username) {
            console.log("_user has not set", this._user);
            this.set_user(this.user);
          }
          if (to.path.lastIndexOf("/likes") <= 0) {
            if (!this._user.posts && this._user.postsSize) {
              // getUserPosts();
              this.getUser(to.params.username);
            } else {
              this._user.posts = [];
            }
          } else {
            if (
              (this._user.favorites &&
                this._user.favorites[0].hasOwnProperty("description")) ||
              this._user.favoritesSize === 0
            ) {
              console.log(this._user.favorites);
              // this.posts = this._user.favorites || [];
            } else {
              console.log("user fav", this.user.favorites);
              this.getUser(to.params.username, false, true);
            }
          }
        } else {
          console.log(this.username, "to", to.params.username);
          if (!this._user || this._user.username !== to.params.username) {
            this.getUser(to.params.username);
          }
        }
        console.log(
          !!this._user && this._user.posts,
          !!this._user && this._user.username
        );
      },
      getUser(username, withPosts = true, withFavorites = false) {
        console.log("getUser", withPosts, withFavorites);
        this.$store.dispatch("getUser", {
          username,
          withPosts,
          withFavorites
        });
      },
      formatCreatedDate(date) {
        // return moment(new Date(Number(date))).format("YYYY-MM-DD");
        return moment(date).format("YYYY-MM-DD");
      }
    }
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
  @media only screen and (max-width: 600px) {
    >>> .v-responsive.v-image.round {
      margin-top: 8px;
    }
  }
</style>
