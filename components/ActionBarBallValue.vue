<template>
  <v-card
    :flat="!mobile"
    :class="{ 'action-bar--fixed': mobile }"
    class="game-action-bar"
    color="grey lighten-4"
  >
    <v-layout class="pa-1 gap-sm" justify-center align-center>
      <v-btn-toggle :value="value" color="primary" group>
        <v-btn
          @click="onInputValue(100)"
          :value="100"
          class="ma-0 rounded"
          height="40"
          small
        >
          100
        </v-btn>

        <v-btn
          @click="onInputValue(200)"
          :value="200"
          class="ma-0 rounded"
          height="40"
          small
        >
          200
        </v-btn>

        <v-btn
          @click="onInputValue(500)"
          :value="500"
          class="ma-0 rounded"
          height="40"
          small
        >
          500
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <v-text-field
        @change="onInputValue"
        :rules="$formRules.bittingAmount"
        :value="value"
        style="max-width: 75px"
        placeholder="0"
        dense
        outlined
        hide-details
      ></v-text-field>
      <v-btn @click="submit" color="primary" small elevation="0" height="40">
        输入
      </v-btn>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "ActionBarBallValue",
  props: {
    value: Number,
    mobile: Boolean,
  },
  methods: {
    onInputValue(value) {
      if (isNaN(value)) return alert("Only number are allow.");
      this.$emit("update:value", +value);
    },
    submit() {
      this.$emit("input");
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
