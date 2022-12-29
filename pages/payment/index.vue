<template>
  <v-sheet color="transparent">
    <Toolbar title="未结明细" />
    <v-card class="mx-auto" color="transparent" width="850" flat>
      <UnsettleTable />
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: "PageUnsettled",
};
</script>

<style></style>
