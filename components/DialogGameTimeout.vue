<template>
  <v-dialog :value="visible" width="400" :persistent="persistent">
    <v-card>
      <v-card-title class="body-1 justify-center primary white--text py-2"
        >温馨提示
      </v-card-title>
      <v-layout class="justify-center pt-8">
        <v-icon color="primary" size="75"> mdi-information-outline</v-icon>
      </v-layout>
      <v-card-title class="justify-center text-center">
        {{ title }}
      </v-card-title>
      <v-card-text class="justify-center text-center" v-if="message">
        {{ message }}</v-card-text
      >
      <v-card-actions class="justify-center py-2 dialog-close__footer">
        <v-btn v-if="!actionTo" @click="close" outlined>
          {{ actionTitle }}
        </v-btn>
        <v-btn v-else :href="actionTo" elevation="0" color="primary">
          {{ actionTitle }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { DialogType } from "~/models/types/dialog.type";

export default {
  name: "DialogGameTimeout",
  props: {
    visible: Boolean,
    title: String,
    message: String,
    actionTitle: String,
    actionTo: String,
    persistent: { type: Boolean, default: true },
    timeout: { type: Number, default: 5000 },
  },
  data() {
    return {
      type: DialogType.DEFAULT,
    };
  },
  watch: {},
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="sass">
.dialog-close__footer
  background-color: #1976d222
</style>
