<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="1000">
        <GameActionBar>
          <v-btn-toggle
            v-model="selectedProp"
            @change="onOptionChange"
            class="mr-2"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn
              v-for="(item, key) in ballPropOptions"
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
        <GameActionBarFlat>
          <v-btn-toggle
            v-model="selectedType"
            @change="clearSelection"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn
              v-for="(item, key) in subOptions"
              :key="`mode-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              small
            >
              {{ item.title }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBarFlat>
        <v-divider></v-divider>
        <v-card class="pa-2" flat tile>
          <v-form ref="formItem">
            <BittingItem49
              @toggle-item="toggleSelectItem"
              :gridItems="gridBalls"
              :selectedItems="selectedList"
              :rates="itemsRate"
              ref="item49Picker"
              single-amount
            />
            <v-sheet height="8"></v-sheet>
            <ActionBarBallAmount
              v-model="editedItem.amount"
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
                />
              </v-card-text>
            </v-card>
          </section>
        </v-card>
      </v-sheet>
    </v-layout>
    <DialogBittingAmountLianma
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :saveMultiple="selectedType.value == 1"
      :property="selectedProp.value"
      :typeTitle="selectedType.title"
      :propertyTitle="selectedProp.title"
      :fixedFrontIndex="fixedFrontIndex"
      type="4"
    />
  </div>
</template>

<script>
import { POSITION } from "vue-toastification";
import {
  getBallColor,
  getNumberLabel,
  getPlayId,
  gridNumbers,
} from "~/models/balls-map";

export default {
  name: "PageLuckyDraw",
  data() {
    return {
      amount: undefined,
      activeShortcut: "",
      selectedProp: { title: "三全中", value: 44, min: 3, prefix: "1001" },
      selectedType: { title: "复式", value: 1 },
      bittingInputs: false,
      editedItem: { balls: [], amount: 0 },
      closeTimer: 0,
      selectedList: [],
      ref_rates: {},
      activeChannel: "A",
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
        subitems.forEach(({ name, play_id }) => {
          rates[play_id] = this.getBallRate(name);
        });
      });
      return rates;
    },
    gridBalls() {
      const prefix = this.selectedProp.prefix;
      return gridNumbers.map((col) =>
        col.map((ball) => ({
          play_id: getPlayId(prefix, ball),
          label: getNumberLabel(ball),
          name: getNumberLabel(ball),
          value: ball,
          color: getBallColor(ball),
        }))
      );
    },
    ballPropOptions() {
      return [
        { title: "三全中", min: 3, value: 44, prefix: "1001" },
        { title: "三中二", min: 3, value: 45, prefix: "1002" },
        { title: "二全中", min: 2, value: 41, prefix: "1003" },
        { title: "特串", min: 2, value: 43, prefix: "1004" },
        { title: "二中特", min: 2, value: 42, prefix: "1005" },
      ];
    },
    subOptions() {
      return [
        { title: "复式", value: 1 },
        { title: "胆拖", value: 2 },
      ];
    },
    fixedFrontIndex() {
      if (this.selectedType.value != 2) return -1;
      return this.selectedProp.min - 2;
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.item49Picker.setItemAmount(value);
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
      if (this.selectedList.length >= 10) this.selectedList.shift();
      this.selectedList.push(item);
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
      const prefix = this.selectedProp.prefix;
      let ids = balls.map((item) => {
        return {
          play_id: getPlayId(prefix, item),
          value: item,
          label: getNumberLabel(item),
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
    },
    isFixedFront(label) {
      if (this.selectedType.value != 2) return false;
      let index = this.selectedList.findIndex((item) => item.label == label);
      if (index == -1) return false;
      return index <= this.selectedProp.min - 2;
    },
    async openDialogBitting() {
      const min = this.selectedProp.min;
      if (this.selectedList.length < min)
        return this.$toast.error(`请至少选择 ${min} 项`, {
          position: POSITION.TOP_CENTER,
        });

      const formData = new FormData(this.$refs.formItem.$el);
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.label),
        amount: formData.get(item.play_id) || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.editedItem.minRate =
        Math.min(..._balls.map((item) => item.rate)) ||
        this.getBallRate(this.selectedList[0].label);
      this.bittingInputs = true;
    },
    getOddValues() {
      this.loadingRates = true;
      const r = Math.random().toFixed(17);
      const uid = this.$cookiz.get("m6_uid");
      const type = 4;
      const property = this.selectedProp.value;
      return this.$axios
        .$get("/api-base/GetOddsMulti", { params: { uid, r, type, property } })
        .then((res) => {
          const _refs = {};
          res.list.forEach((item) => {
            _refs[item.ball] = item.odds;
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
    onOptionChange() {
      // this.selectedType = Object.assign({}, { title: "复式", value: 1 });
      this.selectedList = [];
      setTimeout(() => {
        this.getOddValues();
      }, 200);
    },
    clearSelection() {
      this.activeShortcut = "";
      this.selectedList = [];
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
