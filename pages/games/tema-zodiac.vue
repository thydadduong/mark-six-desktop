<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="900">
        <GameActionBar> 特码生肖 </GameActionBar>
        <v-divider></v-divider>

        <v-card class="mb-4" flat tile>
          <v-form ref="formItem">
            <v-card-text class="pa-2">
              <PickItemAnimal
                @toggle-item="toggleSelectItem"
                :gridItems="gridBalls"
                :rates="itemsRate"
                :selectedItems="selectedList"
                ref="animalItemPicker"
              />
              <v-sheet height="8"></v-sheet>
              <ActionBarBallAmount
                v-model="amount"
                @change="setItemAmount"
                @compose="openDialogBitting"
                @clear="clearSelection"
              />
            </v-card-text>
          </v-form>
        </v-card>
      </v-sheet>
    </v-layout>

    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      type="7"
    />
  </div>
</template>

<script>
import { AnimalGroupedList } from "~/models/balls-map";
import { POSITION } from "vue-toastification";

export default {
  name: "PageLuckyDraw",
  data() {
    return {
      amount: undefined,
      countingRequired: 2,
      selectedCombined: 1,
      activeShortcut: "",
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [] },
      issueId: "",
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
        subitems.forEach(({ play_id }) => {
          rates[play_id] = this.getBallRate(play_id);
        });
      });
      return rates;
    },
    gridBalls() {
      return AnimalGroupedList.map((item) =>
        item.map((subitem) => {
          return {
            ...subitem,
            play_id: this.$common.getPlayId("1101", subitem.value),
            balls: subitem.balls.map((ball) => ({
              label: this.$common.getNumberLabel(ball),
              value: ball,
              color: this.$common.getBallColor(ball),
            })),
          };
        })
      );
    },
    requiredOptions() {
      return [
        { label: "二肖连不中", count: 2 },
        { label: "三肖连不中", count: 3 },
        { label: "四肖连不中", count: 4 },
        { label: "五肖连不中", count: 5 },
      ];
    },
    combinedOptions() {
      return [
        { label: "复式 ", count: 1 },
        { label: "复式 ", count: 2 },
      ];
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.animalItemPicker.setItemAmount(value);
    },
    toggleSelectItem(item) {
      this.activeShortcut = "";
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      this.selectedList.push(item);
    },
    isActive(play_id) {
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    onSelectBalls(item) {
      const index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) {
        this.selectedList.splice(index, 1);
        return;
      }

      if (this.selectedList.length >= 12) this.selectedList.shift();
      this.selectedList.push(item);
    },
    openDialogBitting() {
      if (!this.selectedList.length)
        return this.$toast.error(`请至少选择 1 项`, {
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
      const r = Math.random().toFixed(10);
      this.$axios
        .$get("/api-base/GetOddsAnimal", {
          params: { uid, r, gClass: 8, gameCode: "oth" },
        })
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
    switchChannel(channel) {
      this.activeChannel = channel;
      this.getOddValues(channel);
    },
    getBallRate(play_id) {
      return this.ref_rates[play_id];
    },
    clearSelection() {
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
