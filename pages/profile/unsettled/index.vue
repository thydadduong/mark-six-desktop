<template>
  <v-sheet color="transparent">
    <Toolbar title="未结明细" />
    <v-card class="mx-auto" color="transparent" width="900" flat>
      <UnsettleTable />
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: "PageUnsettled",
  data: () => ({
    isLoading: true,
  }),
  computed: {
    tableHeaders() {
      return [
        {
          text: "日期",
          value: "0",
          class: "grey lighten-2",
          width: 120,
          sortable: false,
        },
        {
          text: "笔数",
          value: "1",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
        {
          text: "金额",
          value: "2",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
        {
          text: "盈亏",
          value: "3",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
        {
          text: "佣金",
          value: "4",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
        {
          text: "有效盈亏",
          value: "5",
          width: 100,
          class: "grey lighten-2",
          align: "center",
          sortable: false,
        },
      ];
    },
  },
};
</script>

<style></style>
