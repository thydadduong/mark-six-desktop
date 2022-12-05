<template>
  <v-card
    @click="onclick"
    :color="activeColor"
    :dark="active"
    :width="width"
    class="card-board-item"
    outlined
  >
    <p
      :class="{ [`${color}--text`]: !active }"
      class="mb-0 justify-center text-center"
      style="font-size: 18px"
    >
      <strong v-if="splitTitle">
        <span :class="active ? 'white--text' : 'primary--text'">{{
          title[0]
        }}</span>
        <span :class="active ? 'white--text' : 'primary--text'">{{
          title[1]
        }}</span>
      </strong>
      <strong v-else>{{ title }}</strong>
    </p>
    <p class="text-center mb-0">{{ rate }}</p>
  </v-card>
</template>

<script>
export default {
  name: "CardBoardItem",
  props: {
    title: String,
    color: String,
    active: Boolean,
    secondary: Boolean,
    splitTitle: Boolean,
    width: [String, Number],
    rate: { type: [String, Number], default: "—" },
  },
  computed: {
    activeColor() {
      if (!this.active) return "grey lighten-4";
      if (this.secondary) return "#79C5D4";
      return "primary";
    },
  },
  methods: {
    onclick() {
      this.$emit("toggle");
    },
  },
};
</script>

<style>
.card-board-item.v-card.v-sheet--outlined {
  line-height: 1.5;
  border-color: #ccc !important;
}
</style>
