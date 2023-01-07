<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="1000">
        <GameActionBar>
          <v-btn-toggle
            v-model="activeChannel"
            @change="switchChannel"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn class="px-1 ma-0" height="24" value="A" small>
              正码 A
            </v-btn>
            <v-btn class="px-1 ma-0" height="24" value="B" small>
              正码 B
            </v-btn>
          </v-btn-toggle>
        </GameActionBar>
        <v-divider></v-divider>
        <v-card class="pa-2" flat tile>
          <v-form ref="formItem">
            <BittingItem49
              @toggle-item="toggleSelectItem"
              :disabled="gameClosed"
              :gridItems="gridBalls"
              :selectedItems="selectedList"
              :rates="itemsRate"
              ref="item49Picker"
            />
            <v-sheet height="8"></v-sheet>
            <BittingZhengmaFlip
              @click:row="toggleSelectItem"
              :rates="flipBallRates"
              :selectedItems="selectedList"
              :disabled="gameClosed"
              ref="zhengmaFlip"
            />
            <v-sheet height="8"></v-sheet>
            <ViewItemRestrict :getItemRestrict="getItemRestrict" />
            <ActionBarBallAmount
              v-model="amount"
              @blur="setItemAmount"
              @compose="openDialogBitting"
              @clear="clearSelection"
              :disabled="gameClosed"
            />
          </v-form>
        </v-card>
      </v-sheet>
      <v-sheet
        class="flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      >
        <v-card flat tile>
          <v-card-text
            style="background: linear-gradient(0deg, #dae8fc, #fff)"
            class="primary--text pa-1 text-center"
          >
            最新注单
          </v-card-text>
          <v-divider></v-divider>
          <section>
            <v-card class="mb-4" flat tile>
              <v-card-text class="pa-1">
                <Shortcut49
                  @click:item="onClickItem49"
                  :selected-items="selectedItems"
                  :disabled="gameClosed"
                />
                <ShortcutColor
                  @click:item="onClickShortcut"
                  :selected="activeShortcut"
                  :disabled="gameClosed"
                />
                <ShortcutItem
                  @click:item="onClickShortcut"
                  :selected="activeShortcut"
                  :disabled="gameClosed"
                />
              </v-card-text>
            </v-card>
          </section>
        </v-card>
      </v-sheet>
    </v-layout>
    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      type="2"
    />
  </div>
</template>

<script>
import { GridZhengmaA, GridZhengmaB, ZhengmaFlip } from "~/models/balls-map";
import { POSITION } from "vue-toastification";
import { mapState } from "vuex";

export default {
  name: "PageLuckyDraw",
  data() {
    return {
      amount: undefined,
      activeShortcut: "",
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [] },
      selectedList: [],
      ref_rates: {},
      activeChannel: "A",
      loadingRates: false,
      getItemRestrict: {},
    };
  },
  computed: {
    ...mapState("game", { gameClosed: "closed" }),
    selectedItems() {
      return this.selectedList.map((item) => item.value);
    },
    itemsRate() {
      const rates = {};
      this.gridBalls.forEach((subitems) => {
        subitems.forEach(({ play_id }) => {
          rates[play_id] = this.getBallRate(play_id);
        });
      });
      return rates;
    },
    flipBallRates() {
      const rates = {};
      ZhengmaFlip.forEach(({ play_id }) => {
        rates[play_id] = this.getBallRate(play_id);
      });
      return rates;
    },
    gridBalls() {
      return this.activeChannel == "A" ? GridZhengmaA : GridZhengmaB;
    },
    flipCoins() {
      return ZhengmaFlip;
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.item49Picker.setItemAmount(value);
      this.$refs.zhengmaFlip.setItemAmount(value);
    },
    setItemAmountIndividual(play_id, value) {
      this.$refs.item49Picker.setItemAmountIndividual(play_id, value);
      this.$refs.zhengmaFlip.setItemAmountIndividual(play_id, value);
    },
    onClickInputReadonly(item) {
      this.toggleSelectItem(item);
      setTimeout(() => {
        this.$refs[item.play_id][0].focus();
      }, 100);
    },
    onClickItem49(item) {
      if (!this.amount)
        return this.$toast.error(`请先预设你的金额`, {
          position: POSITION.TOP_CENTER,
        });
      let ballItem;
      for (const column of this.gridBalls) {
        ballItem = column.find((ball) => ball.value == item);
        if (ballItem) break;
      }
      this.toggleSelectItem(ballItem);
    },
    onClickShortcut(item = {}) {
      if (!this.amount)
        return this.$toast.error(`请先预设你的金额`, {
          position: POSITION.TOP_CENTER,
        });
      const balls = item.balls || [];
      const prefix = this.activeChannel == "A" ? "0201" : "0202";
      let ids = balls.map((item) => {
        return {
          play_id: this.$common.getPlayId(prefix, item),
          value: item,
          label: this.$common.getNumberLabel(item),
          color: this.$common.getBallColor(item),
        };
      });
      this.selectBalls(ids, item.value);
    },
    selectBalls(items = [], type) {
      this.selectedList = Object.assign([], []);
      this.activeShortcut = type;

      if (items.every((item) => this.selectedList.includes(item))) {
        items.forEach((item) => {
          let index = this.selectedList.indexOf(item);
          this.selectedList.splice(index, 1);
        });
        return;
      }
      const newList = [...new Set([...this.selectedList, ...items])];
      this.selectedList = Object.assign([], newList);
      setTimeout(() => {
        this.setItemAmount(this.amount);
      }, 10);
    },
    toggleSelectItem(item) {
      this.activeShortcut = "";
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      this.selectedList.push(item);
      this.setItemAmountIndividual(item.play_id, this.amount);
    },
    isActive(label) {
      return !!this.selectedList.find((item) => item.label == label);
    },
    onSelectBalls(items = [], type) {
      this.selectedList = Object.assign([], []);
      this.activeShortcut = type;

      if (items.every((item) => this.selectedList.includes(item))) {
        items.forEach((item) => {
          let index = this.selectedList.indexOf(item);
          this.selectedList.splice(index, 1);
        });
        return;
      }
      const newList = [...new Set([...this.selectedList, ...items])];
      this.selectedList = Object.assign([], newList);
    },
    clearSelection() {
      this.activeShortcut = "";
      this.selectedList = [];
    },
    openDialogBitting() {
      const min = 1;
      if (this.selectedList.length < min)
        return this.$toast.error(`请至少选择 ${min} 项`, {
          position: POSITION.TOP_CENTER,
        });

      const formData = new FormData(this.$refs.formItem.$el);
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.play_id),
        amount: formData.get(item.play_id) || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.bittingInputs = true;
    },
    getOddValues() {
      this.loadingRates = true;
      const uid = this.$cookiz.get("m6_uid");
      const r = Math.random().toFixed(17);
      const order_type = this.activeChannel;
      this.$axios
        .$get("/api-base/GetOdds", { params: { uid, r, order_type, type: 2 } })
        .then((res) => {
          const _refs = {};
          res.list.forEach((item) => {
            _refs[item.play_id] = item.odds;
          });
          this.ref_rates = Object.assign({}, _refs);
          this.loadingRates = false;
        })
        .catch((error) => {
          console.log(error);
          this.loadingRates = false;
        });

      const activeType = this.activeChannel == "A" ? 2 : 1002;
      this.$axios
        .$get("/api-base/GetItemRestrict", {
          params: { uid, r, type: activeType },
        })
        .then((res) => {
          if (!res.restrict) return;
          this.getItemRestrict = res.restrict;
          this.loadingRates = false;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loadingRates = false;
        });
    },
    switchChannel(channel) {
      this.activeChannel = channel;
      this.selectedList = [];
      this.getOddValues();
      clearInterval(this.intervalRequest);
      this.startIntervalRequest();
    },
    getBallRate(play_id) {
      return this.ref_rates[play_id];
    },
    startIntervalRequest() {
      this.intervalRequest = setInterval(() => {
        this.getOddValues();
      }, 1000 * 10);
    },
    onSaveAmount() {
      this.selectedList = [];
      this.getOddValues();
      setTimeout(() => {
        this.$store.dispatch("lottery/getRecentBets");
        this.$store.dispatch("profile/fetchBasicItem");
      }, 1000);
    },
  },
  mounted() {
    clearInterval(this.intervalRequest);
    this.getOddValues();
    this.startIntervalRequest();
  },
  beforeDestroy() {
    clearInterval(this.intervalRequest);
  },
};
</script>
