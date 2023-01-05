<template>
  <v-sheet>
    <Toolbar title="结算报表" />
    <v-card flat>
      <v-card-subtitle> 日期: {{ displayDate }}</v-card-subtitle>

      <v-data-table
        :headers="tableHeaders"
        :items="records"
        :loading="isLoading"
        :server-items-length="records.length"
        class="hide-horizontal-scrollbar"
        mobile-breakpoint="0"
        hide-default-footer
        no-data-text="无更多记录"
      >
        <template #[`item.1`]="{ item }">
          <div style="min-width: 65px">
            <span v-if="item[1] && $moment(item[1]).isValid()">
              {{ $moment(item[1]).format("HH:mm:ss") }}
            </span>
            <span v-else>{{ item[0] }}</span>
          </div>
        </template>
        <template #[`item.2`]="{ item }">
          <div style="min-width: 120px">
            {{ item[2] }}
          </div>
        </template>
        <template #[`item.4`]="{ item }">
          <div style="min-width: 40px">
            {{ item[4] }}
          </div>
        </template>
        <template #[`item.5`]="{ item }">
          <div style="min-width: 40px">
            {{ item[5] }}
          </div>
        </template>
        <template #[`body.append`]>
          <tr v-if="records.length">
            <td
              colspan="5"
              class="pa-0 text-no-wrap text--secondary text-center"
            >
              <p class="mb-2"><small> 已经到达最后一条记录 </small></p>
              <v-divider></v-divider>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <CardEmpty :visible="!records.length && isReady" />
  </v-sheet>
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
          class: "grey lighten-2 px-2 pr-4",
          cellClass: "px-2 pr-4",
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
