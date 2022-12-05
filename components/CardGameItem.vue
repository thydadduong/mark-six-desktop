<template>
  <v-card
    :to="to"
    class="overflow-hidden"
    width="50%"
    max-width="100"
    flat
  >
    <v-layout justify-center class="pa-2">
      <v-avatar size="75">
        <v-img :src="icon" alt="" />
      </v-avatar>
    </v-layout>
    <v-card-text class="text-center pa-0">{{ title }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CardGameItem",
  props: {
    to: String,
    title: String,
    icon: { type: String, default: "/images/default.png" },
  },
};
</script>

<style></style>
