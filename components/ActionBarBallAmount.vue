<template>
  <v-card flat class="game-action-bar" color="#dae8fc" rounded="lg">
    <v-layout class="pa-2 gap-sm" justify-center align-center>
      <v-btn
        v-for="item in valueOptions"
        :key="`option-${item}`"
        @click="setValue(item)"
        class="rounded"
        elevation="0"
        color="teal"
        width="50"
        height="50"
        dark
        fab
      >
        {{ item }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="submit" color="primary" elevation="0"> 输入 </v-btn>
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
  },
  methods: {
    setValue(value) {
      this.$emit("set-amount", value);
    },
    submit() {
      this.$emit("compose");
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
