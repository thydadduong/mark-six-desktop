<template>
  <v-layout>
    <v-sheet
      class="flex-shrink-0 flex-grow-0"
      width="15rem"
      color="transparent"
    >
    </v-sheet>

    <v-sheet class="pa-2 px-1 game-close" color="transparent">
      <portal to="toolbarName">结算报表</portal>
      <v-card class="mx-auto" color="transparent" width="60rem" flat>
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
              @click="viewDetail(item)"
              class="hover-table"
            >
              <td v-if="item[0] && $moment(item[0]).isValid()">
                <span>
                  {{ $moment(item[0]).format("MM-DD") }}
                </span>
                <span>
                  {{ $moment(item[0]).format("dddd") }}
                </span>
              </td>
              <td v-else>{{ item[1] }}</td>
              <td>{{ item[1] }}</td>
              <td>{{ item[2] }}</td>
              <td>{{ item[3] }}</td>
              <td>{{ item[4] }}</td>
            </tr>
            <tr v-if="records.length">
              <td
                colspan="5"
                class="pa-0 text-no-wrap text--secondary text-center"
              >
                <p class="mb-2"><small> 已经到达最后一条记录 </small></p>
                <v-divider></v-divider>
              </td>
            </tr>
          </tbody>
        </table>
        <CardEmpty :visible="!records.length && isReady" />
      </v-card>
    </v-sheet>
  </v-layout>
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
          res.records[res.records.length - 1] = {
            ...res.records[res.records.length - 1],
            disabled: true,
          };
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
      if (item.disabled) {
        return;
      }
      const _URI = `/settled/${item[0]}`;
      this.$router.push(_URI);
    },
    displayText(text = "") {
      return text.split("(");
    },
  },
  created() {
    this.fetchDataList();
  },
};
</script>

<style>

</style>
