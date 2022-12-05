<template>
  <v-sheet color="transparent">
    <v-toolbar color="primary darken-1" height="32" dark flat>
      <v-toolbar-title class="px-4 my-4 py-1 body-1">大厅</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-layout class="gap" wrap>
        <CardGameItem
          v-for="(item, key) in gameList"
          :key="`game-${key}`"
          :title="item.title"
          :icon="getIcon(item.logo)"
          to="/games/tema"
        />
      </v-layout>
    </v-card-text>
  </v-sheet>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Homepage",
  data() {
    return {};
  },
  computed: {
    ...mapState("game", { isLoading: "isLoading", gameList: "records" }),
  },
  methods: {
    ...mapActions("game", ["getGameList"]),
    getIcon(icon) {
      return `/api-image${icon}`;
    },
  },
  mounted() {
    this.getGameList();
  },
};
</script>
