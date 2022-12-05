<template>
  <div>
    <Toolbar title="修改密码" />
    <v-card class="ma-4" width="30rem" flat>
      <v-card-text>
        <v-card class="overflow-hidden" flat>
          <v-form lazy-validation v-model="isValid" ref="resetPasswordForm">
            <v-list>
              <v-list-item>
                <v-list-item-action style="width: 75px" class="mr-0">
                  原密码
                </v-list-item-action>
                <v-list-item-content class="py-0">
                  <v-text-field
                    placeholder="请输入原始密码"
                    v-model="payload.o_passwd"
                    :rules="[(v) => !!v || '密码是必需的']"
                    type="password"
                    hide-details
                    solo
                    flat
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-action style="width: 75px" class="mr-0"
                  >新密码</v-list-item-action
                >
                <v-list-item-content class="py-0">
                  <v-text-field
                    placeholder="请输入6-16位数字+字母的新密码"
                    v-model="payload.ag_passwd"
                    hide-details
                    type="password"
                    :rules="[
                      payload.ag_passwd === payload.ag_passwd_confirm ||
                        '密码必须匹配',
                    ]"
                    solo
                    flat
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <!-- Confirm password -->
              <v-list-item>
                <v-list-item-action style="width: 75px" class="mr-0"
                  >确认密码</v-list-item-action
                >
                <v-list-item-content class="py-0">
                  <v-text-field
                    placeholder="请再次输入新密码"
                    hide-details
                    v-model="payload.ag_passwd_confirm"
                    type="password"
                    solo
                    flat
                  ></v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-form>
          <!-- </v-card-text> -->
        </v-card>
      </v-card-text>
      <v-card-actions class="justify-center pb-4">
        <v-btn
          color="primary"
          @click="handleResetPassword"
          :loading="isLoading"
        >
          重设密码
        </v-btn>
      </v-card-actions>
    </v-card>
    <DialogMessageBox @closed="onDialogClosed" ref="errorDialog" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { DialogType } from "~/models/types/dialog.type";

export default {
  name: "PageProfileResetPassword",
  data: () => ({
    isValid: false,
    isLoading: false,
    isDone: false,
    payload: { o_passwd: "", ag_passwd: "", ag_passwd_confirm: "" },
  }),

  methods: {
    ...mapActions("profile", ["resetPassword"]),
    handleResetPassword() {
      this.isDone = false;
      const data = [];
      data.push(`o_passwd=${this.payload.o_passwd}`);
      data.push(`ag_passwd=${this.payload.ag_passwd}`);
      const payload = data.join("&");
      this.isLoading = true;
      this.resetPassword(payload).then((res) => {
        this.isLoading = false;
        let message = res.err;
        if (!res.code) {
          this.$refs.errorDialog.show(DialogType.SUCCESS, message);
          this.payload.o_passwd = "";
          this.payload.ag_passwd = "";
          this.payload.ag_passwd_confirm = "";
          this.isDone = true;
          return;
        }
        this.$refs.errorDialog.show(DialogType.ERROR, message);
      });
    },
    onDialogClosed() {
      if (!this.isDone) return;
      this.$router.replace("/profile");
    },
  },
};
</script>

<style></style>
