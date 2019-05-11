<template>
  <v-container text-xs-center mt-3>
    <!-- Signup title -->
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

    <!-- Signup from -->
    <v-layout row wrap>
      <v-flex sm8 offset-sm2 md6 offset-md3 lg4 offset-lg4>
        <v-card color="">
          <v-container>
            <v-form
              v-model="isFormValid"
              lazy-validation
              ref="form"
              @submit.prevent="signupUser"
            >
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="usernameRules"
                    v-model="username"
                    prepend-icon="mdi-account"
                    label="用户名"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

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
                    :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <!-- <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="passwordConfirm"
                    prepend-icon="mdi-lock-outline"
                    label="确认密码"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout> -->
              <!-- <v-flex xs12>
                <v-checkbox v-model="form.terms" color="green">
                  <template v-slot:label>
                    <div @click.stop="">
                      Do you accept the
                      <a href="javascript:;" @click.stop="terms = true"
                        >terms</a
                      >
                      and
                      <a href="javascript:;" @click.stop="conditions = true"
                        >conditions?</a
                      >
                    </div>
                  </template>
                </v-checkbox>
              </v-flex> -->
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
                    加 入
                  </v-btn>
                  <h3>
                    已经有账户？
                    <router-link to="/signin">登 录</router-link>
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
    name: "Signup",
    data() {
      return {
        isFormValid: true,
        username: "",
        email: "",
        password: "",
        showPassword: false,
        // passwordConfirm: "",
        usernameRules: [
          username => !!username || "用户名不能为空",
          username => username.length >= 2 || "用户名至少2个字符",
          username => username.length <= 12 || "用户名不得超过12个字符"
        ],
        emailRules: [
          email => !!email || "邮箱地址不能为空",
          email => /.@.+\./.test(email) || "邮箱地址格式无效"
        ],
        passwordRules: [
          password => !!password || "密码不能为空",
          password => password.length >= 4 || "密码至少4位"
          // confirmation => confirmation === this.password || "密码不匹配"
        ]
      };
    },
    computed: {
      ...mapGetters(["loading", "error", "user"])
    },
    created() {
      // console.log("/signup", this.user);
      this.transfer(this.user);
    },
    watch: {
      user(newVal, oldVal) {
        // console.log(newVal, oldVal);
        // if user changes, redirect to home page
        if (newVal) {
          this.transfer(newVal);
        }
      }
    },
    methods: {
      signupUser() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch("signupUser", {
            username: this.username,
            email: this.email,
            password: this.password
          });
        }
      },
      transfer(user) {
        if (user) {
          const redirect = this.$route.query.redirect;
          if (redirect) {
            this.$router.replace(redirect);
          } else {
            this.$router.replace("/");
          }
        }
      }
    }
  };
</script>
