<template>
  <v-card flat class="game-action-bar" color="#dae8fc" rounded="lg">
    <v-layout class="pa-1 gap" justify-end align-center>
      <v-btn
        v-for="item in valueOptions"
        :key="`option-${item}`"
        @click="onInput(item)"
        elevation="1"
        color="teal"
        width="50"
        height="50"
        dark
        fab
      >
        {{ item }}
      </v-btn>
      <div style="width: 150px">
        <v-layout class="gap-sm" align-center>
          <span class="text-no-wrap">金额</span>
          <v-text-field
            @input="onInput"
            :value="value"
            background-color="white"
            class="amount-input"
            type="number"
            hide-details
            outlined
            dense
          ></v-text-field>
        </v-layout>
      </div>
      <v-btn
        @click="onInput()"
        class="rounded white"
        width="40"
        height="40"
        outlined
        fab
      >
        重置
      </v-btn>
      <v-btn
        @click="submit"
        class="rounded"
        color="primary"
        elevation="0"
        width="40"
        height="40"
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
        elevation="0"
        width="40"
        height="40"
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
  props: {
    value: Number,
  },
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
      this.$emit("set-amount", +value);
    },
    onInput(value) {
      this.$emit("input", +value);
      this.$emit("change", +value);
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

<style lang="scss">
.game-action-bar.action-bar--fixed {
  position: fixed;
  bottom: 64px;
  left: 1rem;
  right: 1rem;
}

.game-action-bar {
  .amount-input.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
    > .v-input__control
    > .v-input__slot {
    padding: 0 0.25rem;
    input {
      text-align: right;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
