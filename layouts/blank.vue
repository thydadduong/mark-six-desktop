<template>
  <v-app>
    <nuxt />
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  layout: "LayoutBlank",
  props: {},
  head() {
    return {
      title: this.$store.state.app.appTitle,
    };
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions("app", ["getAppTitle"]),
  },
  mounted() {
    this.getAppTitle();
    this.$ga.page(this.$router);
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
