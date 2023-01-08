<template>
  <v-app>
    <v-overlay :value="loggingOut" z-index="999">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
    <v-main class="main-app-body">
      <v-sheet color="transparent" min-width="950">
        <MainAppBar
          @show-notification="dialogNotification = true"
          @reset-password="dialogResetPassword = true"
          @switch-table="openDialogConfirmSwitchTable"
          @logout="logout"
          :issueNumber="lastIssueNumber"
          :remainBalance="remainBalance"
        />
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
    };
  },
  computed: {
    ...mapState("profile", ["basicItem"]),
    remainBalance() {
      return this.basicItem.basic?.valid_balance || 0;
    },
    totalBalance() {
      return this.basicItem.basic?.total_balance || 0;
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
  },
  methods: {
    ...mapState("profile", ["gameTable"]),
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
