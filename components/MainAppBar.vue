<template>
  <v-app-bar
    color="primary detail-toolbar"
    extension-height="64"
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
      :issueNumber="issueNumber"
      :ballList="lastResult.balls || []"
      class="py-2"
    />
    <v-layout class="fill-height pt-1" align-end column>
      <v-layout class="align-center gap-xs">
        <v-btn @click="showNotification" class="px-2 rounded mr-2" small icon>
          <v-icon small>mdi-bell</v-icon>
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
              @click="switchTable(item)"
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
              <v-icon small class="mr-2">mdi-account-circle-outline</v-icon>
              <span>个人账号</span>
              <v-icon small>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item @click="resetPassword">
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
          :show-arrows="false"
          background-color="transparent"
          height="38"
          dark
        >
          <v-tab
            v-for="(item, key) in menuList"
            :key="`side-menu-${key}`"
            :to="item.to + '?v=' + version"
            :exact="item.exact"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>
      </div>
    </v-layout>

    <template v-slot:extension>
      <v-layout column>
        <v-sheet
          color="primary"
          width="100%"
          height="32"
          style="background-image: linear-gradient(#1a83eb, #1976d2, #1a83eb)"
          light
        >
          <v-layout class="fill-height align-center">
            <v-sheet
              class="flex-shrink-0 px-4 white--text"
              width="15.25rem"
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
        <v-sheet width="100%" height="32" light>
          <v-layout class="fill-height">
            <v-sheet width="15.25rem" class="flex-shrink-0"></v-sheet>
            <v-tabs height="32" color="primary" hide-slider>
              <template v-for="(item, index) in gameMenu">
                <v-tab
                  :key="`index-${index}`"
                  :to="item.to + '?v=' + version"
                  style="min-width: 25px"
                  class="px-1"
                  value="left"
                >
                  {{ item.title }}
                </v-tab>
                <div
                  :key="index + 'divder'"
                  class="my-auto"
                  style="height: 24px"
                >
                  <v-divider vertical></v-divider>
                </div>
              </template>
              <v-menu
                content-class="rounded-0"
                max-width="300"
                offset-y
                bottom
                left
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-tab
                    text
                    class="align-self-center px-1"
                    v-bind="attrs"
                    v-on="on"
                  >
                    更多的
                    <v-icon small> mdi-menu-down </v-icon>
                  </v-tab>
                </template>

                <v-card nav>
                  <v-card-text>
                    <v-chip-group column>
                      <v-row dense>
                        <v-col
                          v-for="(item, index) in moreGame"
                          :key="`more-item-${index}`"
                          cols="4"
                        >
                          <v-chip
                            :to="item.to + '?v=' + version"
                            class="full-width justify-center"
                            active-class="primary--text"
                          >
                            {{ item.title }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </v-chip-group>
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-tabs>

            <v-spacer></v-spacer>
          </v-layout>
        </v-sheet>
      </v-layout>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from "vuex";
import { gameMenuList } from "~/models/games";

export default {
  name: "MainAppBar",
  props: {
    issueNumber: String,
    totalBalance: { type: [String, Number], default: 0 },
    remainBalance: { type: [String, Number], default: 0 },
    lastResult: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      version: "1.0.0",

      gameMenu: [
        { title: "特码", to: "/games/tema" },
        { title: "正码", to: "/games/zhengma" },
        { title: "正码特", to: "/games/zhengma-te" },
        { title: "连码", to: "/games/lianma" },
        { title: "特平中", to: "/games/tepingzhong" },
        { title: "特码生肖", to: "/games/tema-zodiac" },
        { title: "一肖项目", to: "/games/yi-xiao-xiangmu" },
        { title: "六肖", to: "/games/liu-xiao" },
        { title: "尾数项目", to: "/games/zhongshu-weishu" },
        { title: "半波", to: "/games/banbo" },
        { title: "五行", to: "/games/wuhang" },
      ],
      moreGame: [
        { title: "自选不中", to: "/games/zixuanbuzhong" },
        { title: "自选中一", to: "/games/zixuan-zhong-yi" },
        { title: "连肖", to: "/games/lianxiao" },
        { title: "连肖不中", to: "/games/lianxiaobuzhong" },
        { title: "连尾", to: "/games/lianwei" },
        { title: "连尾不中 ", to: "/games/lianweibuzhong" },
        { title: "一肖量", to: "/games/yi-xiao-laing" },
        { title: "一尾量", to: "/games/yi-wei-laing" },
      ],
    };
  },
  computed: {
    ...mapState("game", { isLoading: "isLoading", gameList: "records" }),
    ...mapState("profile", { loadingTable: "isLoading" }),
    ...mapState("profile", ["gameTable"]),
    currentTable() {
      return this.gameTable.current_table;
    },
    tableList() {
      return this.gameTable.tables || [];
    },
    menuList() {
      return [
        { title: "主页", icon: "mdi-home-outline", to: "/", exact: true },
        { title: "信用资料", to: "/profile/credits" },
        { title: "未结明细", to: "/payment", exact: true },
        { title: "结算报表", to: "/settled", exact: true },
        { title: "游戏规则", to: "/rules" },
        { title: "开奖结果", to: "/lottery", exact: true },
      ];
    },
  },
  methods: {
    showNotification() {
      this.$emit("show-notification");
    },
    switchTable(item) {
      this.$emit("switch-table", item);
    },
    resetPassword() {
      this.$emit("reset-password");
    },
    logout() {
      this.$emit("logout");
    },
  },
};
</script>

<style></style>
