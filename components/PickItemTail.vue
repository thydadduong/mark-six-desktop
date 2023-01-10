<template>
  <v-layout class="gap-xs">
    <v-sheet
      v-for="(item, key) in gridItems"
      :key="`lucky-number-${key}`"
      width="20%"
    >
      <table
        class="game-item-table tail disable-select"
        :class="{ 'no-input': singleAmount }"
      >
        <tbody>
          <tr
            v-for="subitem in item"
            :key="`lucky-number-item-${key}-${subitem.play_id}`"
            @click="toggleSelectItem(subitem)"
            class="cursor-pointer"
          >
            <template v-if="isActive(subitem.value)">
              <td
                :class="
                  isFixedFront(subitem.label) ? 'fixed-front-color' : 'primary'
                "
                class="game-item-table__title white--text"
                style="width: 40px"
              >
                {{ subitem.name }}
              </td>
              <td
                :class="
                  isFixedFront(subitem.label) ? 'fixed-front-color' : 'primary'
                "
                class="game-item-table__rate white--text"
                style="width: 50px"
              >
                {{ getBallRate(subitem.play_id) }}
              </td>
              <td
                v-if="!singleAmount"
                :class="
                  isFixedFront(subitem.label) ? 'fixed-front-color' : 'primary'
                "
                class="game-item-table__input primary"
              >
                <input
                  @keypress="preventNonNumericalInput"
                  @click.stop="() => {}"
                  :ref="subitem.play_id"
                  :id="subitem.play_id"
                  :name="subitem.play_id"
                  :disabled="disabled"
                  class="text-right px-1 hidden-spin"
                  type="number"
                />
              </td>
            </template>
            <template v-else>
              <td class="game-item-table__title primary--text">
                {{ subitem.name }}
              </td>
              <td class="game-item-table__rate">
                {{ getBallRate(subitem.play_id) }}
              </td>
              <td v-if="!singleAmount" class="game-item-table__input">
                <input
                  @click.stop="toggleSelectItem(subitem)"
                  :disabled="disabled"
                  class="text-right px-1"
                  tabindex="-1"
                  readonly
                />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </v-sheet>
  </v-layout>
</template>

<script>
export default {
  name: "PickItemTail",
  props: {
    disabled: Boolean,
    singleAmount: Boolean,
    type: Number,
    fixedFront: { type: Number, default: 0 },
    rates: { type: Object, default: () => ({}) },
    gridItems: { type: Array, default: () => [] },
    selectedItems: { type: Array, default: () => [] },
  },
  computed: {},
  methods: {
    isActive(value) {
      return !!this.selectedItems.find((item) => item.value == value);
    },
    isFixedFront(label) {
      if (this.type != 2) return false;
      let index = this.selectedItems.findIndex((item) => item.label == label);
      if (index == -1) return false;
      return index <= this.fixedFront;
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
      if (this.disabled) return;
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
