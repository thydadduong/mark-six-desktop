<template>
  <div>
    <Toolbar title="全国开奖网" />
    <v-card flat>
      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="tableData1"
          class="hide-horizontal-scrollbar"
          mobile-breakpoint="0"
          hide-default-footer
          no-data-text="无更多记录"
        >
          <template #[`body.append`]>
            <tr>
              <td>上周合计</td>
              <td class="text-center">1</td>
              <td class="text-center">100</td>
              <td class="text-center">100</td>
              <td class="text-center">635</td>
            </tr>
          </template>
        </v-data-table>
        <v-data-table
          :headers="tableHeaders"
          :items="tableData2"
          class="hide-horizontal-scrollbar"
          mobile-breakpoint="0"
          hide-default-footer
          hide-default-header
          no-data-text="无更多记录"
        >
          <template #[`body.append`]>
            <tr>
              <td>本周合计</td>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
              <td class="text-center">0</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "PageProfileReport",
  computed: {
    tableHeaders() {
      return [
        {
          text: "交易日期",
          value: "time",
          class: "grey lighten-2",
          sortable: false,
        },
        {
          text: "注单数",
          value: "nums",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
        {
          text: "下注金额",
          value: "amount",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
        {
          text: "有效金额",
          value: "flat",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
        {
          text: "实际结果",
          value: "real",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
      ];
    },
    tableData1() {
      return [
        {
          time: "09-26 星期一",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "09-27 星期二",
          nums: 1,
          amount: 100,
          flat: 100,
          back: 11,
          real: 635,
        },
        {
          time: "09-28 星期三",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "09-29 星期四",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "09-30 星期五",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "10-01 星期六",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "10-02 星期日",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
      ];
    },
    tableData2() {
      return [
        {
          time: "10-03 星期一",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "10-04 星期二",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "10-05 星期三",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "10-06 星期四",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "10-07 星期五",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "10-08 星期六",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
        {
          time: "10-09 星期日",
          nums: 0,
          amount: 0,
          flat: 0,
          back: 0,
          real: 0,
        },
      ];
    },
  },
};
</script>

<style></style>
