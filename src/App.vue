<template>
  <v-app color="secondary" @click.native="globalClicked=true;">
    <!-- side navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <!-- <v-toolbar color="accent" dark flat>
      </v-toolbar> -->
      
      <v-img :aspect-ratio="16/9" :src="require('./assets/parallax-material.jpg')">
        <v-layout pa-2 column fill-height class="lightbox ">
          <!-- <v-toolbar color="transparent" flat> -->
            <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
            <!-- <router-link to="/" tag="span" style="cursor: pointer">
              <h1 class="headline pl-3">Pixels</h1>
            </router-link>       -->
          <!-- </v-toolbar> -->
          <v-layout column v-if="user" shrink class="ml-3">
            <div class="subheading white--text">{{user.username}}</div>
            <div class="body-1 mt-1 white--text">{{user.email}}</div>
          </v-layout>
        </v-layout>
      </v-img>

      <v-divider></v-divider>

      <v-list class="pl-2">
        <v-list-tile ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{item.title}}</v-list-tile-content>
        </v-list-tile>

        <v-list-tile  v-if="user" :to="`/${user.username}`">
          <v-list-tile-action>
            <v-img
              :src="user.avatar"
              aspect-ratio="1"
              class="grey lighten-2 mr-32 round"></v-img>
          </v-list-tile-action>
          <v-list-tile-content>我的</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="user" @click="signoutUser">
          <v-list-tile-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>注销</v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <!-- navbar -->
    <v-toolbar app fixed color="primary">
      <v-toolbar-side-icon @click="toggleSideNav" ></v-toolbar-side-icon>
      <!-- titile -->
      <v-toolbar-title :class="{'headline':true, 'hidden-xs-only':hiddenTitle}">
        <router-link to="/" tag="span" style="cursor: pointer" class="white--text">
          Pixels
        </router-link>
        <!-- <span class="font-weight-light">MATERIAL DESIGN</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-text-field v-model="searchTerm" @input="searchPosts" :solo="true" flex append-icon="mdi-magnify" placeholder="搜索图片"  single-line hide-details height="30px" class="searchField" @focus="hiddenTitle=true;globalClicked=false" @blur="hiddenTitle=false" @click.stop="globalClicked=false" ></v-text-field>
      <v-spacer class="hidden-xs-only"></v-spacer>
      <!-- search results card -->
      <v-card color="#fafafa" v-if="this.searchResults && this.searchResults.length && !globalClicked" id="search__card">
        <v-list>
          <v-list-tile v-for="result in searchResults" :key="result._id" @click="goToSearchResult(result._id)">
            <v-list-tile-title>{{result.title}} - 
              <span class="font-weight-thin">{{formatSlice(result.description)}}</span>
            </v-list-tile-title>
            <!-- show icon if result favorited by user -->
            <v-list-tile-action v-if="isUserFavorite(result._id)">
              <v-icon >mdi-heart</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <!-- <v-btn flat>
        <span class="mr-2">Latest Release</span>
      </v-btn> -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon v-if="item.hasOwnProperty('icon')" class="hidden-sm-only mr-2" left>{{item.icon}}</v-icon>
            {{item.title}}
        </v-btn>  
        <v-btn flat v-push:to="`/${user.username}`" v-if="user">
            <v-img
              :src="user.avatar"
              aspect-ratio="1"
              class="grey lighten-2 mr-2 wh-24 round"></v-img>
            <v-badge right color="deep-orange lighten-3" :class="{'bounce':badgeAnimated}">
              <span slot="badge" v-if="user.favorites && user.favorites.length">{{user.favorites.length}}</span>
              我的
            </v-badge>
          </v-btn>  
      </v-toolbar-items>
      <v-toolbar-items v-if="user" @click="signoutUser"  class="hidden-xs-only">
        <v-btn flat>
          <v-icon class="hidden-sm-only mr-2" left>mdi-logout</v-icon>注销
        </v-btn>
      </v-toolbar-items>
      
    </v-toolbar>
    
    <!-- main -->
    <v-content >
      <transition name="fade">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view /><!-- 这里是会被缓存的视图组件！ -->
        </keep-alive>
        <router-view v-else/><!-- 这里是不被缓存的视图组件！ -->
      </transition>

      <!-- Auth Snackbar -->
      <v-snackbar v-model="authSnackbar" color="success" bottom right :timeout="5000" >
        <v-icon class="mr-3">mdi-check-circle</v-icon>
        <h3>Welcome back !</h3>
        <v-btn dark flat @click="authSnackbar = false">
            <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-snackbar>
      <!-- Auth Error Snackbar -->
      <v-snackbar v-if="this.authError" v-model="authErrorSnackbar" color="info" bottom right :timeout="5000" >
          <v-icon class="mr-3">mdi-cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark flat to="/signin">
              <v-icon>mdi-signin</v-icon>登录
          </v-btn>
        </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'  
export default {
  name: 'App',
  data () {
    return {
      hiddenTitle: false,
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false,
      searchTerm: '',
      globalClicked: 'false',
    }
  },
  watch: {
    user(newValue, oldValue) {
      // if had no value for user before, show snackbar
      if (oldValue === null) {
        this.authSnackbar = true
      }
    },
    authError(value) {
      // if auth error is not null, show auth error snackbar
      if (value !==null) {
        this.authErrorSnackbar = true
      }
    },
    user(value) {
      // if user favorites value changed at all
      if (value) {
        this.badgeAnimated = true
        setTimeout(() => (this.badgeAnimated = false), 1000)
      }
    }
  },
  computed: {
    ...mapGetters(["searchResults", "authError", "user"]),
    horizontalNavItems() {
      let items = [
        { icon: 'mdi-compass-outline', title: '探索', link: '/explorer' },
        { icon: 'mdi-login', title: '登录', link: '/signin' },
        { icon: 'mdi-account-plus-outline', title: '加入', link: '/signup' },
      ]
      console.log('[thisuser]',this.user,Date.now())
      if (this.user) {
        items = [
          { icon: 'mdi-compass-outline', title: '探索', link: '/explorer' },
          { icon: 'mdi-cloud-upload-outline', title: '上传', link: '/upload' },
        ]
      }
      return items
    },
    sideNavItems() {
      let items = [
        { icon: 'mdi-compass-outline', title: '探索', link: '/explorer' },
        { icon: 'mdi-login', title: '登录', link: '/signin' },
        { icon: 'mdi-account-plus-outline', title: '加入', link: '/signup' },
      ]
      if (this.user) {
        items = [
          { icon: 'mdi-compass-outline', title: '探索', link: '/explorer' },
          { icon: 'mdi-cloud-upload-outline', title: '上传', link: '/upload' },
          
        ]
      }
      return items
    }
  },
  methods: {
    test() {
      console.log('hi')
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav
    },
    signoutUser() {
      this.$store.dispatch('signoutUser')
    },
    searchPosts() {
      this.$store.dispatch('searchPosts', {
        searchTerm: this.searchTerm
      })
    },
    goToSearchResult(resultId) {
      // clear search term
      this.searchTerm = ''
      // go to desired result
      this.$router.push(`/posts/${resultId}`)
      // clear search results
      this.$store.commit('clearSearchResults')
    },
    formatSlice(desc) {
      return desc.length > 30 ? `${desc.slice(0,30)}...` : desc
    },
    isUserFavorite(resultId) {
      return (this.user.favorites && this.user.favorites.some(fave => fave._id === resultId))
    }
  }
}
</script>
<style scoped lang="stylus">
/* .font-white*/
.theme--light.v-btn {
  color: #ffffff !important
} 
/* .v-input__control {
  min-height: 40px !important
} */
@media only screen and (max-width: 959px) and (min-width: 600px) {

}
/* .v-text-field.v-text-field--solo.v-input__control {
  height: 30px !important
} */
.v-navigation-drawer {
  width: 220px !important
}
.fade
  &-enter-active, &-leave-active
    transition-property opacity
    transition-duration 0.25s
  &-enter-active
    transition-delay 0.25s  
  &-enter, &-leave-active
    opacity 0 
/*            
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s
}
.fade-enter-active {
  transition-delay: 0.25s
}
.fade-enter,
.fade-leave-active 
  opacity 0 */
  /* transform translateX(-25px) */
  /* transform translateY(-25px) */
>>>.searchField.v-text-field.v-text-field--solo .v-input__control
  min-height 44px
@media only screen and (max-width: 599px) 
  >>>.v-toolbar__title.headline
    width 100%
    margin auto
    display flex
    & span
      margin auto
  .spacer 
    //flex-grow: 100 !important;
  >>>.searchField    
    & .v-input__control .v-input__slot
      width 52px
      color white
      background-color transparent
    & .theme--light.v-icon 
      color white  
    &.v-input--is-focused 
      width 85%
    &.v-input--is-focused .v-input__control .v-input__slot
      width auto
      background-color white

/* search results card */
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%
}
/* user favorites Animation */
.bounce {
  animation: bounce 1s both
}
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0)
  }
  40%, 43% {
    transform: translate3d(0,-20px,0)
  }
  70% {
    transform: translate3d(0,-10px,0)
  }
  90% {
    transform: translate3d(0,-4px,0)
  }
}
</style>
