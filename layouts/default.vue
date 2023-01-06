<template>
  <v-app>
    <v-overlay :value="loggingOut" z-index="999">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
    <v-main class="main-app-body">
      <v-sheet color="transparent" min-width="950">
        <v-app-bar
          color="primary detail-toolbar"
          extension-height="58"
          height="86"
          elevation="1"
          tile
          dark
          app
        >
          <nuxt-link to="/" class="mr-8">
            <v-avatar size="54" rounded color="primary" class="white--text">
              <img src="/images/hk6.jpg" style="object-fit: cover" />
            </v-avatar>
          </nuxt-link>
          <CardTodayResult
            :issueNumber="lastIssueNumber"
            :ballList="lastResult.balls"
            class="py-2"
          />
          <v-layout class="fill-height pt-1" align-end column>
            <v-layout class="align-center gap-xs">
              <v-btn
                @click="dialogNotification = true"
                class="px-2 rounded mr-2"
                small
                icon
              >
                <v-icon small>mdi-bell</v-icon>
              </v-btn>
              <v-btn to="/profile" class="px-2" small text>
                <v-icon left>mdi-account</v-icon>
                个人信息
              </v-btn>
              <p class="pa-2 ma-0 body-2">
                <v-icon small>mdi-database-outline</v-icon>
                剩余额度: {{ remainBalance }} 总共额度: {{ totalBalance }}
              </p>

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
                    <span>个人账号</span>
                    <v-icon small>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="dialogResetPassword = true">
                    <v-list-item-content>修改密码</v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="logout">
                    <v-list-item-content>退出系统</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-layout>
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
                  :to="item.to + '?v=' + version"
                  :exact="item.exact"
                  class="px-0"
                >
                  {{ item.title }}
                </v-tab>
              </v-tabs>
            </div>
          </v-layout>

          <template v-slot:extension>
            <v-layout column>
              <v-sheet color="primary darken-2" width="100%" height="32" light>
                <v-layout class="fill-height align-center">
                  <v-sheet
                    class="flex-shrink-0 px-4 white--text"
                    width="14rem"
                    color="transparent"
                  >
                    <portal-target name="toolbarName"></portal-target>
                  </v-sheet>
                  <v-tabs
                    v-for="(item, key) in gameList"
                    :key="`game-${key}`"
                    active-class="white primary--text"
                    color="primary"
                    background-color="transparent"
                    height="32"
                    hide-slider
                    light
                  >
                    <v-tab class="text-none body-2" to="/games">{{
                      item.title
                    }}</v-tab>
                  </v-tabs>
                  <v-spacer></v-spacer>
                </v-layout>
              </v-sheet>
              <v-sheet width="100%" height="26" light>
                <v-layout class="fill-height">
                  <v-sheet width="14rem"></v-sheet>
                  <v-btn-toggle color="primary" group tile>
                    <template v-for="(item, index) in gameMenu">
                      <v-btn
                        :key="index + 'btn'"
                        :to="item.to + '?v=' + version"
                        class="px-1 ma-0"
                        value="left"
                        small
                      >
                        {{ item.title }}
                      </v-btn>
                      <div
                        :key="index + 'divder'"
                        class="my-auto"
                        style="height: 24px"
                      >
                        <v-divider vertical></v-divider>
                      </div>
                    </template>
                  </v-btn-toggle>
                </v-layout>
              </v-sheet>
            </v-layout>
          </template>
        </v-app-bar>
        <Nuxt />
      </v-sheet>
      <DialogConfirm @confirm="onConfirm" ref="dialogConfirm" />
      <DialogMessageBox ref="dialogMessage" auto-close />
      <DialogResetPassword :visible.sync="dialogResetPassword" />
      <DialogNotification :visible.sync="dialogNotification" />
    </v-main>
  </v-app>
</template>

<script>
import qs from "qs";
import { mapActions, mapState } from "vuex";
import { DialogType } from "~/models/types/dialog.type";
import { gameMenuList } from "~/models/games";
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
      dialogNotification: false,
      dialogResetPassword: false,
      lastResult: {
        balls: [],
      },
      confirmAction: "",
      version: "1.0.0",
    };
  },
  computed: {
    ...mapState("profile", ["basicItem"]),
    ...mapState("profile", ["gameTable"]),
    ...mapState("game", { isLoading: "isLoading", gameList: "records" }),
    remainBalance() {
      return this.basicItem.basic?.valid_balance || 0;
    },
    totalBalance() {
      return this.basicItem.basic?.total_balance || 0;
    },
    gameMenu() {
      return gameMenuList;
    },
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
        { title: "未结明细", to: "/payment", exact: true },
        { title: "结算报表", to: "/settled", exact: true },
        { title: "开奖结果", to: "/lottery", exact: true },
        // {
        //   title: "个人信息",
        //   icon: "mdi-account-outline",
        //   to: "/profile",
        //   exact: false,
        // },
      ];
    },
  },
  methods: {
    ...mapActions("profile", ["fetchBasicItem"]),
    ...mapActions("game", ["getGameList"]),
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
    this.fetchBasicItem();
    this.getGameList();
    this.getAppTitle();
    this.getGameTable();
    this.getLastResult();
    this.$ga.page(this.$router);
  },
};
</script>

<style lang="sass">
.main-aside-menu .main-aside-menu--svg-icon
  >div,svg
    width: 24px !important
    height: 24px !important
  path
    fill: white

.v-toolbar.detail-toolbar
  .v-toolbar__content
    padding-top: 0
    padding-bottom: 0
  .v-toolbar__extension
    padding: 0
</style>
