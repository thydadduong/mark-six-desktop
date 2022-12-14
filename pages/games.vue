<template>
  <v-card :disabled="bittingClosed" color="transparent" flat tile>
    <v-toolbar
      class="main-toolbar"
      color="primary darken-1"
      height="32"
      flat
      dark
    >
      <v-toolbar-title
        class="white primary--text px-4 my-4 py-1 body-1 fill-height"
      >
        {{ gameTitle }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-layout class="gap-sm" align-center justify-end>
        <p class="mb-0 white--text">{{ issueNumber }}期开奖</p>
        <v-card color="white" class="error--text mb-0 px-2 body-1">
          {{ displayTimeCounter }}
        </v-card>
      </v-layout>
    </v-toolbar>
    <v-btn-toggle tile color="primary" group>
      <template v-for="(item, index) in gameMenu">
        <v-btn :to="item.to" class="px-1 ma-0" value="left" small>
          {{ item.title }}
        </v-btn>
        <div class="my-auto" style="height: 24px">
          <v-divider vertical></v-divider>
        </div>
      </template>
    </v-btn-toggle>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="2" class="pa-2">
        <v-card flat tile>
          <v-card tile outlined>
            <v-card-text
              style="background: linear-gradient(0deg, #dae8fc, #fff)"
              class="primary--text pa-1 text-center"
            >
              最新注单
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text
              style="background: linear-gradient(0deg, #dae8fc, #fff)"
              class="primary--text pa-1"
            >
              未结金额：0
            </v-card-text>
          </v-card>
          <v-card-text>
            <v-layout justify-center class="py-8">
              <v-avatar size="100" class="rounded-lg">
                <img src="/images/default.png" alt="" />
              </v-avatar>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9" class="grey lighten-4"> <nuxt /></v-col>
    </v-row>
    <v-sheet height="60" color="transparent"></v-sheet>
    <DialogGameTimeout
      :visible="bittingClosed"
      :title="gameTimeoutTitle"
      message="请选择其他彩种进行游戏"
      action-title="返回大厅"
      action-to="/"
    />
    <DialogConfirm @confirm="confirmSwitch" ref="dialogConfirm" />
    <DialogMessageBox ref="dialogMessage" auto-close />
  </v-card>
</template>

<script>
import qs from "qs";
import { mapState, mapActions } from "vuex";
import { DialogType } from "~/models/types/dialog.type";

export default {
  name: "GameLayout",
  data() {
    return {
      bittingClosed: false,
      drawerRight: false,
      tempTable: "",
      closeTimer: 0,
      issueId: undefined,
      lastResult: {},
      loadingTable: false,
      activeTabMenu: "",
      tabGamMenu: [
        { title: "特码", to: "/games/tema" },
        { title: "正码", to: "/games/zhengma" },
        { title: "特码生肖", to: "/games/tema-zodiac" },
        { title: "连码", to: "/games/lianma" },
        { title: "正码特", to: "/games/zhengma-te" },
        { title: "连尾", to: "/games/lianwei" },
      ],
      moreGameMenu: [
        { title: "连尾不中 ", to: "/games/lianweibuzhong" },
        { title: "尾数项目", to: "/games/zhongshu-weishu" },
        { title: "自选不中", to: "/games/zixuanbuzhong" },
        { title: "连肖", to: "/games/lianxiao" },
        { title: "连肖不中", to: "/games/lianxiaobuzhong" },
        { title: "自选中一", to: "/games/zixuan-zhong-yi" },
        { title: "特平中", to: "/games/tepingzhong" },
        { title: "一肖项目", to: "/games/yi-xiao-xiangmu" },
        { title: "一肖量", to: "/games/yi-xiao-laing" },
        { title: "一尾量", to: "/games/yi-wei-laing" },
        { title: "六肖", to: "/games/liu-xiao" },
        { title: "半波", to: "/games/banbo" },
        { title: "五行", to: "/games/wuhang" },
      ],
    };
  },
  computed: {
    ...mapState("profile", ["gameTable"]),
    ...mapState("game", ["activeGameTitle"]),
    gameTimeoutTitle() {
      return `${this.activeGameTitle || ""} 暂停销售`;
    },
    tableList() {
      return this.gameTable.tables || [];
    },
    currentTable() {
      return this.gameTable.current_table;
    },
    gameMenu() {
      return [
        { title: "特码", to: "/games/tema" },
        { title: "正码", to: "/games/zhengma" },
        { title: "特码生肖", to: "/games/tema-zodiac" },
        { title: "连码", to: "/games/lianma" },
        { title: "正码特", to: "/games/zhengma-te" },
        { title: "连尾", to: "/games/lianwei" },
        { title: "连尾不中 ", to: "/games/lianweibuzhong" },
        { title: "尾数项目", to: "/games/zhongshu-weishu" },
        { title: "自选不中", to: "/games/zixuanbuzhong" },
        { title: "连肖", to: "/games/lianxiao" },
        { title: "连肖不中", to: "/games/lianxiaobuzhong" },
        { title: "自选中一", to: "/games/zixuan-zhong-yi" },
        { title: "特平中", to: "/games/tepingzhong" },
        { title: "一肖项目", to: "/games/yi-xiao-xiangmu" },
        { title: "一肖量", to: "/games/yi-xiao-laing" },
        { title: "一尾量", to: "/games/yi-wei-laing" },
        { title: "六肖", to: "/games/liu-xiao" },
        { title: "半波", to: "/games/banbo" },
        { title: "五行", to: "/games/wuhang" },
      ];
    },
    gameTitle() {
      const _path = this.$route.path || "";
      return this.gameMenu.find((item) => item.to == _path).title;
    },
    displayTimeCounter() {
      const date = new Date(this.closeTimer * 1000).toISOString();
      return date.substring(11, 19);
    },
    lastIssueNumber() {
      const { issue_id } = this.lastResult || {};
      return issue_id ? ` 2022${issue_id} ` : " — ";
    },
    issueNumber() {
      const { issue_id } = this.lastResult || {};
      return issue_id ? ` 2022${+issue_id + 1} ` : " — ";
    },
  },
  methods: {
    ...mapActions("profile", ["getGameTable"]),
    getCloseTime() {
      const uid = this.$cookiz.get("m6_uid");
      const r = Math.random().toFixed(16);
      this.$axios
        .$get("/api-base/GetCloseTime", { params: { uid, r } })
        .then((res) => {
          if (!!res?.code) return;
          this.bittingClosed = false;
          this.closeTimer = res.seconds || 0;
          clearInterval(this.timerInterval);
          this.startCountdown();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    gitLastResult() {
      const uid = this.$cookiz.get("m6_uid");
      const r = Math.random().toFixed(16);
      this.$axios
        .$get("/api-base/ResultHistory", { params: { uid, r } })
        .then((res) => {
          if ([undefined, null].includes(res?.code) || res?.code == -1) return;
          const item = res?.records?.[0] || {};
          this.lastResult = Object.assign({}, item);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    startCountdown() {
      this.timerInterval = setInterval(() => {
        if (this.closeTimer <= 0) {
          this.bittingClosed = true;
          clearInterval(this.timerInterval);
          return;
        }
        this.closeTimer -= 1;
      }, 1000);
    },
    getIssueID(uid) {
      const r = Math.random().toFixed(7);
      this.$axios
        .$get("/api-base/GetIssueId", { params: { uid, r } })
        .then((res) => {
          this.issueId = res.issue;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openDialogConfirm(table) {
      this.tempTable = table;
      let message = `您确认要切换到${table}盘吗？`;
      this.$refs.dialogConfirm.show(undefined, message);
    },
    confirmSwitch() {
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
          false;
        });
    },
    startIntervalRequest() {
      this.intervalRequest = setInterval(() => {
        this.getCloseTime();
      }, 1000 * 30);
    },
    addItem(item, index) {
      const removed = this.tabGamMenu.pop();
      this.tabGamMenu.push(item);
      this.moreGameMenu.splice(index, 1, removed);
      this.$nextTick(() => {
        this.activeTabMenu = "tab-5";
      });
    },
  },
  mounted() {
    const uid = this.$cookiz.get("m6_uid");
    this.getIssueID(uid);
    this.getCloseTime();
    this.gitLastResult();
    this.startIntervalRequest();
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
    clearInterval(this.intervalRequest);
    this.closeTimer = 0;
  },
};
</script>

<style>
.game-menu.v-item-group .v-slide-group__content {
  justify-content: center;
}
</style>
