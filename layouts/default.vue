<template>
  <v-app>
    <v-overlay :value="loggingOut" z-index="999">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
    <v-main class="overflow-x-auto" style="background-color: #f5f5f5">
      <v-sheet min-width="950">
        <v-toolbar
          color="primary detail-toolbar"
          height="70"
          elevation="0"
          tile
          dark
        >
          <div class="mr-8">
            <v-avatar size="54" rounded color="primary" class="white--text">
              <img src="/images/hk6.jpg" style="object-fit: cover" />
            </v-avatar>
          </div>
          <CardTodayResult
            :issueNumber="lastIssueNumber"
            :ballList="lastResult.balls"
            class="py-2"
          />
          <v-layout class="fill-height" align-end column>
            <div>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    :loading="loadingTable"
                    class="px-1"
                    small
                    text
                  >
                    盘口: {{ currentTable }}
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="item in tableList"
                    @click="openDialogConfirmSwitchTable(item)"
                    :key="`table-${item}`"
                    :disabled="item == currentTable"
                  >
                    <v-list-item-content>盘口 {{ item }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    :loading="loadingTable"
                    class="px-1 text-none"
                    small
                    text
                  >
                    <v-icon small class="mr-2"
                      >mdi-account-circle-outline</v-icon
                    >
                    <span>Profile</span>
                    <v-icon small>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item to="/profile/reset-password" exact>
                    <v-list-item-content>修改密码</v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="logout">
                    <v-list-item-content>个人信息</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="mt-auto">
              <v-tabs
                background-color="transparent"
                :show-arrows="false"
                height="36"
                dark
              >
                <v-tabs-slider color="primary lighten-3"></v-tabs-slider>
                <v-tab
                  v-for="(item, key) in menuList"
                  :key="`side-menu-${key}`"
                  :to="item.to"
                  :exact="item.exact"
                  class="px-0"
                >
                  {{ item.title }}
                </v-tab>
              </v-tabs>
            </div>
          </v-layout>
        </v-toolbar>
        <Nuxt />
      </v-sheet>
      <DialogConfirm @confirm="onConfirm" ref="dialogConfirm" />
      <DialogMessageBox ref="dialogMessage" auto-close />
    </v-main>
  </v-app>
</template>

<script>
import qs from "qs";
import { mapActions, mapState } from "vuex";
import { DialogType } from "~/models/types/dialog.type";
export default {
  name: "LayoutDefault",
  middleware: "auth",
  head() {
    return {
      title: this.$store.state.app.appTitle,
    };
  },
  data() {
    return {
      drawer: false,
      drawerRight: false,
      loggingOut: false,
      loadingTable: false,
      lastResult: {
        balls: [],
      },
      confirmAction: "",
    };
  },
  computed: {
    ...mapState("profile", ["gameTable"]),
    currentTable() {
      return this.gameTable.current_table;
    },
    tableList() {
      return this.gameTable.tables || [];
    },
    lastIssueNumber() {
      const { issue_id } = this.lastResult || {};
      return issue_id ? ` 2022${issue_id} ` : " — ";
    },
    issueNumber() {
      const { issue_id } = this.lastResult || {};
      return issue_id ? ` 2022${+issue_id + 1} ` : " — ";
    },
    smAndUp() {
      return this.$vuetify.breakpoint.smAndUp;
    },
    smOnly() {
      return this.$vuetify.breakpoint.smOnly;
    },
    mdOnly() {
      return this.$vuetify.breakpoint.mdOnly;
    },
    vBreakpoints() {
      return this.$vuetify.breakpoint;
    },
    menuList() {
      return [
        { title: "主页", icon: "mdi-home-outline", to: "/", exact: true },
        {
          title: "未结明细",
          icon: "mdi-file-document-outline",
          to: "/payment",
          exact: true,
        },
        {
          title: "开奖结果",
          icon: "mdi-star-shooting-outline",
          to: "/lottery",
          exact: true,
        },
        {
          title: "个人信息",
          icon: "mdi-account-outline",
          to: "/profile",
          exact: false,
        },
      ];
    },
  },
  methods: {
    ...mapActions("app", ["getAppTitle"]),
    ...mapActions("auth", { logoutUser: "logout" }),
    ...mapActions("profile", ["getGameTable"]),
    logout() {
      let message = this.$t("dialog.message.logout_text");
      this.confirmAction = "logout";
      return this.$refs.dialogConfirm.show(DialogType.ERROR, message);
    },
    onConfirm() {
      if (this.confirmAction == "logout") return this.confirmLogout();
      if (this.confirmAction == "switchTable") return this.confirmSwitchTable();
    },
    confirmLogout() {
      this.loggingOut = true;
      this.logoutUser()
        .then((res) => {
          this.$refs.dialogMessage.show(DialogType.SUCCESS);
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
          this.$refs.dialogMessage.show(DialogType.ERROR);
        })
        .finally(() => {
          this.loggingOut = false;
          this.confirmAction = "";
        });
    },
    confirmSwitchTable() {
      this.loadingTable = true;
      const r = Math.random().toFixed(7);
      const UID = this.$cookiz.get("m6_uid");
      const payload = {
        c_class: this.tempTable,
        CHCLASS: "%E4%BF%AE%E6%94%B9",
        proPasswd: this.gameTable.password,
      };
      this.$axios
        .$post("/api-base/Tables/Switch", qs.stringify(payload), {
          params: { UID, r },
        })
        .then((res) => {
          if (res.code === 0) {
            this.getGameTable();
            this.tempTable = "";
            this.$refs.dialogMessage.show(DialogType.SUCCESS);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            const message = `当前已经下注或目的盘口关闭，不可以切换到盘口: ${this.tempTable}`;
            this.$refs.dialogMessage.show(DialogType.ERROR, message);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loadingTable = false;
          this.confirmAction = "";
        });
    },
    onMessageClosed() {
      setTimeout(() => {
        this.$router.push("/login");
      }, 500);
    },
    getLastResult() {
      const uid = this.$cookiz.get("m6_uid");
      const r = Math.random().toFixed(16);
      this.$axios
        .$get("/api-base/ResultHistory", { params: { uid, r } })
        .then((res) => {
          if ([undefined, null].includes(res?.code) || res?.code == -1) return;
          const item = res?.records?.[0] || {};
          const balls = [
            item.ball1,
            item.ball2,
            item.ball3,
            item.ball4,
            item.ball5,
            item.ball6,
            item.ball7,
          ];
          this.lastResult = Object.assign({}, { ...item, balls });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openDialogConfirmSwitchTable(table) {
      this.tempTable = table;
      this.confirmAction = "switchTable";
      let message = `您确认要切换到${table}盘吗？`;

      this.$refs.dialogConfirm.show(undefined, message);
    },
  },
  mounted() {
    this.getAppTitle();
    this.getGameTable();
    this.getLastResult();
    this.$ga.page(this.$router);
  },
};
</script>

<style lang="sass">
.bs-drawer .v-list .v-list-item--active::after
  min-height: auto
  content: ""
  position: absolute
  right: 0
  background-color: #F2C94C
  width: 4px
  border-radius: 2px
  top: 4px
  bottom: 4px
  margin: 0 auto

.main-aside-menu .main-aside-menu--svg-icon
  >div,svg
    width: 24px !important
    height: 24px !important
  path
    fill: white

.v-toolbar.detail-toolbar .v-toolbar__content
  padding-top: 0
  padding-bottom: 0
</style>
