<template>
  <v-container>
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
        <tr v-for="(item, key) in records" :key="`row-${key}`">
          <td>
            <span v-if="key < records.length - 1">
              {{ key + 1 }}
            </span>
          </td>
          <td>
            <span v-if="item[0] && $moment(item[0]).isValid()">
              {{ $moment(item[0]).format("HH:mm:ss") }}
            </span>
            <span v-else>{{ item[0] }}</span>
          </td>
          <td>
            <v-layout class="gap-xs text-center" column justify-center>
              <span>{{ displayItemName(item[1]).first }}</span>
              <span class="primary--text">{{
                displayItemName(item[1]).second
              }}</span>
            </v-layout>
          </td>
          <td>{{ item[2] }}</td>
          <td>{{ item[3] }}</td>
        </tr>

        <tr v-if="showLastItem">
          <td colspan="5" class="pa-0 text-no-wrap text--secondary text-center">
            <p class="mb-2"><small> 已经到达最后一条记录 </small></p>
          </td>
        </tr>
        <tr v-if="!records.length">
          <td colspan="5" class="pa-0 text-no-wrap text--secondary text-center">
            <p class="mb-2"><small> 无更多记录 </small></p>
          </td>
        </tr>

        <tr>
          <td colspan="5">
            <v-layout v-if="totalPage >= 1" justify-end>
              <v-pagination
                v-model="currentPage"
                @input="onPaginationInput"
                :length="totalPage"
                :total-visible="5"
              ></v-pagination>
            </v-layout>
          </td>
        </tr>
      </tbody>
    </table>

    <CardEmpty :visible="!totalPage && isReady" />

    <v-layout justify-center>
      <v-expand-transition>
        <div v-if="gameClosed">
          <v-card min-width="20rem" class="py-8" flat>
            <v-img class="mx-auto" src="/svg/no_data.svg" max-width="150" />
          </v-card>
        </div>
      </v-expand-transition>
    </v-layout>
    <DialogGameTimeout
      :visible.sync="bittingClosed"
      :action-title="$t('dialog.button.close')"
      :persistent="false"
      title="暂停销售"
      message="请选择其他彩种进行游戏"
    />
  </v-container>
</template>

<script>
export default {
  name: "UnsettleTable",
  data: () => ({
    records: [],
    isLoading: false,
    totalPage: 0,
    isReady: false,
    currentPage: 1,
    bittingClosed: false,
    gameClosed: false,
  }),
  computed: {
    showLastItem() {
      return this.isReady && this.totalPage == this.currentPage;
    },
    tableHeaders() {
      return [
        {
          text: "序号",
          value: "index",
          class: "grey lighten-2 px-1 pl-4",
          cellClass: "px-1 pl-4",
          sortable: false,
        },
        {
          text: "时间",
          value: "0",
          class: "grey lighten-2 px-1",
          cellClass: "px-1",
          sortable: false,
        },
        {
          text: "项目",
          value: "1",
          class: "grey lighten-2 px-1 text-center",
          cellClass: "px-1",
          sortable: false,
        },
        {
          text: "赔率",
          value: "2",
          class: "grey lighten-2 px-1 text-center",
          cellClass: "px-1",
          sortable: false,
        },
        {
          text: "金额",
          value: "3",
          class: "grey lighten-2 px-1 pr-4",
          cellClass: "px-1 pr-4",
          align: "right",
          sortable: false,
        },
      ];
    },
  },
  methods: {
    fetchDataList() {
      const options = {
        params: {
          UID: this.$cookiz.get("m6_uid"),
          r: Math.random().toFixed(16),
          page: this.currentPage,
        },
      };
      this.$axios
        .$get("/api-base/UnSettled", options)
        .then((res) => {
          if (res.code === 0) {
            const _data = res.unsettled?.data || [];
            this.records = _data.map((item) => ({ ...item }));
            this.totalPage = res.unsettled?.total_page || 0;
          }
        })
        .finally(() => {
          this.isLoading = false;
          this.isReady = true;
        });
    },
    displayItemName(name = "") {
      let sName = name.split("(");
      return { first: sName[0], second: !!sName[1] ? `(${sName[1]}` : "" };
    },

    getCloseTime() {
      this.gameClosed = false;
      const uid = this.$cookiz.get("m6_uid");
      const r = Math.random().toFixed(16);
      const response = this.$axios.$get("/api-base/GetCloseTime", {
        params: { uid, r },
      });
      response
        .then((r) => {
          console.log(r);
        })
        .catch((err) => {
          console.log(err);
        });
      return response;
    },
    onPaginationInput() {
      setTimeout(() => {
        this.fetchDataList();
      }, 10);
    },
  },
  mounted() {
    this.getCloseTime()
      .then((res) => {
        console.log(res);
        console.log(!res?.code && !!res?.seconds);
        if (!res?.code && !!res?.seconds) this.fetchDataList();
        else {
          this.bittingClosed = true;
          this.gameClosed = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>

<style lang="scss">
.table-unsettle {
  width: 100%;
  border-collapse: collapse;
  thead tr {
    background-color: #1976d222;
    th:nth-last-child(2),
    th:first-child,
    th:last-child {
      width: 100px;
    }
  }

  tr th,
  tr td {
    text-align: center;
    border: 1px solid #ccc;
    padding: 0.125rem 0.125rem;
  }
  tbody tr td {
    font-size: 14px;
    font-weight: normal;
  }
}
</style>
