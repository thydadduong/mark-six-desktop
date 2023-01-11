<template>
  <v-sheet color="transparent">
    <portal to="toolbarName">大厅</portal>
    <v-card-text>
      <v-layout class="gap" wrap>
        <CardGameItem
          v-for="(item, key) in gameList"
          :key="`game-${key}`"
          :title="item.title"
          :icon="getIcon(item.logo)"
          to="/games/tema"
        />
        <CardGameItem
          key="南粤36"
          title="南粤36"
          :icon="getIcon('/patch-files/logo/hk6.jpg')"
          to="/nanyue-36/tema"
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
