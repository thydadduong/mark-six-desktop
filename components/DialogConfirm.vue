<template>
  <v-dialog v-model="visible" content-class="rounded-xl" width="400">
    <v-card :class="dialogTextColor" rounded="lg">
      <v-layout v-if="!!dialogIcon" class="justify-center pt-8">
        <v-icon :class="dialogTextColor" size="75">{{ dialogIcon }}</v-icon>
      </v-layout>
      <v-card-title class="justify-center text-center">{{
        $t("dialog.message.confirmation")
      }}</v-card-title>
      <v-card-text class="text-center">{{ displayMessage }}</v-card-text>
      <v-card-actions class="justify-center pb-4">
        <v-btn @click="close()" outlined="outlined">{{
          $t("dialog.button.close")
        }}</v-btn>
        <v-btn @click="confirm" :color="confirmButtonColor" elevation="0">{{
          $t("dialog.button.confirm")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { DialogType } from "~/models/types/dialog.type";

export default {
  name: "DialogConfirm",
  data() {
    return {
      visible: false,
      type: DialogType.DEFAULT,
      message: "",
    };
  },
  computed: {
    dialogTextColor() {
      const { type } = this;
      if (type == DialogType.ERROR) return "error--text";
      if (type == DialogType.SUCCESS) return "success--text";
      return "text--primary";
    },
    confirmButtonColor() {
      const { type } = this;
      if (type == DialogType.ERROR) return "error";
      if (type == DialogType.SUCCESS) return "success";
      return "primary";
    },
    dialogTextMessage() {
      const { type } = this;
      if (type == DialogType.SUCCESS) return this.$t("dialog.message.success");
      if (type == DialogType.ERROR) return this.$t("dialog.message.failed");
      return "";
    },
    dialogIcon() {
      const { type } = this;
      if (type == DialogType.SUCCESS) return "mdi-check-circle-outline";
      if (type == DialogType.ERROR) return "mdi-alert-circle-outline";
      return "";
    },
    displayMessage() {
      return this.message || this.$t("dialog.message.confirmation_default");
    },
  },
  methods: {
    show(type = DialogType.DEFAULT, message = "") {
      this.setVisibility(type, message, true);
    },
    close() {
      this.setVisibility();
    },
    setVisibility(type = DialogType.DEFAULT, message = "", visible = false) {
      this.visible = visible;
      setTimeout(
        () => {
          this.message = message;
          this.type = type;
        },
        visible ? 0 : 500
      );
    },
    confirm() {
      this.$emit("confirm");
      this.close();
    },
  },
};
</script>

<style lang="sass" scoped></style>
