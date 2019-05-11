(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["group-signinOrup"],{"26e5":function(t,e,r){},"4bd4":function(t,e,r){"use strict";r("26e5");var s=r("94ab");e["a"]={name:"v-form",mixins:[Object(s["b"])("form")],inheritAttrs:!1,props:{value:Boolean,lazyValidation:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(){var t=Object.values(this.errorBag).includes(!0);this.$emit("input",!t)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var e=this,r=function(t){return t.$watch("hasError",function(r){e.$set(e.errorBag,t._uid,r)},{immediate:!0})},s={_uid:t._uid,valid:void 0,shouldValidate:void 0};return this.lazyValidation?s.shouldValidate=t.$watch("shouldValidate",function(a){a&&(e.errorBag.hasOwnProperty(t._uid)||(s.valid=r(t)))}):s.valid=r(t),s},validate:function(){var t=this.inputs.filter(function(t){return!t.validate(!0)}).length;return!t},reset:function(){for(var t=this,e=this.inputs.length;e--;)this.inputs[e].reset();this.lazyValidation&&setTimeout(function(){t.errorBag={}},0)},resetValidation:function(){for(var t=this,e=this.inputs.length;e--;)this.inputs[e].resetValidation();this.lazyValidation&&setTimeout(function(){t.errorBag={}},0)},register:function(t){var e=this.watchInput(t);this.inputs.push(t),this.watchers.push(e)},unregister:function(t){var e=this.inputs.find(function(e){return e._uid===t._uid});if(e){var r=this.watchers.find(function(t){return t._uid===e._uid});r.valid&&r.valid(),r.shouldValidate&&r.shouldValidate(),this.watchers=this.watchers.filter(function(t){return t._uid!==e._uid}),this.inputs=this.inputs.filter(function(t){return t._uid!==e._uid}),this.$delete(this.errorBag,e._uid)}}},render:function(t){var e=this;return t("form",{staticClass:"v-form",attrs:Object.assign({novalidate:!0},this.$attrs),on:{submit:function(t){return e.$emit("submit",t)}}},this.$slots.default)}}},"56e8":function(t,e,r){"use strict";var s=r("f81e"),a=r.n(s);a.a},cdb6:function(t,e,r){"use strict";r.r(e);var s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",{attrs:{"text-xs-center":"","mt-3":""}},[this.error?r("v-layout",{attrs:{row:"",wrap:""}},[r("v-flex",{attrs:{xs12:"",sm6:"","offset-sm3":""}},[r("form-alert",{attrs:{message:t.error.message}})],1)],1):t._e(),r("v-layout",{attrs:{row:"",wrap:""}},[r("v-flex",{attrs:{xs12:"",sm8:"","offset-sm2":"",md6:"","offset-md3":"",lg4:"","offset-lg4":""}},[r("v-card",{attrs:{color:""}},[r("v-container",[r("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.signinUser(e)}},model:{value:t.isFormValid,callback:function(e){t.isFormValid=e},expression:"isFormValid"}},[r("v-layout",{attrs:{row:""}},[r("v-flex",{attrs:{xs12:""}},[r("v-text-field",{attrs:{rules:t.emailRules,"prepend-icon":"mdi-email",label:"邮箱",type:"email",required:""},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}})],1)],1),r("v-layout",{attrs:{row:""}},[r("v-flex",{attrs:{xs12:""}},[r("v-text-field",{attrs:{rules:t.passwordRules,"prepend-icon":"mdi-lock-outline",label:"密码","append-icon":t.showPassword?"mdi-eye-outline":"mdi-eye-off-outline",type:t.showPassword?"text":"password",autocomplete:"",required:""},on:{"click:append":function(e){t.showPassword=!t.showPassword}},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1)],1),r("v-layout",{attrs:{row:""}},[r("v-flex",{attrs:{xs12:""}},[r("v-btn",{attrs:{loading:t.loading,disabled:!t.isFormValid||t.loading,block:"",color:"info",type:"submit"},scopedSlots:t._u([{key:"loader",fn:function(){return[r("span",{staticClass:"custom-loader"},[r("v-icon",{attrs:{light:""}},[t._v("mdi-cached")])],1)]},proxy:!0}])},[t._v("\n                  登 录")]),r("h3",[t._v("\n                  还没有账户？\n                  "),r("router-link",{attrs:{to:{path:"/signup",query:t.redirect?{redirect:t.redirect}:null}}},[t._v("注 册")])],1)],1)],1)],1)],1)],1)],1)],1)],1)},a=[],i=(r("a481"),r("cebc")),n=r("2f62"),o={name:"Signin",data:function(){return{isFormValid:!0,email:"",password:"",showPassword:!1,emailRules:[function(t){return!!t||"邮箱不能为空"},function(t){return/.@.+\./.test(t)||"邮箱地址格式无效"}],passwordRules:[function(t){return!!t||"密码不能为空"},function(t){return t.length>=4||"密码至少4位"}],redirect:this.$route.query.redirect||""}},created:function(){this.transfer(this.user)},computed:Object(i["a"])({},Object(n["b"])(["loading","error","user"])),watch:{user:function(t,e){this.transfer(t)}},methods:{signinUser:function(){this.$refs.form.validate()&&this.$store.dispatch("signinUser",{email:this.email,password:this.password})},transfer:function(t){if(t){var e=this.$route.query.redirect;e?this.$router.replace(e):this.$router.replace("/")}}}},u=o,l=(r("56e8"),r("2877")),d=r("6544"),c=r.n(d),f=r("8336"),m=r("b0af"),h=r("a523"),p=r("0e8f"),v=r("4bd4"),w=r("132d"),x=r("a722"),b=r("2677"),g=Object(l["a"])(u,s,a,!1,null,null,null);e["default"]=g.exports;c()(g,{VBtn:f["a"],VCard:m["a"],VContainer:h["a"],VFlex:p["a"],VForm:v["a"],VIcon:w["a"],VLayout:x["a"],VTextField:b["a"]})},ebff:function(t,e,r){"use strict";r.r(e);var s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",{attrs:{"text-xs-center":"","mt-3":""}},[this.error?r("v-layout",{attrs:{row:"",wrap:""}},[r("v-flex",{attrs:{xs12:"",sm6:"","offset-sm3":""}},[r("form-alert",{attrs:{message:t.error.message}})],1)],1):t._e(),r("v-layout",{attrs:{row:"",wrap:""}},[r("v-flex",{attrs:{sm8:"","offset-sm2":"",md6:"","offset-md3":"",lg4:"","offset-lg4":""}},[r("v-card",{attrs:{color:""}},[r("v-container",[r("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.signupUser(e)}},model:{value:t.isFormValid,callback:function(e){t.isFormValid=e},expression:"isFormValid"}},[r("v-layout",{attrs:{row:""}},[r("v-flex",{attrs:{xs12:""}},[r("v-text-field",{attrs:{rules:t.usernameRules,"prepend-icon":"mdi-account",label:"用户名",type:"text",required:""},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}})],1)],1),r("v-layout",{attrs:{row:""}},[r("v-flex",{attrs:{xs12:""}},[r("v-text-field",{attrs:{rules:t.emailRules,"prepend-icon":"mdi-email",label:"邮箱",type:"email",required:""},model:{value:t.email,callback:function(e){t.email=e},expression:"email"}})],1)],1),r("v-layout",{attrs:{row:""}},[r("v-flex",{attrs:{xs12:""}},[r("v-text-field",{attrs:{rules:t.passwordRules,"prepend-icon":"mdi-lock-outline",label:"密码","append-icon":t.showPassword?"mdi-eye-outline":"mdi-eye-off-outline",type:t.showPassword?"text":"password",required:""},on:{"click:append":function(e){t.showPassword=!t.showPassword}},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1)],1),r("v-layout",{attrs:{row:""}},[r("v-flex",{attrs:{xs12:""}},[r("v-btn",{attrs:{loading:t.loading,disabled:!t.isFormValid||t.loading,block:"",color:"info",type:"submit"},scopedSlots:t._u([{key:"loader",fn:function(){return[r("span",{staticClass:"custom-loader"},[r("v-icon",{attrs:{light:""}},[t._v("mdi-cached")])],1)]},proxy:!0}])},[t._v("\n                  加 入\n                ")]),r("h3",[t._v("\n                  已经有账户？\n                  "),r("router-link",{attrs:{to:"/signin"}},[t._v("登 录")])],1)],1)],1)],1)],1)],1)],1)],1)],1)},a=[],i=(r("a481"),r("cebc")),n=r("2f62"),o={name:"Signup",data:function(){return{isFormValid:!0,username:"",email:"",password:"",showPassword:!1,usernameRules:[function(t){return!!t||"用户名不能为空"},function(t){return t.length>=2||"用户名至少2个字符"},function(t){return t.length<=12||"用户名不得超过12个字符"}],emailRules:[function(t){return!!t||"邮箱地址不能为空"},function(t){return/.@.+\./.test(t)||"邮箱地址格式无效"}],passwordRules:[function(t){return!!t||"密码不能为空"},function(t){return t.length>=4||"密码至少4位"}]}},computed:Object(i["a"])({},Object(n["b"])(["loading","error","user"])),created:function(){this.transfer(this.user)},watch:{user:function(t,e){t&&this.transfer(t)}},methods:{signupUser:function(){this.$refs.form.validate()&&this.$store.dispatch("signupUser",{username:this.username,email:this.email,password:this.password})},transfer:function(t){if(t){var e=this.$route.query.redirect;e?this.$router.replace(e):this.$router.replace("/")}}}},u=o,l=r("2877"),d=r("6544"),c=r.n(d),f=r("8336"),m=r("b0af"),h=r("a523"),p=r("0e8f"),v=r("4bd4"),w=r("132d"),x=r("a722"),b=r("2677"),g=Object(l["a"])(u,s,a,!1,null,null,null);e["default"]=g.exports;c()(g,{VBtn:f["a"],VCard:m["a"],VContainer:h["a"],VFlex:p["a"],VForm:v["a"],VIcon:w["a"],VLayout:x["a"],VTextField:b["a"]})},f81e:function(t,e,r){}}]);