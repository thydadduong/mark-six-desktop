<template>
  <div class="shortcut-color">
    <v-layout wrap>
      <template v-for="item in colorOptions">
        <v-sheet
          v-if="isSelected(item)"
          @click="clickItem(item)"
          :key="`ball-selected-${item.value}`"
          :color="item.color"
          class="shortcut-color--item selected"
          width="calc(100% / 3)"
        >
          {{ item.label }}
        </v-sheet>
        <v-sheet
          v-else
          @click="clickItem(item)"
          :key="`ball-${item.value}`"
          :class="getBallColor(item)"
          class="shortcut-color--item"
          width="calc(100% / 3)"
        >
          {{ item.label }}
        </v-sheet>
      </template>
    </v-layout>
  </div>
</template>

<script>
import { ShortcutColors } from "~/models/balls-map";

export default {
  name: "ShortcutColor",
  props: {
    selected: String,
  },
  computed: {
    colorOptions() {
      return ShortcutColors;
    },
  },
  methods: {
    getBallColor(item) {
      return `${item.color}--text`;
    },
    isSelected(item) {
      return item.value == this.selected;
    },
    clickItem(item) {
      this.$emit("click:item", item);
    },
  },
};
</script>

<style lang="scss">
.shortcut-color {
  padding-top: 6px;
  padding-left: 6px;
  padding-bottom: 6px;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .shortcut-color--item {
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
