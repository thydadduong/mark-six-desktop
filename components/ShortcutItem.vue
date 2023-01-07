<template>
  <div class="shortcut">
    <v-layout wrap>
      <template v-for="item in colorOptions">
        <v-sheet
          v-if="isSelected(item)"
          @click="clickItem(item)"
          :key="`ball-selected-${item.value}`"
          color="primary"
          class="shortcut--item selected"
          width="25%"
        >
          {{ item.label }}
        </v-sheet>
        <v-sheet
          v-else
          @click="clickItem(item)"
          :key="`ball-${item.value}`"
          class="shortcut--item"
          width="25%"
        >
          {{ item.label }}
        </v-sheet>
      </template>
    </v-layout>
  </div>
</template>

<script>
import { ShortcutsItems } from "~/models/balls-map";

export default {
  name: "ShortcutItem",
  props: {
    disabled: Boolean,
    selected: String,
  },
  computed: {
    colorOptions() {
      return ShortcutsItems;
    },
  },
  methods: {
    isSelected(item) {
      return item.value == this.selected;
    },
    clickItem(item) {
      if (this.disabled) return;
      this.$emit("click:item", item);
    },
  },
};
</script>

<style lang="scss">
.shortcut {
  padding-top: 6px;
  padding-left: 6px;
  padding-bottom: 6px;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .shortcut--item {
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
