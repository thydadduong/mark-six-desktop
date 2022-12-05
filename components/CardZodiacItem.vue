<template>
  <v-card
    :dark="active"
    :color="activeColor"
    class="overflow-hidden card-zodiac-item"
    outlined
  >
    <v-card-text class="py-2">
      <v-layout class="gap" align-center>
        <div class="text-center flex-shrink-0 flex-grow-0">
          <div
            class="font-weight-bold"
            :class="{ 'text--primary': !active, 'white--text': active }"
          >
            <strong>{{ name }}</strong>
          </div>
          <div>{{ rate }}</div>
        </div>
        <div class="flex-grow-1">
          <v-layout align-center class="gap-xs" justify-end wrap>
            <div v-for="(ball, key) in balls" :key="`zodiac-ball-${key}`">
              <v-avatar
                size="24"
                :color="active ? 'white' : ball.color"
                :class="{ 'white--text': !active, 'text--primary': active }"
              >
                {{ ball.label }}
              </v-avatar>
            </div>
          </v-layout>
        </div>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CardZodiacItem",
  props: {
    name: String,
    active: Boolean,
    secondary: Boolean,
    balls: { type: Array, default: () => [] },
    rate: { type: [String, Number], default: "—" },
  },
  computed: {
    activeColor() {
      if (!this.active) return "grey lighten-4";
      if (this.secondary) return "#79C5D4";
      return "primary";
    },
  },
};
</script>

<style>
.card-zodiac-item.v-card.v-sheet--outlined {
  line-height: 1.5;
  border-color: #ccc !important;
}
</style>
