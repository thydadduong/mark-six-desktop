<template>
  <v-sheet color="transparent">
    <Toolbar title="未结明细" />
    <v-layout>
      <v-sheet
        class="pa-2 px-1 flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      >
      </v-sheet>
      <v-sheet class="pa-2 px-1 flex-fill" color="transparent">
        <UnsettleTable />
      </v-sheet>
    </v-layout>
  </v-sheet>
</template>

<script>
export default {
  name: "PageUnsettled",
};
</script>

<style></style>
