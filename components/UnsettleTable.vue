<template>
  <v-container>
    <v-data-table
      v-if="!!totalPage && isReady"
      :headers="tableHeaders"
      :items="records"
      :loading="isLoading"
      :server-items-length="records.length"
      class="hide-horizontal-scrollbar"
      mobile-breakpoint="0"
      hide-default-footer
      no-data-text="无更多记录"
    >
      <template #[`item.index`]="{ item, index }">
        <v-sheet
          color="transparent"
          min-width="30"
          max-width="100"
          v-if="index < records.length - 1"
        >
          {{ index + 1 }}
        </v-sheet>
      </template>
      <template #[`item.0`]="{ item }">
        <v-sheet color="transparent" min-width="40">
          <span v-if="item[0] && $moment(item[0]).isValid()">
            {{ $moment(item[0]).format("HH:mm:ss") }}
          </span>
          <span v-else>{{ item[0] }}</span>
        </v-sheet>
      </template>
      <template #[`item.1`]="{ item }">
        <v-sheet color="transparent" min-width="100" class="text-break">
          <v-layout class="gap-xs text-center" column justify-center>
            <span>{{ displayItemName(item[1]).first }}</span>
            <span class="primary--text">{{
              displayItemName(item[1]).second
            }}</span>
          </v-layout>
        </v-sheet>
      </template>
      <template #[`item.2`]="{ item }">
        <div class="text-break text-center">
          {{ item[2] }}
        </div>
      </template>
      <template #[`item.3`]="{ item }">
        <v-sheet color="transparent" min-width="50">
          {{ item[3] }}
        </v-sheet>
      </template>
      <template #[`body.append`] v-if="showLastItem">
        <tr>
          <td colspan="5" class="pa-0 text-no-wrap text--secondary text-center">
            <p class="mb-2"><small> 已经到达最后一条记录 </small></p>
            <v-divider></v-divider>
          </td>
        </tr>
      </template>
    </v-data-table>
    <CardEmpty :visible="!totalPage && isReady" />
    <v-layout v-if="totalPage >= 2" class="pt-4" justify-end>
      <v-pagination
        v-model="currentPage"
        @input="onPaginationInput"
        :length="totalPage"
        :total-visible="5"
      ></v-pagination>
    </v-layout>

    <v-layout justify-center>
      <v-expand-transition>
        <div v-if="gameClosed">
          <div class="pt-16">
            <v-img src="/svg/no_data.svg" max-width="150" />
          </div>
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
      return this.$axios.$get("/api-base/GetCloseTime", { params: { uid, r } });
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
        if (!res) {
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

<style></style>
