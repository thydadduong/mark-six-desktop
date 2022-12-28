<template>
  <v-card-text
    style="background: linear-gradient(0deg, #dae8fc, #fff)"
    class="primary--text py-1 px-2"
  >
    <v-layout>
      <slot></slot>
      <v-spacer></v-spacer>
      <portal-target name="closeTimer"></portal-target>
    </v-layout>
  </v-card-text>
</template>

<script>
export default {
  name: "GameActionBar",
};
</script>

<style></style>
