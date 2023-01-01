<template>
  <v-layout class="gap-xs">
    <v-sheet
      v-for="(item, key) in gridItems"
      :key="`lucky-number-${key}`"
      width="calc(100% / 3)"
    >
      <table
        class="game-item-table item-49 disable-select"
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
                class="game-item-table__title primary white--text"
                style="width: 40px"
              >
                {{ subitem.name }}
              </td>
              <td
                class="game-item-table__rate primary white--text"
                style="width: 50px"
              >
                {{ getBallRate(subitem.play_id) }}
              </td>
              <td v-if="!singleAmount" class="game-item-table__input primary">
                <input
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
              <td
                :class="ballColor(subitem.name)"
                class="game-item-table__title"
              >
                {{ subitem.name }}
              </td>
              <td class="game-item-table__rate">
                {{ getBallRate(subitem.play_id) }}
              </td>
              <td v-if="!singleAmount" class="game-item-table__input">
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
    </v-sheet>
  </v-layout>
</template>

<script>
export default {
  name: "BittingItem49",
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
    ballColor(name) {
      const color = this.$common.getBallColor(name) || "primary";
      return `${color}--text`;
    },
    setItemAmount(value) {
      this.selectedItems.forEach((item) => {
        const _item = this.$refs[item.play_id]?.[0];
        if (_item) _item.value = value;
      });
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
  },
};
</script>

<style></style>
