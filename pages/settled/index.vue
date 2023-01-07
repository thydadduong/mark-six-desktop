<template>
  <v-layout>
    <v-sheet
      class="pa-2 px-1 flex-shrink-0 flex-grow-0"
      width="15rem"
      color="transparent"
    >
      <v-card :loading="loadingBet" elevation="1" tile>
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text pa-1 text-center"
        >
          最新注单
        </v-card-text>
        <v-divider></v-divider>
        <!-- <v-card-text
            style="background: linear-gradient(0deg, #dae8fc, #fff)"
            class="primary--text pa-1"
          >
            未结金额：0
          </v-card-text> -->
        <v-card-text v-if="!recentBets.length">
          <v-layout justify-center class="py-8">
            <v-card rounded="circle" outlined>
              <v-avatar size="100">
                <v-icon class="grey--text text--lighten-1" size="36">
                  mdi-file-document-outline
                </v-icon>
              </v-avatar>
            </v-card>
          </v-layout>
        </v-card-text>
        <v-list dense>
          <template v-for="([date, item, amount], key) in recentBets">
            <v-list-item :key="`item-${key}`" class="px-2 align-start">
              <v-list-item-action class="body-2 mr-2 my-1 mb-auto">
                {{ date }}
              </v-list-item-action>
              <v-list-item-content class="py-1 gap-xs text-center my-1 mb-auto">
                <small>{{ displayText(item)[0] }}</small>
                <small v-if="displayText(item)[1]">
                  ({{ displayText(item)[1] }}
                </small>
              </v-list-item-content>
              <v-list-item-action class="body-2 ml-2 my-1 mb-auto">
                {{ amount }}
              </v-list-item-action>
            </v-list-item>
            <v-divider
              :key="`item-divider-${key}`"
              v-if="recentBets.length - 1 > key"
            ></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-sheet>

    <v-sheet class="pa-2 px-1 game-close" width="60rem" color="transparent">
      <portal to="toolbarName">结算报表</portal>
      <v-card flat>
        <v-data-table
          @click:row="viewDetail"
          :headers="tableHeaders"
          :items="records"
          :loading="isLoading"
          class="hide-horizontal-scrollbar"
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
  </v-layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "PageUnsettled",
  data: () => ({
    records: [],
    isLoading: true,
    isReady: false,
  }),
  computed: {
    ...mapState("lottery", ["loadingBet", "recentBets"]),
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
    displayText(text = "") {
      return text.split("(");
    },
  },
  created() {
    this.fetchDataList();
  },
};
</script>

<style></style>
