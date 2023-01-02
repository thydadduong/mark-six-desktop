<template>
  <v-card color="transparent" flat tile>
    <v-toolbar
      class="main-toolbar"
      color="primary darken-1"
      height="32"
      flat
      dark
    >
      <v-sheet class="flex-shrink-0" width="14rem"></v-sheet>

      <v-tabs
        v-for="(item, key) in gameList"
        :key="`game-${key}`"
        active-class="white primary--text"
        hide-slider
      >
        <v-tab class="text-none body-2" to="/games">{{ item.title }}</v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-layout class="elevation-1">
      <v-sheet width="15rem"></v-sheet>
      <v-btn-toggle color="primary" group tile>
        <template v-for="(item, index) in gameMenu">
          <v-btn :to="item.to" class="px-1 ma-0" value="left" small>
            {{ item.title }}
          </v-btn>
          <div class="my-auto" style="height: 24px">
            <v-divider vertical></v-divider>
          </div>
        </template>
      </v-btn-toggle>
    </v-layout>
    <v-layout>
      <v-sheet
        class="pa-2 px-1 flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      >
        <v-card :loading="loadingBet" elevation="1" tile>
          <v-card-text
            style="background: linear-gradient(0deg, #dae8fc, #fff)"
            class="primary--text pa-1 text-center"
          >
            最新注单
          </v-card-text>
          <v-divider></v-divider>
          <!-- <v-card-text
            style="background: linear-gradient(0deg, #dae8fc, #fff)"
            class="primary--text pa-1"
          >
            未结金额：0
          </v-card-text> -->
          <v-card-text v-if="!recentBets.length">
            <v-layout justify-center class="py-8">
              <v-card rounded="circle" outlined>
                <v-avatar size="100">
                  <v-icon class="grey--text text--lighten-1" size="36">
                    mdi-file-document-outline
                  </v-icon>
                </v-avatar>
              </v-card>
            </v-layout>
          </v-card-text>
          <v-list dense>
            <template v-for="([date, item, amount], key) in recentBets">
              <v-list-item :key="`item-${key}`" class="px-2 align-start">
                <v-list-item-action class="body-2 mr-2 my-1 mb-auto">
                  {{ date }}
                </v-list-item-action>
                <v-list-item-content
                  class="py-1 gap-xs text-center my-1 mb-auto"
                >
                  <small>{{ displayText(item)[0] }}</small>
                  <small v-if="displayText(item)[1]">
                    ({{ displayText(item)[1] }}
                  </small>
                </v-list-item-content>
                <v-list-item-action class="body-2 ml-2 my-1 mb-auto">
                  {{ amount }}
                </v-list-item-action>
              </v-list-item>
              <v-divider
                :key="`item-divider-${key}`"
                v-if="recentBets.length - 1 > key"
              ></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-sheet>
      <v-sheet class="pa-2 px-1 flex-fill" color="transparent">
        <nuxt />
      </v-sheet>
    </v-layout>
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
    <portal to="closeTimer">
      <v-layout class="gap-xs" align-center justify-end>
        <p class="mb-0">{{ issueNumber }}: 期开奖:</p>
        <p class="mb-0 font-weight-medium" :class="timerColor" flat>
          {{ displayTimeCounter }}
        </p>
      </v-layout>
    </portal>
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
    };
  },
  computed: {
    ...mapState("profile", ["gameTable"]),
    ...mapState("lottery", ["loadingBet", "recentBets"]),
    ...mapState("game", ["activeGameTitle"]),
    ...mapState("game", { isLoading: "isLoading", gameList: "records" }),
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
        { title: "正码特", to: "/games/zhengma-te" },
        { title: "连码", to: "/games/lianma" },
        { title: "自选不中", to: "/games/zixuanbuzhong" },
        { title: "自选中一", to: "/games/zixuan-zhong-yi" },
        { title: "特平中", to: "/games/tepingzhong" },
        { title: "特码生肖", to: "/games/tema-zodiac" },
        { title: "连肖", to: "/games/lianxiao" },
        { title: "连肖不中", to: "/games/lianxiaobuzhong" },
        { title: "一肖项目", to: "/games/yi-xiao-xiangmu" },
        { title: "六肖", to: "/games/liu-xiao" },
        { title: "连尾", to: "/games/lianwei" },
        { title: "连尾不中 ", to: "/games/lianweibuzhong" },
        { title: "尾数项目", to: "/games/zhongshu-weishu" },
        { title: "一肖量", to: "/games/yi-xiao-laing" },
        { title: "一尾量", to: "/games/yi-wei-laing" },
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
    issueNumber() {
      const y = new Date().getFullYear();
      const { issue_id } = this.lastResult || {};
      const id = (+issue_id + 1).toString().padStart(3, "0");
      return issue_id ? ` ${y}${id} ` : " — ";
    },
    timerColor() {
      return this.closeTimer > 0
        ? "success--text text--darken-1"
        : "error--text";
    },
  },
  methods: {
    ...mapActions("game", ["getGameList"]),
    ...mapActions("lottery", ["getRecentBets"]),
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
    displayText(text = "") {
      return text.split("(");
    },
  },
  mounted() {
    const uid = this.$cookiz.get("m6_uid");
    this.getGameList();
    this.getIssueID(uid);
    this.getCloseTime();
    this.gitLastResult();
    this.startIntervalRequest();
    this.getRecentBets();
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
