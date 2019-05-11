import Vue from "vue";
import store from "./store";
import Router from "vue-router";
const Home = () =>
  import(/* webpackChunkName: "home" */ "./components/Home.vue");
const Profile = () =>
  import(/* webpackChunkName: "profile" */ "./components/Posts/Profile.vue");
const Signin = () =>
  import(
    /* webpackChunkName: "group-signinOrup" */ "./components/Auth/Signin.vue"
  );
const Signup = () =>
  import(
    /* webpackChunkName: "group-signinOrup" */ "./components/Auth/Signup.vue"
  );
const Posts = () =>
  import(/* webpackChunkName: "Posts" */ "./components/Posts/Index.vue");
const Post = () =>
  import(/* webpackChunkName: "Post" */ "./components/Posts/Post.vue");
const userPosts = () =>
  import(
    /* webpackChunkName: "userPosts" */ "./components/Posts/userPosts.vue"
  );
const Upload = () =>
  import(/* webpackChunkName: "Upload" */ "./components/Posts/Upload.vue");
const NotFound = () =>
  import(/* webpackChunkName: "NotFound" */ "./components/NotFound");
import { authGuard, getUser } from "./beforeEnter";

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
      path: "/signin",
      name: "signin",
      component: Signin,
      beforeEnter: (to, from, next) => {
        console.log("signin", to.path, "...", from.path, Date.now());
        next();
      }
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      path: "/explorer",
      name: "Posts",
      component: () =>
        import(/* webpackChunkName: "Posts" */ "./components/Posts/Index.vue")
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
      beforeEnter: authGuard
    },
    {
      path: "/:username",
      props: true,
      component: Profile,
      beforeEnter: authGuard,
      meta: {
        keepAlive: true // 需要被缓存
      },
      beforeEnter: getUser,
      children: [
        {
          path: "",
          name: "userPosts",
          component: userPosts,
          meta: { Tab: "" }
        },
        {
          path: "likes",
          name: "likes",
          component: userPosts,
          meta: { Tab: "likes" }
        }
      ]
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
