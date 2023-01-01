<template>
  <v-card-text
    style="background: linear-gradient(0deg, #dae8fc, #fff)"
    class="primary--text py-1 px-2"
  >
    <v-layout>
      <slot></slot>
      <v-spacer></v-spacer>
      <slot name="right"></slot>
    </v-layout>
  </v-card-text>
</template>

<script>
export default {
  name: "GameActionBarFlat",
};
</script>

<style></style>
