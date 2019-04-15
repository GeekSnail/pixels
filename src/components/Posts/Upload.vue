<template>
  <v-container text-xs-center>
    <!-- Signup title -->
    <v-layout row wrap mb-3>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">上传照片</h1>
      </v-flex>
    </v-layout>

    <!-- Signup from -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <!-- <v-card color="">
          <v-container> -->
        <v-form
          v-model="isFormValid"
          lazy-validation
          ref="form"
          @submit.prevent="addPost"
        >
          <!-- title input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                solo
                :rules="titleRules"
                v-model="post.title"
                prepend-icon="mdi-text"
                label="照片标题"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- image url input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                solo
                :rules="imageRules"
                label="上传照片"
                @click="pickFile"
                v-model="imageName"
                prepend-icon="mdi-cloud-upload-outline"
                required
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
              />
            </v-flex>
          </v-layout>

          <!-- Image preview -->
          <v-layout row v-if="imageUrl">
            <v-flex xs12>
              <img :src="imageUrl" height="300px" alt="" />
            </v-flex>
          </v-layout>

          <!-- tags select -->
          <!-- <v-layout row>
            <v-flex xs12>
              <v-select
                solo
                :rules="tagsRules"
                v-model="tags"
                :items="['art','Education','Travel','Photography','Technology']"
                multiple
                prepend-icon="mdi-tag-text-outline"
                label="类别（可多选）"
                type="text"
                required
              ></v-select>
            </v-flex>
          </v-layout> -->
          <template>
            <v-combobox
              v-model="post.tags"
              :items="tagsSearchList"
              label="标签"
              tags
              clearable
              prepend-icon="mdi-tag-text-outline"
              solo
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  :selected="data.selected"
                  close
                  @input="remove(data.item)"
                >
                  <strong>{{ data.item }}</strong
                  >&nbsp;
                  <!-- <span>(interest)</span> -->
                </v-chip>
              </template>
            </v-combobox>
          </template>

          <!-- description input -->
          <v-layout row>
            <v-flex xs12>
              <v-textarea
                solo
                :rules="descRules"
                v-model="post.description"
                prepend-icon="mdi-card-text-outline"
                label="描述"
                type="text"
                required
              ></v-textarea>
            </v-flex>
          </v-layout>

          <!-- submit -->
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
                发 布
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
        <!-- </v-container>
        </v-card> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { ADD_POST_ } from "../../queries";
  import { mapGetters } from "vuex";
  export default {
    name: "Upload",
    data() {
      return {
        isFormValid: true,
        post: {
          title: "",
          tags: [],
          description: ""
        },
        imageName: "",
        imageUrl: "",
        imageFile: "",
        tagsSearchList: [
          "art",
          "Education",
          "Travel",
          "Photography",
          "Technology"
        ],
        titleRules: [
          title => !!title || "标题不得为空",
          title => title.length < 20 || "标题至多20个字符"
        ],
        imageRules: [image => !!image || "照片不得为空"],
        tagsRules: [tags => !!tags.length >= 1 || "至少选择一个分类"],
        descRules: [
          desc => !!desc || "描述不得为空",
          desc => desc.length <= 150 || "描述至多150个字符"
        ]
      };
    },
    computed: {
      ...mapGetters(["loading", "user"])
    },
    methods: {
      // https://stackoverflow.com/questions/44989162/file-upload-in-vuetify
      pickFile() {
        this.$refs.image.click();
      },
      onFilePicked(e) {
        const files = e.target.files;
        if (files[0] !== undefined) {
          this.imageName = files[0].name;
          if (this.imageName.lastIndexOf(".") <= 0) {
            return;
          }
          const fr = new FileReader();
          fr.readAsDataURL(files[0]);
          fr.addEventListener("load", () => {
            this.imageUrl = fr.result;
            this.imageFile = files[0]; // this is an image file that can be sent to server...
          });
        } else {
          this.imageName = "";
          this.imageFile = "";
          this.imageUrl = "";
        }
      },
      remove(item) {
        this.tags.splice(this.tags.indexOf(item), 1);
        this.tags = [...this.tags];
      },
      addPost() {
        if (this.$refs.form.validate()) {
          // add post action
          console.log(this.$apollo.queries);
          this.$store.dispatch("addPost", {
            payload: {
              ...this.post,
              image: this.imageFile,
              userId: this.user._id
            },
            imageUrl: this.imageUrl
          });
          this.$apollo.mutate({
            mutation: ADD_POST_,
            variables: {
              ...this.post,
              imageUrl: this.imageUrl
              // userId: this.user._id
            }
          });
          console.log("/upload -> /");
          this.$router.push("/");
        }
      }
    }
  };
</script>
