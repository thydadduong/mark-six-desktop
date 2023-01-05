<template>
  <div>
    <portal to="toolbarName">
      {{ basicItem.basic?.account || "没有账号" }}
    </portal>
    <div class="px-4">
      <v-card flat tile width="30rem">
        <v-card-text>
          <v-layout class="gap text-center">
            <div class="text--primary">
              <h4 class="font-weight-regular mb-2">
                {{ basicItem.basic?.valid_balance || 0 }}
              </h4>
              <h4 class="font-weight-regular">剩余额度</h4>
            </div>
            <v-divider vertical></v-divider>
            <div class="text--primary">
              <h4 class="font-weight-regular mb-2">
                {{ basicItem.basic?.total_balance || 0 }}
              </h4>
              <h4 class="font-weight-regular">总共额度</h4>
            </div>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-list class="px-0">
          <v-list-item
            v-for="(item, key) in profileMenu"
            :key="`pf-menu-${key}`"
            :to="item.to"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="logout" class="error mx-4 mt-4 rounded" dark>
            <v-list-item-title class="text-center">登出</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </div>

    <v-sheet color="transparent" height="64"></v-sheet>
    <DialogConfirm @confirm="confirmLogout" ref="dialogConfirm" />
    <DialogMessageBox ref="dialogMessage" auto-close />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { DialogType } from "~/models/types/dialog.type";
export default {
  name: "PageProfile",
  computed: {
    ...mapState("profile", ["basicItem"]),
    profileMenu() {
      return [
        // { title: "系统公告", to: "/profile/notifications" },
        // { title: "未结明细", to: "/profile/unsettled" },
        // { title: "结算报表", to: "/profile/settled" },
        { title: "信用资料", to: "/profile/credits" },
        // { title: "全国开奖网", to: "/profile/reports" },
        { title: "游戏规则", to: "/rules" },
        { title: "修改密码", to: "/profile/reset-password" },
      ];
    },
  },
  methods: {
    ...mapActions("auth", { logoutUser: "logout" }),
    ...mapActions("profile", ["fetchBasicItem"]),
    logout() {
      let message = this.$t("dialog.message.logout_text");
      return this.$refs.dialogConfirm.show(DialogType.ERROR, message);
    },
    confirmLogout() {
      this.loggingOut = true;
      this.logoutUser()
        .then((res) => {
          this.$refs.dialogMessage.show(DialogType.SUCCESS);
          this.loggingOut = false;
          window.location.reload();
        })
        .catch((e) => {
          this.$refs.dialogMessage.show(DialogType.ERROR);
          this.loggingOut = false;
        });
    },
  },
  created() {
    this.fetchBasicItem();
  },
};
</script>
