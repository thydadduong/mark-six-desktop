<template>
  <v-layout class="gap-xs">
    <v-layout
      v-for="(colNumber, colIndex) in flipCoins"
      :key="`item-${colIndex}`"
      class="gap-xs"
      style="width: 25%"
    >
      <table class="game-item-table">
        <tbody>
          <tr
            v-for="(item, subKey) in colNumber"
            :key="`item-${colIndex}-${subKey}`"
            @click="clickRow(item)"
            class="cursor-pointer clickable"
          >
            <template v-if="isSelected(item.play_id)">
              <td class="cell-selected white--text primary">
                {{ item.label }}
              </td>
              <td class="cell-selected primary white--text">
                {{ getBallRate(item.play_id) }}
              </td>
              <td class="cell-selected primary">
                <input
                  @click.stop="() => {}"
                  :ref="item.play_id"
                  :id="item.play_id"
                  :name="item.play_id"
                  class="text-right px-1 hidden-spin"
                  placeholder="0"
                  type="number"
                />
              </td>
            </template>
            <template v-else>
              <td class="disable-select">{{ item.label }}</td>
              <td class="disable-select">
                {{ getBallRate(item.play_id) }}
              </td>
              <td>
                <input
                  @click.stop="onClickInputReadonly(item)"
                  class="hidden-spin text-right px-1"
                  placeholder="0"
                  type="number"
                  tabindex="-1"
                  readonly
                />
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </v-layout>
  </v-layout>
</template>

<script>
import { TemaFlipCoin } from "~/models/balls-map";
export default {
  name: "BittingFlipItem",
  props: {
    selectedItems: { type: Array, default: () => [] },
    rates: { type: Object, default: () => ({}) },
  },
  computed: {
    flipCoins() {
      return TemaFlipCoin;
    },
  },
  methods: {
    onClickInputReadonly(item) {
      this.clickRow(item);
      setTimeout(() => {
        this.$refs[item.play_id][0].focus();
      }, 100);
    },
    getBallRate(play_id) {
      return this.rates[play_id] || "-";
    },
    getBallColor(item) {
      return `${this.$common.getBallColor(item)}--text`;
    },
    isSelected(playId) {
      return !!this.selectedItems.find((item) => item.play_id == playId);
    },
    clickRow(item) {
      this.$emit("click:row", item);
    },
    setItemAmount(value) {
      this.selectedItems.forEach((item) => {
        const _item = this.$refs[item.play_id]?.[0];
        if (_item) _item.value = value;
      });
    },
  },
};
</script>

<style lang="scss">
.game-item-table {
  tr.clickable {
    &:hover td {
      background-color: #f2f2f2;
    }
    &:active td {
      background-color: #cccccc;
    }
  }
}
</style>
