import store from "./store";

export default (to, from, next) => {
  // console.log(to, "...", from, Date.now());
  if (!store.getters.user) {
    next({
      path: "/signin",
      query: { redirect: to.fullPath } //把要跳转的地址作为参数传到下一步
    });
  } else {
    next();
  }
};
