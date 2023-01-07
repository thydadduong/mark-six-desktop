<template>
  <v-sheet>
    <v-layout>
      <v-sheet
        class="pa-2 px-1 flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      ></v-sheet>
      <v-sheet class="pa-2 px-1 game-close" width="60rem" color="transparent">
        <Toolbar title="信用资料" />
        <v-sheet color="grey lighten-4">
          <v-card-title class="text--primary font-weight-bold">
            欢迎: {{ accountName }}
          </v-card-title>
          <v-card-subtitle class="text--primary">
            <h4 class="font-weight-regular">{{ tableInfo }}</h4>
          </v-card-subtitle>
        </v-sheet>
        <v-card flat>
          <v-divider></v-divider>
          <v-data-table
            :headers="tableHeaders"
            :items="tableRecords"
            :items-per-page="tableRecords.length"
            class="hide-horizontal-scrollbar table-unsettle"
            height="calc(100vh - 12.5rem)"
            mobile-breakpoint="0"
            fixed-header
            hide-default-footer
            no-data-text="无更多记录"
          >
            <template #[`item.typeKey`]="{ item }">
              <v-sheet min-width="50" color="transparent">
                {{ getKeyTypeText(item.typeKey) }}
              </v-sheet>
            </template>
            <template #[`item.4`]="{ item }">
              <v-sheet min-width="50" color="transparent">
                {{ displayNumber(item[4]) }}
              </v-sheet>
            </template>
          </v-data-table>
        </v-card>
      </v-sheet>
    </v-layout>
  </v-sheet>
</template>

<script>
import { KeyTypesCredits } from "~/models/map-key-names";
import { mapActions, mapState } from "vuex";

export default {
  name: "PageProfileCredit",
  computed: {
    ...mapState("profile", ["basicItem", "gameTable"]),
    tableInfo() {
      return [this.gameTable.current_table, "盘盘口"].join("");
    },
    accountName() {
      return this.basicItem.basic?.account;
    },
    tableHeaders() {
      return [
        {
          text: "项目",
          value: "0",
          class: "grey lighten-2",
          sortable: false,
        },
        {
          text: "退水‱",
          value: "4",
          class: "grey lighten-2 px-2",
          cellClass: "px-2",
          align: "right",
          sortable: false,
        },
        {
          text: "注单最低",
          value: "1",
          class: "grey lighten-2 text-no-wrap px-2",
          cellClass: "px-2",
          align: "right",
          sortable: false,
        },
        {
          text: "注单最高",
          value: "2",
          class: "grey lighten-2 text-no-wrap px-2",
          cellClass: "px-2",
          align: "right",
          sortable: false,
        },
        {
          text: "单项限额",
          value: "3",
          class: "grey lighten-2 text-no-wrap px-2 pr-4",
          cellClass: "px-2 pr-4",
          align: "right",
          sortable: false,
        },
      ];
    },
    tableRecords() {
      if (!this.basicItem?.items) return [];
      return this.basicItem?.items.map((item) => ({ ...item }));
    },
  },
  methods: {
    ...mapActions("profile", ["fetchBasicItem"]),
    getKeyTypeText(key) {
      return KeyTypesCredits[key] || key;
    },
    displayNumber(value) {
      if (isNaN(value)) return "-";
      return (value * 100).toFixed(2);
    },
    displayText(text = "") {
      return text.split("(");
    },
  },
  mounted() {
    this.fetchBasicItem();
  },
};
</script>

<style></style>
