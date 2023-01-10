<template>
  <v-sheet>
    <v-layout>
      <v-sheet
        class="pa-2 px-1 flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      ></v-sheet>
      <v-sheet class="pa-2 px-1 game-close" color="transparent">
        <portal to="toolbarName">信用资料</portal>
        <v-sheet color="grey lighten-4">
          <v-card-title class="text--primary font-weight-bold">
            欢迎: {{ accountName }}
          </v-card-title>
          <v-card-subtitle class="text--primary">
            <h4 class="font-weight-regular">{{ tableInfo }}</h4>
          </v-card-subtitle>
        </v-sheet>

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
                v-for="(item, key) in tableRecords"
                :key="`row-${key}`"
                class="hover-table"
              >
                <td>{{ item[0] }}</td>
                <td>{{ displayNumber(item[4]) }}</td>
                <td>{{ item[1] }}</td>
                <td>{{ item[2] }}</td>
                <td>{{ item[3] }}</td>
              </tr>
              <tr v-if="tableRecords.length">
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
