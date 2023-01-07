<template>
  <div class="text-right">
    <p class="pa-2 ma-0 body-2">
      <span class="pr-2">单注最小:{{ getItemRestrict.min_single }}, </span>
      <span class="pr-2">单注最大: {{ getItemRestrict.max_single }}, </span>
      <span>单期最大:{{ getItemRestrict.max_total }}</span>
    </p>
    <v-sheet height="8"></v-sheet>
  </div>
</template>
<script>
export default {
  name: "getItemRestrict",
  props: {
    getItemRestrict: Object,
  },
};
</script>
<style lang=""></style>
