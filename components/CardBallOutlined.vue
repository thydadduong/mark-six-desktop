<template>
  <v-card
    @click="onclick"
    :color="active ? 'primary' : ''"
    :dark="active"
    :width="width"
    :outlined="!active"
    class="card-board-item"
    flat
  >
    <p
      :class="{ [`${color}--text`]: !active }"
      class="mb-0 justify-center text-center"
      style="font-size: 18px"
    >
      {{ title }}
    </p>
    <p class="text-center mb-0">{{ rate }}</p>
  </v-card>
</template>

<script>
export default {
  name: "CardBallOutlined",
  props: {
    title: String,
    color: String,
    active: Boolean,
    width: [String, Number],
    rate: { type: [String, Number], default: "—" },
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
