<template>
  <v-row dense>
    <v-col
      v-for="(item, key) in gridItems"
      :key="`lucky-number-${key}`"
      cols="6"
    >
      <table class="game-item-table disable-select">
        <tbody>
          <tr
            v-for="subitem in item"
            :key="`lucky-number-item-${key}-${subitem.play_id}`"
            @click="toggleSelectItem(subitem)"
          >
            <template v-if="isActive(subitem.value)">
              <td class="primary white--text">{{ subitem.name }}</td>
              <td class="primary text-left px-4">
                <v-avatar
                  v-for="(ball, index) in subitem.balls"
                  :key="`ball-${key}-${subitem.play_id}-${index}`"
                  class="mr-1 mb-1"
                  color="white"
                  size="26"
                >
                  <small class="font-weight-bold">
                    {{ ball.label || "-" }}
                  </small>
                </v-avatar>
              </td>
              <td class="primary white--text">
                {{ getBallRate(subitem.play_id) }}
              </td>
              <td class="primary">
                <input
                  @click.stop="() => {}"
                  :ref="subitem.play_id"
                  :id="subitem.play_id"
                  :name="subitem.play_id"
                  class="text-right px-1 hidden-spin"
                  placeholder="0"
                  type="number"
                />
              </td>
            </template>
            <template v-else>
              <td class="game-table-animal__label">
                {{ subitem.name }}
              </td>
              <td class="text-left px-4">
                <v-avatar
                  v-for="(ball, index) in subitem.balls"
                  :key="`ball-${key}-${subitem.play_id}-${index}`"
                  :color="$common.getBallColor(ball.value)"
                  class="white--text mr-1 mb-1"
                  size="26"
                >
                  <small class="font-weight-bold">
                    {{ ball.label || "-" }}
                  </small>
                </v-avatar>
              </td>
              <td>{{ getBallRate(subitem.play_id) }}</td>
              <td>
                <input
                  @click.stop="toggleSelectItem(subitem)"
                  placeholder="0"
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
    gridItems: { type: Array, default: () => [] },
    selectedList: { type: Array, default: () => [] },
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
        if (_item) _item.value = value;
      });
    },
    getBallRate() {
      return 12;
    },
    toggleSelectItem(item) {
      this.$emit("toggle-item", item);
    },
  },
};
</script>

<style></style>
