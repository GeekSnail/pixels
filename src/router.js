import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import Profile from "./components/Auth/Profile.vue";
import Signin from "./components/Auth/Signin.vue";
import Signup from "./components/Auth/Signup.vue";
import Posts from "./components/Posts/Index.vue";
import Post from "./components/Posts/Post.vue";
import Upload from "./components/Posts/Upload.vue";
import NotFound from "./components/NotFound";
import AuthGuard from "./AuthGuard";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/profile",
      // name: "profile",
      component: Profile,
      beforeEnter: AuthGuard,
      meta: {
        keepAlive: true // 需要被缓存
      },
      children: [
        {
          path: "",
          name: "userPosts",
          component: () =>
            import(/* webpackChunkName: "group-profile" */ "./components/Posts/userPosts.vue")
          // beforeEnter(to, from, next) {
          //   console.log("en", to, from, Date.now());
          //   next();
          // },
          // beforeUpdate(to, from, next) {
          //   console.log("up", to, from, Date.now(), this.user);
          //   next();
          // },
          // beforeLeave(to, from, next) {
          //   console.log("le", to, from, Date.now(), this.user);
          //   next();
          // }
        },
        {
          path: "likes",
          name: "likes",
          component: () =>
            import(/* webpackChunkName: "group-profile" */ "./components/Posts/userPosts.vue")
        }
      ]
    },
    {
      path: "/signin",
      name: "signin",
      component: Signin
      // beforeEnter: (to, from, next) => {
      //   console.log("signin", to.path, "...", from.path, Date.now());
      //   next();
      // }
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      path: "/explorer",
      name: "Posts",
      component: Posts
    },
    {
      path: "/posts/:postId",
      name: "Post",
      component: Post,
      props: true //https://router.vuejs.org/zh/guide/essentials/passing-props.html
    },
    {
      path: "/upload",
      name: "upload",
      component: Upload,
      beforeEnter: AuthGuard
    },

    // ,{
    //   path: "/el",
    //   name: "element",
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "element" */ "./components/element.vue")
    // }
    { path: "*", component: NotFound }
  ]
});

// const route = new VueRouter({
//   routes,
//   mode: "history"
// });

// route.beforeEach((to, from, next) => {
//   let shouldProceedToRoute = false;

//   const token = localStorage.getItem("token");
//   if (token) {
//     shouldProceedToRoute = true;
//   }
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (shouldProceedToRoute) {
//       next();
//     } else {
//       next({ name: "login" });
//     }
//   } else if (shouldProceedToRoute) {
//     next({ name: "all-recipes" });
//   } else {
//     next();
//   }
// });
// export default route;

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     if (!auth.loggedIn()) {
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath }//把要跳转的地址作为参数传到下一步
//       })
//     } else {
//       next()
//     }
//   } else {
//     next() // 确保一定要调用 next()
//   }
// })
