<template>
  <v-layout class="gap-xs">
    <table class="game-item-table banbo-game disable-select">
      <thead>
        <tr>
          <th class="primary--text game-item-table__title">半波</th>
          <th class="primary--text game-item-table__rate">赔率</th>
          <th class="primary--text game-item-table__balls">号码</th>
          <th class="primary--text game-item-table__input"></th>
        </tr>
      </thead>

      <tr
        v-for="item in gridItems"
        :key="`item-${item.play_id}`"
        @click="toggleSelectItem(item)"
        class="cursor-pointer"
      >
        <template v-if="isActive(item.play_id)">
          <td class="game-item-table__title primary white--text">
            {{ item.name }}
          </td>
          <td class="game-item-table__rate primary white--text">
            {{ getBallRate(item.play_id) }}
          </td>
          <td class="game-item-table__balls primary white--text">
            <v-avatar
              v-for="(ball, index) in item.balls"
              :key="`ball-${item.play_id}-${index}`"
              :class="`${$common.getBallColor(ball)}--text`"
              class="mr-1 mb-1"
              color="white"
              size="26"
            >
              {{ ball }}
            </v-avatar>
          </td>
          <td class="game-item-table__input primary">
            <input
              @keypress="preventNonNumericalInput"
              @click.stop="() => {}"
              :disabled="disabled"
              :ref="item.play_id"
              :id="item.play_id"
              :name="item.play_id"
              class="text-right px-1 hidden-spin"
              type="number"
            />
          </td>
        </template>
        <template v-else>
          <td class="game-item-table__title primary--text">{{ item.name }}</td>
          <td class="game-item-table__rate">{{ getBallRate(item.play_id) }}</td>
          <td class="game-item-table__balls">
            <v-avatar
              v-for="ball in item.balls"
              :key="`ball-${item.play_id}-${ball}`"
              :color="$common.getBallColor(ball)"
              class="white--text mr-1 mb-1"
              size="26"
            >
              {{ ball }}
            </v-avatar>
          </td>
          <td class="game-item-table__input">
            <input
              @click.stop="toggleSelectItem(item)"
              :disabled="disabled"
              class="text-right px-1"
              tabindex="-1"
              readonly
            />
          </td>
        </template>
      </tr>
    </table>
  </v-layout>
</template>

<script>
export default {
  name: "PickItemBanbo",
  props: {
    disabled: Boolean,
    rates: { type: Object, default: () => ({}) },
    gridItems: { type: Array, default: () => [] },
    selectedItems: { type: Array, default: () => [] },
  },
  computed: {},
  methods: {
    isActive(id) {
      return !!this.selectedItems.find((item) => item.play_id == id);
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

<style lang="scss">
.game-item-table.banbo-game {
  .game-item-table__balls {
    text-align: left;
  }

  .game-item-table__rate,
  .game-item-table__title {
    width: 100px;
  }

  thead th {
    border: 1px solid #ccc;
    background: #dae8fc;
    font-weight: bold;
    padding: 8px 4px;
  }
}
</style>
