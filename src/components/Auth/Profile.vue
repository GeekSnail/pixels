<template>
  <v-container class="text-xs-center">
    <!-- user detail card -->
    <v-flex sm6 offset-sm3>
      <!-- <v-card class="" color="secondary"> -->
      <v-layout>
        <v-flex xs4>
          <v-img
            width="135px"
            class="mx-auto round"
            contain
            fab
            :src="user.avatar"
          ></v-img>
        </v-flex>
        <v-flex xs7 offset-xs1>
          <v-card-title primary-title>
            <div>
              <div class="headline">{{ user.username }}</div>
              <div class=" mt-3 font-weight-regular">
                <span class="mr-2">{{ userPosts.length }} 帖子 </span>

                {{ userFavorites.length }} 喜欢
                <span class="ml-2"
                  >{{ formatCreatedDate(user.created) }} 加入.</span
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
      class="mt-5"
      color="transparent"
      v-model="activeTab"
    >
      <v-tab v-for="(tab,index) of tabs" :key="index" :to="tab.route" exact>
        {{`${tab.name}(${index?userFavorites.length:userPosts.length})`}}
        <v-icon>{{ tab.icon }}</v-icon>
      </v-tab>
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab-item :value="activeTab">
        <router-view></router-view>
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
                      post.messagesSize
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
  import { mapGetters } from "vuex";
  export default {
    name: "Profile",
    data() {
      return {
        activeTab: "",
        tabs: [
          {
            name: "帖子",
            icon: "mdi-grid",
            route: { name: "userPosts" }
          },
          {
            name: "喜欢",
            icon: "mdi-bookmark-outline",
            route: { name: "likes" }
          }
        ]
      };
    },
    computed: {
      ...mapGetters(["user", "userFavorites", "userPosts"])
    },
    created() {
      this.getUserPosts();
      console.log("pro cr");
    },
    methods: {
      formatCreatedDate(date) {
        return moment(new Date(Number(date))).format("YYYY-MM-DD");
      },
      getUserPosts() {
        this.$store.dispatch("getUserPosts", {
          userId: this.user._id
        });
      }
    }
  };
</script>
<style>
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
</style>
