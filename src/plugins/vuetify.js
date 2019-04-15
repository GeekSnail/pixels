import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/src/stylus/app.styl";
// import colors from 'vuetify/es5/util/colors'

//       {
//       primary: colors.blue-grey.base, //teal.lighten1
//       secondary: colors.cyan.base, //teal.lighten3
//       accent: colors.purple.base, //red.lighten3
//       error: colors.red.base, //red.accent
//       warning: colors.amber.base,
//       info: colors.blue.base, //blue.accent3
//       success: colors.green.base //green.darkness
//       }

Vue.use(Vuetify, {
  iconfont: "mdi", // 'md' || 'mdi' || 'fa' || 'fa4'
  theme: {
    primary: "#232a34", //teal.lighten1
    secondary: "#fafafa", //teal.lighten3
    accent: "#bf653f", //red.lighten1 #4a90e2
    error: "#ff5252", //red.lighten-1
    warning: "#A34513", //#fb8c00
    info: "#2196f3", //blue.accent3
    success: "#4caf50" //green.darkness
  }
});
