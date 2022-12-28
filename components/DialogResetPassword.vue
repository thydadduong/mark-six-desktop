<template>
  <v-dialog
    @input="visibleChange"
    :value="visible"
    content-class="rounded-0"
    width="30rem"
    scrollable
    persistent
  >
    <v-card :disabled="loading || isLoading" class="dialog-reset-password" tile>
      <v-card-title class="py-2 justify-center body-2 primary white--text">
        修改密码
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-6 pb-0">
        <v-form lazy-validation v-model="isValid" ref="resetPasswordForm">
          <v-text-field
            v-model="payload.o_passwd"
            :rules="[(v) => !!v || '密码是必需的']"
            placeholder="请输入原始密码"
            type="password"
            outlined
            dense
          >
            <template #prepend>
              <v-sheet class="pt-1" width="75">原密码</v-sheet>
            </template>
          </v-text-field>
          <v-text-field
            v-model="payload.ag_passwd"
            :rules="[(v) => !!v || '密码是必需的']"
            placeholder="请输入6-16位数字+字母的新密码"
            type="password"
            outlined
            dense
          >
            <template #prepend>
              <v-sheet class="pt-1" width="75">新密码 </v-sheet>
            </template>
          </v-text-field>
          <v-text-field
            placeholder="请再次输入新密码"
            v-model="payload.ag_passwd_confirm"
            :rules="[
              payload.ag_passwd === payload.ag_passwd_confirm || '密码必须匹配',
            ]"
            type="password"
            outlined
            dense
          >
            <template #prepend>
              <v-sheet class="pt-1" width="75">确认密码 </v-sheet>
            </template>
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="dialog-reset-password__footer justify-center">
        <v-btn @click="visibleChange(false)" elevation="0" outlined small>
          取消
        </v-btn>
        <v-btn
          @click="handleResetPassword"
          :loading="isLoading"
          color="primary"
          elevation="0"
          small
        >
          重设密码
        </v-btn>
      </v-card-actions>
      <DialogMessageBox ref="dialogMessage" auto-close />
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "DialogResetPassword",
  props: {
    visible: Boolean,
    loading: Boolean,
  },
  data() {
    return {
      isValid: false,
      isLoading: false,
      formValid: true,
      payload: { o_passwd: "", ag_passwd: "", ag_passwd_confirm: "" },
    };
  },
  computed: {},
  watch: {
    visible(v) {
      setTimeout(() => {
        this.$refs.resetPasswordForm.reset();
      }, 100);
    },
  },
  methods: {
    ...mapActions("profile", ["resetPassword"]),
    visibleChange(v = false) {
      this.$emit("update:visible", v);
    },
    handleResetPassword() {
      if (!this.$refs.resetPasswordForm.validate()) return;
      this.isLoading = true;
      const data = [];
      data.push(`o_passwd=${this.payload.o_passwd}`);
      data.push(`ag_passwd=${this.payload.ag_passwd}`);
      const payload = data.join("&");
      this.isLoading = true;
      this.resetPassword(payload)
        .then((res) => {
          let message = res.err;
          if (!res.code) {
            this.$toast.success(message);
            this.visibleChange(false);
            return;
          }
          this.$toast.error(message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="sass">
.dialog-reset-password
  .v-card__actions
    background-color: #1976d222
</style>
