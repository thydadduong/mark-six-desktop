<template>
  <v-card
    :dark="active"
    :color="activeColor"
    class="card-ball-color"
    style="margin-top: -1px"
    outlined
    tile
    flat
  >
    <v-layout class="gap-sm" align-center>
      <v-sheet
        :class="active ? 'white--text' : `${ballsColor}--text`"
        class="flex-grow-0 flex-shrink-0 font-weight-bold pa-2 text-center"
        color="transparent"
        width="50"
      >
        {{ name }}
      </v-sheet>
      <v-divider vertical></v-divider>
      <v-sheet
        :class="active ? 'white--text' : 'grey--text text--darken-2'"
        class="flex-grow-0 flex-shrink-0 pa-2 text-center"
        color="transparent"
        width="50"
      >
        {{ rate }}
      </v-sheet>
      <v-divider vertical></v-divider>
      <v-sheet class="flex-grow-1 pa-2" color="transparent">
        <v-layout align-center class="gap-xs" wrap>
          <div v-for="(ball, key) in balls" :key="`ball-${key}`">
            <v-avatar
              size="24"
              :color="active ? 'white' : ballsColor"
              :class="{ 'white--text': !active, 'text--primary': active }"
            >
              {{ ball }}
            </v-avatar>
          </div>
        </v-layout>
      </v-sheet>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "CardGrid3Item",
  props: {
    name: String,
    active: Boolean,
    secondary: Boolean,
    ballsColor: String,
    balls: { type: Array, default: () => [] },
    rate: { type: [String, Number], default: "—" },
  },
  computed: {
    activeColor() {
      if (!this.active) return "";
      if (this.secondary) return "#79C5D4";
      return "primary";
    },
  },
};
</script>

<style>
.card-ball-color.v-card.v-sheet--outlined {
  line-height: 1.5;
  border-color: #ccc !important;
}
</style>
