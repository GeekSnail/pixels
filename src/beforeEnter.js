import store from "./store";
import router from "./router";
const option = (path, to) => {
  return {
    path,
    query: { redirect: to.fullPath }
  };
};

export function authGuard(to, from, next) {
  // refresh or no user login
  if (!store.getters.user) {
    // no user token
    if (!localStorage.getItem("token")) {
      console.log("user not login");
      next(option("/signin", to));
    } // had token
    else {
      console.log("user had token");
      store.watch(
        state => state.user,
        () => {
          console.log(store.getters.user);
          if (!store.getters.user) {
            console.log("user token expired or invalid");
            next(option("/signin", to)); //把要跳转的地址作为参数传到下一步
          }
          next();
        }
      );
    }
  } else {
    next();
  }
}
export function auth(to, from, next) {
  // refresh or no user login
  if (!store.getters.user) {
    // no user token
    if (!localStorage.getItem("token")) {
      console.log("user not login");
      // router.replace(from.path);
      next();
    } // had token
    else {
      console.log("user had token");
      store.watch(
        state => state.user,
        () => {
          console.log(store.getters.user, to, from);
          if (!store.getters.user) {
            console.log("user token expired or invalid");
            next();
          } else {
            const redirect = to.query.redirect;
            if (redirect) {
              next(redirect);
            } else {
              next("/");
            }
          }
        }
      );
    }
  } else {
    next("/");
  }
}
export function afterAuth(to, from, next) {
  if (!store.getters.user) {
    // no user token
    if (!localStorage.getItem("token")) {
      console.log("no token");
      next();
    } // had token
    else {
      console.log("user had token");
      store.dispatch("getCurrentUser");
      next();
    }
  } else {
    next();
  }
}
function loadUser(to) {
  // visit isn't current user
  if (
    store.getters.user &&
    to.params.username !== store.getters.user.username
  ) {
    console.log("visit isn't current user");

    // had not _user, or had _user, but not last visited _user
    if (
      !store.getters._user ||
      (store.getters._user &&
        to.params.username !== store.getters._user.username)
    ) {
      console.log("not visited _user");
      store.dispatch("getUser", { username: to.params.username });
    }
  } else {
    // visit current user
    store.commit("set_user", store.getters.user);
  }
}
export function getUser(to, from, next) {
  // other page push, had current user
  if (store.getters.user) {
    console.log("had cur user");
    loadUser(to);
  } else {
    // refresh profile page
    store.watch(
      state => state.user,
      () => {
        loadUser(to);
        // store.commit("set_user", store.getters.user); //wait current User load
        // store.dispatch("getUser", {
        //   username: store.getters.user.username
        // });
        // console.log(store.getters.user);
        // if (to.params.username !== store.getters.user.username) {
        //   store.dispatch("getUser", { username: to.params.username });
        //   // console.log(store.getters._user);
        // }
      }
    );
  }
  next();
}
