<template>
  <div class="shortcut-49">
    <v-layout wrap>
      <template v-for="item in shortcutOptions">
        <v-sheet
          v-if="isSelected(item)"
          @click="clickItem(item)"
          :key="`ball-selected-${item}`"
          :class="$common.getBallColor(item)"
          class="shortcut-49--item selected"
          width="20%"
        >
          {{ $common.getNumberLabel(item) }}
        </v-sheet>
        <v-sheet
          v-else
          @click="clickItem(item)"
          :key="`ball-${item}`"
          :class="getBallColor(item)"
          class="shortcut-49--item"
          width="20%"
        >
          {{ $common.getNumberLabel(item) }}
        </v-sheet>
      </template>
    </v-layout>
  </div>
</template>

<script>
import { Items49 } from "~/models/balls-map";
export default {
  name: "Shortcut49",
  props: {
    disabled: Boolean,
    selectedItems: { type: Array, default: () => [] },
  },
  computed: {
    shortcutOptions() {
      return Items49;
    },
  },
  methods: {
    getBallColor(item) {
      return `${this.$common.getBallColor(item)}--text `;
    },
    isSelected(item) {
      return this.selectedItems.includes(item);
    },
    clickItem(item) {
      if (this.disabled) return
      this.$emit("click:item", item);
    },
  },
};
</script>

<style lang="scss">
.shortcut-49 {
  padding-top: 6px;
  padding-left: 6px;
  padding-bottom: 6px;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .shortcut-49--item {
    border: 1px solid #ccc;
    text-align: center;
    margin-left: -1px;
    margin-top: -1px;
    font-weight: bolder;
    padding: 4px;
    cursor: pointer;

    &.selected {
      color: white;
    }

    &:active {
      opacity: 0.75;
      border-radius: 4px;
    }
  }
}
</style>
