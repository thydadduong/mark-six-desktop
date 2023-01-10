<template>
  <v-layout
    ><v-sheet
      class="flex-shrink-0 flex-grow-0"
      width="15rem"
      color="transparent"
    >
    </v-sheet>
    <v-sheet>
      <portal to="toolbarName">结算报表 日期:{{ displayDate }}</portal>
      <v-card class="mx-auto pt-2" color="transparent" width="60rem" flat>
        <table class="table-unsettle">
          <thead>
            <tr>
              <th
                v-for="(header, key) in tableHeaders"
                :key="`thead-${key}`"
                class="body-1"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, key) in records"
              :key="`row-${key}`"
              class="hover-table"
            >
              <td>
                <span v-if="item[1] && $moment(item[1]).isValid()">
                  {{ $moment(item[1]).format("HH:mm:ss") }}
                </span>
                <span v-else>{{ item[0] }}</span>
              </td>
              <td>{{ item[2] }}</td>
              <td>{{ item[3] }}</td>
              <td>{{ item[6] }}</td>
              <td>{{ item[4] }}</td>
              <td>{{ item[5] }}</td>
              <td>{{ item[7] }}</td>
            </tr>
            <tr v-if="records.length">
              <td
                colspan="7"
                class="pa-0 text-no-wrap text--secondary text-center"
              >
                <p class="mb-2"><small> 已经到达最后一条记录 </small></p>
                <v-divider></v-divider>
              </td>
            </tr>
          </tbody>
        </table>
        <CardEmpty :visible="!records.length && isReady" />
      </v-card> </v-sheet
  ></v-layout>
</template>

<script>
export default {
  name: "PageSettlementDetail",
  data() {
    return {
      isLoading: false,
      records: [],
      isReady: false,
    };
  },
  computed: {
    tableHeaders() {
      return [
        {
          text: "时间",
          value: "1",
          class: "grey lighten-2 px-2 pl-4",
          cellClass: "px-2 pl-4",
          sortable: false,
        },
        {
          text: "项目",
          class: "grey lighten-2 px-2",
          cellClass: "px-2",
          value: "2",
          sortable: false,
        },
        {
          text: "赔率",
          class: "grey lighten-2 px-2",
          cellClass: "px-2",
          value: "3",
          sortable: false,
        },
        {
          text: "退水",
          class: "grey lighten-2 px-2",
          cellClass: "px-2",
          value: "6",
          sortable: false,
        },
        {
          text: "金额",
          value: "4",
          class: "grey lighten-2 px-2",
          cellClass: "px-2",
          align: "right",
          sortable: false,
        },
        {
          text: "盈亏",
          value: "5",
          class: "grey lighten-2 px-2 ",
          cellClass: "px-2 ",
          align: "right",
          sortable: false,
        },
        {
          text: "总盈亏",
          value: "7",
          class: "grey lighten-2 px-2",
          cellClass: "px-2 ",
          align: "right",
          sortable: false,
        },
      ];
    },
    displayDate() {
      const _date = this.$route.params.dateSettlement;
      return !_date ? "d" : this.$moment(_date).format("YYYY-MM-DD");
    },
  },
  mounted() {
    this.isLoading = true;
    const options = {};
    options.params = {
      UID: this.$cookiz.get("m6_uid"),
      sdate: this.$route.params.dateSettlement,
    };
    this.$axios
      .$get("/api-base/Settled/Details", options)
      .then((res) => {
        this.records = res.records.length
          ? res.records
              .slice(0, res.records.length - 1)
              .map((item) => ({ ...item }))
          : [];
      })
      .finally(() => {
        this.isLoading = false;
        this.isReady = true;
      });
  },
};
</script>

<style></style>
