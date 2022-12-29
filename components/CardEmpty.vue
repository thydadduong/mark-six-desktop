<template>
  <v-expand-transition>
    <v-layout v-if="visible" justify-center>
      <v-layout column align-center>
        <v-sheet color="transparent" />
        <v-card class="py-4" min-width="20rem" flat>
          <v-card-text>
            <v-img class="mx-auto" max-width="150" :src="thumbnail" />
          </v-card-text>
          <v-card-title class="justify-center">{{ message }} </v-card-title>
        </v-card>
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
