<template>
  <v-row dense>
    <v-col
      v-for="(item, key) in gridItems"
      :key="`lucky-number-${key}`"
      cols="6"
    >
      <table
        class="game-item-table disable-select"
        :class="{ 'no-input': singleAmount }"
      >
        <tbody>
          <tr
            v-for="subitem in item"
            :key="`lucky-number-item-${key}-${subitem.play_id}`"
            @click="toggleSelectItem(subitem)"
          >
            <template v-if="isActive(subitem.value)">
              <td class="game-item-table__title primary white--text">
                {{ subitem.name }}
              </td>
              <td class="game-item-table__ball primary text-left px-4">
                <v-avatar
                  v-for="(ball, index) in subitem.balls"
                  :key="`ball-${key}-${subitem.play_id}-${index}`"
                  class="mr-1 mb-1"
                  color="white"
                  size="26"
                >
                  {{ ball.label || "-" }}
                </v-avatar>
              </td>
              <td class="game-item-table__rate primary white--text">
                {{ getBallRate(subitem.play_id) }}
              </td>
              <td v-if="!singleAmount" class="game-item-table__input primary">
                <input
                  @keypress="preventNonNumericalInput"
                  @click.stop="() => {}"
                  :ref="subitem.play_id"
                  :id="subitem.play_id"
                  :name="subitem.play_id"
                  class="text-right px-1 hidden-spin"
                  type="number"
                />
              </td>
            </template>
            <template v-else>
              <td class="game-item-table__title">
                {{ subitem.name }}
              </td>
              <td class="game-item-table__ball text-left px-4">
                <v-avatar
                  v-for="(ball, index) in subitem.balls"
                  :key="`ball-${key}-${subitem.play_id}-${index}`"
                  :color="$common.getBallColor(ball.value)"
                  class="white--text mr-1 mb-1"
                  size="26"
                >
                  {{ ball.label || "-" }}
                </v-avatar>
              </td>
              <td class="game-item-table__rate">
                {{ getBallRate(subitem.play_id) }}
              </td>
              <td class="game-item-table__input" v-if="!singleAmount">
                <input
                  @click.stop="toggleSelectItem(subitem)"
                  class="text-right px-1"
                  tabindex="-1"
                  readonly
                />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "PickItemAnimal",
  props: {
    singleAmount: Boolean,
    rates: { type: Object, default: () => ({}) },
    gridItems: { type: Array, default: () => [] },
    selectedItems: { type: Array, default: () => [] },
  },
  computed: {},
  methods: {
    isActive(value) {
      return !!this.selectedItems.find((item) => item.value == value);
    },
    setItemAmount(value) {
      this.selectedItems.forEach((item) => {
        const _item = this.$refs[item.play_id]?.[0];
        if (_item && !_item.value) _item.value = value;
      });
    },
    setItemAmountIndividual(play_id, value) {
      setTimeout(() => {
        if (!!this.$refs[play_id]?.[0]) {
          this.$refs[play_id][0].value = value;
        }
      }, 50);
    },
    getBallRate(id) {
      return this.rates[id] || "-";
    },
    toggleSelectItem(item) {
      this.$emit("toggle-item", item);
      if (this.singleAmount) return;
      setTimeout(() => {
        this.$refs[item.play_id][0]?.focus();
      }, 100);
    },
    preventNonNumericalInput(e) {
      e = e || window.event;
      var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
      var charStr = String.fromCharCode(charCode);

      if (!charStr.match(/^[0-9]+$/)) e.preventDefault();
    },
  },
};
</script>

<style></style>
