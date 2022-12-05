<template>
  <v-expand-transition>
    <v-layout v-if="visible" justify-center>
      <v-layout column align-center>
        <v-sheet color="transparent" height="100" />
        <v-img max-width="150" :src="thumbnail" />
        <v-card-title>{{ message }} </v-card-title>
      </v-layout>
    </v-layout>
  </v-expand-transition>
</template>

<script>
export default {
  name: "CardEmpty",
  props: {
    visible: Boolean,
    message: { type: String, default: "无未结记录" },
    thumbnail: { type: String, default: "/images/empty.jpg" },
  },
};
</script>

<style></style>
