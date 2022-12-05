<template>
  <v-sheet>
    <Toolbar title="开奖结果" />
    <v-simple-table class="table-result hide-horizontal-scrollbar">
      <template v-slot:default>
        <thead>
          <tr class="text-center">
            <th
              class="px-1 pl-4 grey lighten-2 table-result__date"
              style="min-width: 80px"
            >
              日期
            </th>
            <th
              class="px-1 grey lighten-2 table-result__id"
              style="min-width: 45px"
            >
              ID
            </th>
            <th
              class="px-1 grey lighten-2 d-none d-md-table-cell"
              style="width: 350px"
            >
              号码
            </th>
            <th class="px-2 grey lighten-2 d-none d-md-table-cell">总和</th>
            <th class="px-2 grey lighten-2 d-none d-md-table-cell">特码</th>
            <th class="px-1 grey lighten-2 d-md-none table-result__balls">
              <v-layout justify-center>
                <v-chip-group
                  v-model="showColumn"
                  active-class="primary--text"
                  mandatory
                >
                  <v-chip
                    v-for="(item, key) in chipHeaders"
                    :key="`option-${key}`"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </v-chip>
                </v-chip-group>
              </v-layout>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in records" :key="`row-${key}`">
            <td class="pa-2 px-1 pl-4 table-result__date">
              <v-layout>
                <span>{{ $moment(item.date).format("Mo") }} </span>
                <span>{{ $moment(item.date).format("Do") }} </span>
              </v-layout>
            </td>
            <td class="pa-2 px-1 table-result__id">
              <span>
                {{ item.issue_id }}
              </span>
            </td>
            <td class="pa-2 table-result__balls d-none d-md-table-cell pr-4">
              <v-layout class="gap-sm">
                <div
                  v-for="(ball, idx) in 6"
                  :key="`row-ball-${idx}`"
                  class="text-center d-flex align-center gap-xs"
                >
                  <v-sheet
                    :color="$common.getBallColor(item['ball' + ball])"
                    class="d-flex justify-center align-center mb-1"
                    rounded="circle"
                    width="25"
                    height="25"
                    dark
                  >
                    {{ item["ball" + ball] }}
                  </v-sheet>
                  <p class="mb-0">{{ item.animals[ball - 1] }}</p>
                </div>
                <div class="py-1 px-0">+</div>
                <div class="text-center d-flex align-center gap-xs">
                  <v-sheet
                    class="d-flex justify-center align-center mb-1"
                    rounded="circle"
                    width="25"
                    height="25"
                    color="red"
                    dark
                  >
                    {{ item["ball7"] }}
                  </v-sheet>
                  <p class="mb-0">{{ item.animals[7] }}</p>
                </div>
              </v-layout>
            </td>
            <td class="pa-0 table-result__balls d-none d-md-table-cell pr-4">
              <v-layout class="gap pa-2">
                <div class="flex-fill">{{ item.sum }}</div>
                <div
                  class="flex-fill"
                  :class="ballTextColor(item.sum_even_odd)"
                >
                  {{ item.sum_even_odd }}
                </div>
                <div
                  class="flex-fill"
                  :class="ballTextColor(item.sum_big_small)"
                >
                  {{ item.sum_big_small }}
                </div>
              </v-layout>
            </td>
            <td class="pa-2 table-result__balls d-none d-md-table-cell pr-4">
              <v-layout class="gap">
                <div
                  style="min-width: 3rem"
                  class="flex-fill"
                  :class="ballTextColor(item.ball7)"
                >
                  {{ item.ball7 }}
                </div>
                <div
                  class="flex-fill text-right"
                  :class="ballTextColor(item.ball7_even_odd)"
                >
                  {{ item.ball7_even_odd }}
                </div>
                <div
                  class="flex-fill text-right"
                  :class="ballTextColor(item.ball7_big_small)"
                >
                  {{ item.ball7_big_small }}
                </div>
                <div
                  class="flex-fill text-right"
                  :class="ballTextColor(item.ball7_digit_sum_even_odd)"
                >
                  {{ item.ball7_digit_sum_even_odd }}
                </div>
              </v-layout>
            </td>
            <td class="pa-2 table-result__balls d-md-none pr-4">
              <div style="min-height: 3rem" class="d-flex align-center">
                <v-layout v-if="isShowNumber" class="gap-xs" justify-center>
                  <div
                    v-for="(ball, idx) in 6"
                    :key="`row-ball-${idx}`"
                    class="d-flex flex-column align-center gap-xs"
                  >
                    <v-sheet
                      :color="$common.getBallColor(item['ball' + ball])"
                      class="d-flex justify-center align-center"
                      rounded="circle"
                      width="25"
                      height="25"
                      dark
                    >
                      {{ item["ball" + ball] }}
                    </v-sheet>
                    <p class="mb-0">{{ item.animals[ball - 1] }}</p>
                  </div>
                  <div class="py-1 px-0">+</div>
                  <div class="d-flex flex-column align-center gap-xs">
                    <v-sheet
                      class="d-flex justify-center align-center"
                      rounded="circle"
                      width="25"
                      height="25"
                      color="red"
                      dark
                    >
                      {{ item["ball7"] }}
                    </v-sheet>
                    <p class="mb-0">{{ item.animals[7] }}</p>
                  </div>
                </v-layout>
                <v-layout v-if="isShowSum" class="gap">
                  <div class="px-2 flex-fill">{{ item.sum }}</div>
                  <div
                    class="px-2 flex-fill"
                    :class="ballTextColor(item.sum_even_odd)"
                  >
                    {{ item.sum_even_odd }}
                  </div>
                  <div
                    class="px-2 flex-fill"
                    :class="ballTextColor(item.sum_big_small)"
                  >
                    {{ item.sum_big_small }}
                  </div>
                </v-layout>
                <v-layout
                  v-if="isShowSpecialNumber"
                  class="gap justify-space-between text-center"
                >
                  <div
                    style="min-width: 3rem"
                    class="flex-fill text-right"
                    :class="ballTextColor(item.ball7)"
                  >
                    {{ item.ball7 }}
                  </div>
                  <div
                    class="flex-fill text-right"
                    :class="ballTextColor(item.ball7_even_odd)"
                  >
                    {{ item.ball7_even_odd }}
                  </div>
                  <div
                    class="flex-fill text-right"
                    :class="ballTextColor(item.ball7_big_small)"
                  >
                    {{ item.ball7_big_small }}
                  </div>
                  <div
                    class="flex-fill text-right"
                    :class="ballTextColor(item.ball7_digit_sum_even_odd)"
                  >
                    {{ item.ball7_digit_sum_even_odd }}
                  </div>
                </v-layout>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-sheet>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "PageLottery",
  data: () => ({
    chipHeaders: [
      { text: "号码", value: "number" },
      { text: "总和", value: "sum" },
      { text: "特码", value: "special-number" },
    ],
    showColumn: "number",
  }),
  computed: {
    ...mapState("lottery", ["records", "isLoading"]),
    isShowSum() {
      return "sum" == this.showColumn;
    },
    isShowNumber() {
      return "number" == this.showColumn;
    },
    isShowSpecialNumber() {
      return "special-number" == this.showColumn;
    },
  },
  methods: {
    ...mapActions("lottery", ["fetchResultHistories"]),
    ballTextColor(ball) {
      if (["大", "雙", "合雙"].includes(ball)) return "error--text";
      if (["小", "單", "合單"].includes(ball)) return "primary--text";
      return this.$common.getBallColor(ball) + "--text";
    },
  },
  created() {
    this.fetchResultHistories({});
  },
};
</script>

<style lang="sass">
.table-result
  border-collapse: collapse

td > span, td > div
  font-size: .8rem
</style>
