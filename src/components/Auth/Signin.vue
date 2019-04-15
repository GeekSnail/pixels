<template>
  <v-container text-xs-center mt-3>
    <!-- Signin title -->
    <!-- <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome back !</h1>
      </v-flex>
    </v-layout> -->

    <!-- Error Alert -->
    <v-layout v-if="this.error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Signin from -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="">
          <v-container>
            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="signinUser"
            >
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="emailRules"
                    v-model="email"
                    prepend-icon="mdi-email"
                    label="邮箱"
                    type="email"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="password"
                    prepend-icon="mdi-lock-outline"
                    label="密码"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn
                    :loading="loading"
                    :disabled="!isFormValid || loading"
                    block
                    color="info"
                    type="submit"
                  >
                    <template v-slot:loader>
                      <span class="custom-loader">
                        <v-icon light>mdi-cached</v-icon>
                      </span>
                    </template>
                    登 录</v-btn
                  >
                  <h3>
                    还没有账户？
                    <router-link to="/signup">注 册</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from "vuex";
  export default {
    name: "Signin",
    data() {
      return {
        isFormValid: true,
        email: "",
        password: "",
        emailRules: [
          // check if email in input
          email => !!email || "邮箱不能为空",
          email => /.@.+\./.test(email) || "邮箱地址格式无效"
        ],
        passwordRules: [
          // check if password in input
          password => !!password || "密码不能为空",
          password => password.length >= 4 || "密码至少4位"
        ]
      };
    },
    computed: {
      ...mapGetters(["loading", "error", "user"])
    },
    watch: {
      user(newValue, oldValue) {
        // if user changes, redirect to home page
        console.log(newValue, oldValue, Date.now());

        if (newValue) {
          const redirect = this.$route.query.redirect;
          if (redirect) {
            this.$router.replace(redirect);
          } else {
            this.$router.replace("/");
          }
        }
      }
    },
    methods: {
      signinUser() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch("signinUser", {
            email: this.email,
            password: this.password
          });
        }
      }
    }
    // beforeRouteEnter(to, from, next) {
    //   console.log("en", to, from, Date.now());
    //   next();
    // },
    // beforeRouteUpdate(to, from, next) {
    //   console.log("up", to, from, Date.now(), this.user);
    //   next();
    // },
    // beforeRouteLeave(to, from, next) {
    //   console.log("le", to, from, Date.now(), this.user);
    //   next();
    // }
  };
</script>
<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
