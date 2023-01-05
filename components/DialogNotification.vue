<template>
  <v-dialog
    @input="visibleChange"
    :value="visible"
    content-class="rounded-0"
    width="30rem"
    scrollable
    persistent
  >
    <v-card
      :disabled="loading"
      class="dialog-notification disable-select"
      min-height="25rem"
      tile
    >
      <v-btn
        @click="visibleChange(false)"
        class="rounded dialog-notification__close"
        absolute
        right
        top
        dark
        icon
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-title
        class="body-1 py-2 justify-center text-center primary white--text"
      >
        确认订单
      </v-card-title>
      <v-divider></v-divider>
      <v-progress-linear
        v-if="loading"
        :indeterminate="true"
      ></v-progress-linear>
      <v-card-text class="pa-0">
        <v-card
          v-ripple
          v-for="(item, key) in notifications"
          :key="`item-${key}`"
          class="dialog-notification__item"
          flat
          tile
        >
          <v-card-title class="body-2 py-2"> {{ item.title }} </v-card-title>
          <v-card-text class="pb-2"> {{ item.content }} </v-card-text>
        </v-card>
        <CardEmpty :visible="isEmpty" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-center text--secondary">
        <small>全部的: {{ notifications.length }}</small>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogNotification",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      loading: false,
      notifications: [],
    };
  },
  computed: {
    isEmpty() {
      return !this.loading && !this.notifications.length;
    },
  },
  watch: {
    visible(v) {
      if (!v) return;
      console.log();
      this.getNotification();
    },
  },
  methods: {
    visibleChange(v = false) {
      this.$emit("update:visible", v);
    },
    getNotification() {
      this.loading = true;
      const params = {
        UID: this.$cookiz.get("m6_uid"),
        LoginOpen: 1,
      };
      this.$axios
        .$get("/api-base/GetAnnounce", { params })
        .then((res) => {
          if (!res.code) {
            this.notifications = Object.assign(res.list || []);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss">
.dialog-notification {
  .dialog-notification__close {
    top: 0.125rem;
    right: 0.5rem;
  }

  .dialog-notification__item:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
}
</style>
