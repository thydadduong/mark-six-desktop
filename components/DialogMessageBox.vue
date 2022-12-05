<template>
  <v-dialog v-model="visible" width="400">
    <v-card :class="dialogTextColor" rounded="lg">
      <v-layout v-if="!!dialogIcon" class="justify-center pt-8">
        <v-icon :class="dialogTextColor" size="75"> {{ dialogIcon }}</v-icon>
      </v-layout>
      <v-card-title class="justify-center text-center">
        {{ title || dialogTextMessage }}</v-card-title
      >
      <v-card-text class="justify-center text-center" v-if="message">
        {{ message }}</v-card-text
      >
      <v-card-actions class="justify-center pb-4">
        <v-btn @click="close()" outlined>
          {{ $t("dialog.button.close") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { DialogType } from "~/models/types/dialog.type";

export default {
  name: "DialogMessageBox",
  props: {
    autoClose: Boolean,
    title: String,
    timeout: { type: Number, default: 1000 },
  },
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
    dialogTextMessage() {
      const { type } = this;
      if (type == DialogType.SUCCESS) return this.$t("dialog.message.success");
      if (type == DialogType.ERROR) return this.$t("dialog.message.failed");
      return "";
    },
    dialogIcon() {
      const { type } = this;
      if (type == DialogType.SUCCESS) return "mdi-check-circle-outline";
      if (type == DialogType.ERROR) return "mdi-close-circle-outline";
      return "";
    },
  },
  watch: {
    visible(v) {
      if (v) return this.handleAutoClose();
      this.$emit("closed");
      setTimeout(() => {
        this.message = "";
      }, 300);
    },
  },
  methods: {
    show(type = DialogType.DEFAULT, message = "") {
      this.message = message;
      this.setVisibility(type, true);
    },
    close() {
      this.setVisibility();
      clearTimeout(this.timeTrack);
    },
    setVisibility(type = DialogType.DEFAULT, visible = false) {
      this.visible = visible;
      setTimeout(
        () => {
          this.type = type;
        },
        visible ? 0 : 500
      );
    },
    handleAutoClose() {
      if (!this.autoClose) return;
      this.timeTrack = setTimeout(() => {
        this.close();
      }, this.timeout);
    },
  },
};
</script>

<style lang="sass" scoped></style>
