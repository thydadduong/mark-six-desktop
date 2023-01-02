<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="900">
        <GameActionBar>
          <v-btn-toggle
            v-model="activeType"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn
              v-for="(item, key) in typeOptions"
              :key="`option-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              small
            >
              {{ item.title }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBar>
        <v-divider></v-divider>
        <v-card class="pa-2" flat tile>
          <v-form ref="formItem">
            <BittingItem49
              @toggle-item="toggleSelectItem"
              :gridItems="gridBalls"
              :selectedItems="selectedList"
              :rates="itemsRate"
              ref="item49Picker"
            />
            <v-sheet height="8"></v-sheet>
            <BittingZhengmaTeFlip
              @click:row="toggleSelectItem"
              :flip-coins="flipCoins"
              :rates="flipBallRates"
              :selectedItems="selectedList"
              ref="flipItem"
            />
            <v-sheet height="8"></v-sheet>
            <ActionBarBallAmount
              v-model="amount"
              @blur="setItemAmount"
              @compose="openDialogBitting"
              @clear="clearSelection"
            />
          </v-form>
        </v-card>
      </v-sheet>

      <v-sheet
        class="flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      >
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          <v-sheet height="24" color="transparent"></v-sheet>
        </v-card-text>
        <v-card class="mb-4" outlined tile>
          <v-card-text class="pa-2 pr-1">
            <Shortcut49
              @click:item="onClickItem49"
              :selected-items="selectedItems"
            />
            <ShortcutColor
              @click:item="onClickShortcut"
              :selected="activeShortcut"
            />
            <ShortcutItem
              @click:item="onClickShortcut"
              :selected="activeShortcut"
            />
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-layout>
    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :amount="inputAmount"
      :type="activeType.value"
    />
  </div>
</template>

<script>
import { POSITION } from "vue-toastification";
import {
  ColorBallsFlat,
  gridNumbers,
  ShortcutsTema,
  ZhengmaTeFlip,
} from "~/models/balls-map";

export default {
  name: "PageZhengmaTe",
  data() {
    return {
      amount: undefined,
      activeShortcut: "",
      activeType: {
        title: "正一特",
        prefix: "03",
        ball_prefix: "0301",
        value: 8,
      },
      activeShortcut: "",
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [] },
      selectedList: [],
      ref_rates: {},
      loadingRates: false,
    };
  },
  computed: {
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
      this.flipCoins.forEach((balls) => {
        balls.forEach(({ play_id }) => {
          rates[play_id] = this.getBallRate(play_id);
        });
      });
      return rates;
    },
    gridBalls() {
      return gridNumbers.map((col) =>
        col.map((ball) => ({
          play_id: this.$common.getPlayId(this.activeType.ball_prefix, ball),
          label: this.$common.getNumberLabel(ball),
          name: this.$common.getNumberLabel(ball),
          value: ball,
          color: this.$common.getBallColor(ball),
        }))
      );
    },
    shortcutBalls() {
      return ShortcutsTema;
    },
    colorBalls() {
      return ColorBallsFlat.map((item) => ({
        ...item,
        play_id: [this.activeType.prefix, item.suffix].join(""),
      }));
    },
    flipCoins() {
      return ZhengmaTeFlip.map((item) =>
        item.map((subItem) => ({
          ...subItem,
          play_id: [this.activeType.prefix, subItem.suffix].join(""),
        }))
      );
    },
    typeOptions() {
      return [
        { title: "正一特", prefix: "03", ball_prefix: "0301", value: 8 },
        { title: "正二特", prefix: "04", ball_prefix: "0401", value: 9 },
        { title: "正三特", prefix: "05", ball_prefix: "0501", value: 10 },
        { title: "正四特", prefix: "06", ball_prefix: "0601", value: 11 },
        { title: "正五特", prefix: "07", ball_prefix: "0701", value: 12 },
        { title: "正六特", prefix: "08", ball_prefix: "0801", value: 13 },
      ];
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.item49Picker.setItemAmount(value);
      this.$refs.flipItem.setItemAmount(value);
    },
    setItemAmountIndividual(play_id, value) {
      this.$refs.item49Picker.setItemAmountIndividual(play_id, value);
      this.$refs.flipItem.setItemAmountIndividual(play_id, value);
    },
    onClickInputReadonly(item) {
      this.toggleSelectItem(item);
      setTimeout(() => {
        this.$refs[item.play_id][0].focus();
      }, 100);
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
    onClickItem49(item) {
      let ballItem;
      for (const column of this.gridBalls) {
        ballItem = column.find((ball) => ball.value == item);
        if (ballItem) break;
      }
      this.toggleSelectItem(ballItem);
    },
    isActive(label) {
      return !!this.selectedList.find((item) => item.label == label);
    },
    onClickShortcut(item = {}) {
      const balls = item.balls || [];
      const prefix = this.activeType.ball_prefix;
      let ids = balls.map((item) => ({
        play_id: this.$common.getPlayId(prefix, item),
        value: item,
        label: this.$common.getNumberLabel(item),
        color: this.$common.getBallColor(item),
      }));
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

      const type = this.activeType.value;
      this.$axios
        .$get("/api-base/GetOdds", { params: { uid, r, type } })
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
    },
    getBallRate(play_id) {
      return this.ref_rates[play_id];
    },
    onPrefixChanged() {
      this.selectedList = [];
      setTimeout(() => {
        this.getOddValues();
      }, 100);
    },
    startIntervalRequest() {
      this.intervalRequest = setInterval(() => {
        this.getOddValues();
      }, 1000 * 10);
    },
    onSaveAmount() {
      this.selectedList = [];
      this.getOddValues();
      this.$store.dispatch("lottery/getRecentBets");
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
