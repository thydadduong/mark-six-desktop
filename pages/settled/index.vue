<template>
  <v-sheet>
    <portal to="toolbarName">结算报表</portal>
    <v-card flat>
      <v-data-table
        @click:row="viewDetail"
        :headers="tableHeaders"
        :items="records"
        :loading="isLoading"
        class="hide-horizontal-scrollbar px-5"
        mobile-breakpoint="0"
        hide-default-footer
        no-data-text="无更多记录"
      >
        <!-- <template #[`item.index`]="{ item, index }">
          <v-sheet
            color="transparent"
            min-width="40"
            max-width="100"
            v-if="index < records.length - 1"
          >
            {{ index + 1 }}
          </v-sheet>
        </template> -->
        <template #[`item.0`]="{ item }">
          <v-sheet color="transparent">
            <v-layout
              class="gap-xs"
              wrap
              v-if="item[0] && $moment(item[0]).isValid()"
            >
              <span class="text-no-wrap">
                {{ $moment(item[0]).format("MM-DD") }}
              </span>
              <span class="text-no-wrap">
                {{ $moment(item[0]).format("dddd") }}
              </span>
            </v-layout>
            <span v-else>{{ item[0] }}</span>
          </v-sheet>
        </template>
        <template #[`item.1`]="{ item }">
          <v-sheet color="transparent" class="text-no-wrap">
            {{ item[1] }}</v-sheet
          >
        </template>
        <template #[`item.2`]="{ item }">
          <v-sheet color="transparent" class="text-no-wrap">
            {{ item[2] }}</v-sheet
          >
        </template>
        <template #[`item.3`]="{ item }">
          <v-sheet color="transparent" class="text-no-wrap">
            {{ item[3] }}</v-sheet
          >
        </template>
        <template #[`item.4`]="{ item }">
          <v-sheet color="transparent" class="text-no-wrap">
            {{ item[4] }}</v-sheet
          >
        </template>
        <template #[`item.5`]="{ item }">
          <v-sheet color="transparent" class="text-no-wrap">
            {{ item[5] }}</v-sheet
          >
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

      <CardEmpty :visible="!records.length && isReady" />
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: "PageUnsettled",
  data: () => ({
    records: [],
    isLoading: true,
    isReady: false,
  }),
  computed: {
    tableHeaders() {
      return [
        // {
        //   text: "序号",
        //   value: "index",
        //   class: "grey lighten-2 px-2 pl-4",
        //   cellClass: "px-2 pl-4",
        //   sortable: false,
        // },
        {
          text: "日期",
          value: "0",
          class: "grey lighten-2 px-2 pl-4",
          cellClass: "px-2 pl-4",
          sortable: false,
        },
        {
          text: "笔数",
          value: "1",
          class: "grey lighten-2 px-2",
          cellClass: "px-2",
          align: "right",
          sortable: false,
        },
        {
          text: "金额",
          value: "2",
          class: "grey lighten-2 px-2",
          cellClass: "px-2",
          align: "right",
          sortable: false,
        },
        {
          text: "盈亏",
          value: "3",
          class: "grey lighten-2 px-2",
          cellClass: "px-2",
          align: "right",
          sortable: false,
        },
        {
          text: "佣金",
          value: "4",
          class: "grey lighten-2 px-2 pr-4",
          cellClass: "px-2 pr-4",
          align: "right",
          sortable: false,
        },
        // {
        //   text: "有效盈亏",
        //   value: "5",
        //   class: "grey lighten-2 px-2 pr-4",
        //   cellClass: "px-2 pr-4",
        //   align: "right",
        //   sortable: false,
        // },
      ];
    },
  },
  methods: {
    fetchDataList() {
      const options = {
        params: {
          UID: this.$cookiz.get("m6_uid"),
          r: Math.random().toFixed(16),
        },
      };
      this.$axios
        .$get("/api-base/Settled", options)
        .then((res) => {
          this.records = res.records.length
            ? res.records.map((item) => ({ ...item }))
            : [];
        })
        .finally(() => {
          this.isLoading = false;
          this.isReady = true;
        });
    },
    viewDetail(item) {
      const _URI = `/settled/${item[0]}`;
      this.$router.push(_URI);
    },
  },
  created() {
    this.fetchDataList();
  },
};
</script>

<style></style>
