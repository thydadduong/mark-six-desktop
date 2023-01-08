<template>
  <v-layout
    :style="{ backgroundImage: `url('${bgImg}')` }"
    style="min-height: 100vh; background-size: cover"
    class="pr-10"
    justify-end
    align-center
  >
    <v-sheet
      style="background-color: rgba(106, 170, 255, 0.3) !important"
      color="primary lighten-2"
      width="90%"
      max-width="640"
      rounded="xl"
    >
      <v-row no-gutters>
        <v-col class="pa-6" cols="12" md="6">
          <v-layout class="fill-height" justify-center align-center>
            <div>
              <v-img src="/svg/login.svg" width="150" min-height="150" alt="" />
            </div>
          </v-layout>
        </v-col>
        <v-col class="pa-6" cols="12" md="6">
          <v-card color="primary darken-2" class="py-5" rounded="xl" flat dark>
            <v-card-title class="justify-center">
              {{ appTitle || "系統" }}
            </v-card-title>
            <v-card-text>
              <v-form
                v-model="formValid"
                ref="editedForm"
                :disabled="isLoading"
              >
                <v-text-field
                  v-model="credential.username"
                  :placeholder="$t('login.title.credential')"
                  :rules="$formRules.required"
                  prepend-inner-icon="mdi-account-outline"
                  background-color="primary"
                  name="credential"
                  id="credential"
                  rounded
                  dense
                  solo
                  flat
                ></v-text-field>
                <v-text-field
                  v-model="credential.password"
                  :placeholder="$t('login.title.password')"
                  :rules="$formRules.required"
                  prepend-inner-icon="mdi-lock-outline"
                  background-color="primary"
                  type="password"
                  name="password"
                  id="password"
                  rounded
                  dense
                  solo
                  flat
                ></v-text-field>
                <v-btn
                  @click="submitLogin"
                  :loading="isLoading"
                  color="primary"
                  elevation="0"
                  rounded
                  block
                >
                  {{ $t("login.title.login") }}
                </v-btn>
                <v-layout justify-center>
                  <v-checkbox
                    v-model="credential.remember_me"
                    label="记住我"
                    dense
                  ></v-checkbox>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
    <DialogMessageBox ref="dialogMessage" auto-close />
  </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { DialogType } from "~/models/types/dialog.type";
import { encodePassword } from "~/utils/encode";
export default {
  name: "PageLogin",
  middleware: "unAuth",
  layout: "blank",
  data() {
    return {
      isLoading: false,
      formValid: true,
      credential: {
        username: "",
        password: "",
        remember_me: false,
      },
      bgImages: ["/images/newYear1.png"],
    };
  },
  computed: {
    ...mapState("app", ["appTitle"]),
    bgImg() {
      let index = Math.floor(Math.random() * 3);
      return this.bgImages[index] || this.bgImages[0];
    },
  },
  methods: {
    ...mapActions("auth", ["authenticate"]),
    submitLogin() {
      if (!this.$refs.editedForm.validate()) return;
      const rnd = Math.round(Math.random() * 100000);
      const uid = this.credential.username;
      const pwd = this.credential.password;
      const code = "8888";
      const cc = [rnd, uid, pwd, code].join("|");
      const encodedCredential = encodePassword({ data: cc, type: 0 });
      const formData = new FormData();
      formData.append("code", encodedCredential);
      this.isLoading = true;
      const options = { headers: { "Content-Type": "multipart/form-data" } };
      this.authenticate({ payload: formData, options })
        .then((res) => {
          let message = "";
          if (!res.code) {
            let _loginMsg = res.webtitle.split("客戶").join(" 客戶");
            message = [this.appTitle, _loginMsg].join(" ");
            this.$toast.success(message);
            setTimeout(() => {
              window.location.href = "/check-policy";
            }, 1000);
            return;
          } else {
            this.isLoading = false;
            message = res.message;
            this.$toast.error(message);
          }
        })
        .catch((error) => {
          const message = error.response?.data?.message || error;
          this.$toast.error(message);
          this.isLoading = false;
        });
    },
  },
};
</script>
