<template>
  <v-sheet>
    <Toolbar title="系统公告" />
    <v-layout column>
      <v-card flat v-for="(item, index) in dataList" :key="`item-${index}`">
        <v-card-subtitle class="text--primary pb-1 pt-2">
          {{ item.title }}
        </v-card-subtitle>
        <v-card-text class="pb-1">{{ item.content }} </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-layout>
  </v-sheet>
</template>

<script>
export default {
  name: "PageNotification",
  data() {
    return {
      isLoading: false,
      dataList: [],
    };
  },
  methods: {
    getNotification() {
      this.isLoading = true;
      const params = {
        UID: this.$cookiz.get("m6_uid"),
        LoginOpen: 1,
      };
      this.$axios
        .$get("/api-base/GetAnnounce", { params })
        .then((res) => {
          if (!res.code) {
            this.dataList = Object.assign(res.list || []);
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  mounted() {
    this.getNotification();
  },
};
</script>

<style></style>
