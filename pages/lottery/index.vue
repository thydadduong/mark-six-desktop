<template>
  <v-sheet>
    <Toolbar title="开奖结果" />

    <v-layout>
      <v-sheet
        class="pa-2 px-1 flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      >
      </v-sheet>
      <v-sheet class="pa-2 px-1 flex-fill" color="transparent">
        <v-sheet width="1000">
          <table class="table-result">
            <thead>
              <tr class="text-center">
                <th class="table-result__date">日期</th>
                <th class="table-result__id">ID</th>
                <th class="table-result__ball">号码</th>
                <th class="table-result__ball1" colspan="3">总和</th>
                <th class="table-result__ball2" colspan="4">特码</th>
                <th class="table-result__tail">尾数量</th>
                <th class="table-result__animal">生肖量</th>
                <!-- <th class="d-md-none table-result__balls">
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
                </th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in records" :key="`row-${key}`">
                <td class="table-result__date">
                  {{ $moment(item.date).format("YYYY-MM-DD") }}
                </td>
                <td class="pa-2 px-1 table-result__id">
                  {{ item.issue_id }}
                </td>
                <td class="table-result__ball">
                  <v-layout class="gap-sm justify-center">
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
                <td>
                  {{ item.sum }}
                </td>
                <td :class="ballTextColor(item.sum_even_odd)">
                  {{ item.sum_even_odd }}
                </td>
                <td :class="ballTextColor(item.sum_big_small)">
                  {{ item.sum_big_small }}
                </td>
                <td :class="ballTextColor(item.ball7)">
                  {{ item.ball7 }}
                </td>
                <td :class="ballTextColor(item.ball7_even_odd)">
                  {{ item.ball7_even_odd }}
                </td>
                <td :class="ballTextColor(item.ball7_big_small)">
                  {{ item.ball7_big_small }}
                </td>
                <td :class="ballTextColor(item.ball7_digit_sum_even_odd)">
                  {{ item.ball7_digit_sum_even_odd }}
                </td>
                <td :class="ballTextColor(item.ball7_digit_sum_even_odd)">
                  {{ item.individual_animal_count }}
                </td>
                <td :class="ballTextColor(item.ball7_digit_sum_even_odd)">
                  {{ item.individual_tail_count }}
                </td>
                <!-- <td class="pa-2 table-result__balls d-md-none pr-4">
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
                </td> -->
              </tr>
            </tbody>
          </table>
        </v-sheet>
      </v-sheet>
    </v-layout>
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

<style lang="scss">
.table-result {
  width: 100%;
  border-collapse: collapse;
  thead tr {
    background-color: #1976d222;
    th {
      padding: 0.5rem;
      font-size: 14px !important;
      font-weight: 400;
      letter-spacing: 0.03125em !important;
      line-height: 1.5rem;
      font-family: "Roboto", sans-serif !important;
    }
  }

  tr th,
  tr td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 0.125rem 0.125rem;
    min-width: 50px;
  }
  tbody tr td {
    font-size: 14px;
    font-weight: normal;
  }

  .table-result__date {
    width: 90px;
  }
  .table-result__id {
    width: 48px;
  }
}
</style>
