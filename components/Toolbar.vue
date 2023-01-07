<template>
  <v-toolbar height="32" class="main-toolbar" color="primary" dark>
    <v-toolbar-title class="px-4 py-1 body-1">
      {{ title }}
    </v-toolbar-title>
  </v-toolbar>
</template>
<script>
export default {
  name: "Toolbar",
  props: {
    title: String,
  },
};
</script>
<style lang=""></style>
