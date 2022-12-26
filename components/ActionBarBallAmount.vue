<template>
  <v-card flat class="game-action-bar" color="#dae8fc" rounded="lg">
    <v-layout class="pa-1 gap" justify-end align-center>
      <v-btn
        v-for="item in valueOptions"
        :key="`option-${item}`"
        @click="setValue(item)"
        elevation="1"
        color="teal"
        width="50"
        height="50"
        dark
        fab
      >
        {{ item }}
      </v-btn>
      <v-btn
        @click="submit"
        class="rounded"
        color="primary"
        elevation=""
        width="50"
        height="50"
        dark
        fab
      >
        输入
      </v-btn>
      <v-btn
        v-if="showClear"
        @click="clear"
        class="rounded"
        color="error"
        elevation=""
        width="50"
        height="50"
        dark
        fab
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "ActionBarBallAmount",
  props: {},
  computed: {
    valueOptions() {
      return [100, 200, 500, 750, 1000];
    },
    showClear() {
      return !!this.$listeners.clear;
    },
  },
  methods: {
    setValue(value) {
      this.$emit("set-amount", value);
    },
    submit() {
      this.$emit("compose");
    },
    clear() {
      this.$emit("clear");
    },
  },
};
</script>

<style>
.game-action-bar.action-bar--fixed {
  position: fixed;
  bottom: 64px;
  left: 1rem;
  right: 1rem;
}
</style>
