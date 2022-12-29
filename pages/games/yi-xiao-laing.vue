<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="900">
        <GameActionBar> 一肖量 </GameActionBar>
        <v-divider></v-divider>

        <v-card class="pa-2" flat tile>
          <v-form ref="formItem">
            <PickItemTail2
              @toggle-item="toggleSelectItem"
              :rates="itemsRate"
              :gridItems="gridBalls"
              :selectedItems="selectedList"
              ref="tailItemPicker"
            />
            <v-sheet height="8"></v-sheet>
            <ActionBarBallAmount
              @set-amount="setItemAmount"
              @compose="openDialogBitting"
              @clear="clearSelection"
            />
          </v-form>
        </v-card>
      </v-sheet>
    </v-layout>

    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :type="7"
      :gClass="8"
      :tot_num="selectedList.length"
    />
  </div>
</template>

<script>
import { YiXiaoLiangBalls } from "~/models/balls-map";

export default {
  name: "PageYiXiaoLiang",
  data() {
    return {
      minRate: "-",
      gameType: 16,
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
      return YiXiaoLiangBalls.map((items) =>
        items.map((subitem) => ({
          ...subitem,
          label: subitem.name,
          play_id: this.$common.getPlayId("2101", subitem.value),
        }))
      );
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.tailItemPicker.setItemAmount(value);
    },
    toggleSelectItem(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      this.selectedList.push(item);
    },
    isActive(play_id) {
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    clearSelection() {
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
        rate: this.getBallRate(item.name),
        amount: formData.get(item.play_id) || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.minRate = Math.min(..._balls.map((item) => item.rate));
      this.editedItem.amount =
        Math.min(..._balls.map((item) => item.amount)) || 0;
      this.bittingInputs = true;
    },
    getOddValues() {
      this.loadingRates = true;
      const params = {
        UID: this.$cookiz.get("m6_uid"),
        r: Math.random().toFixed(10),
      };

      let _URI = "/api-base/GetOddsDistinctCount";
      params.gClass = 43;
      params.gameCode = "oth";

      this.$axios
        .$get(_URI, { params })
        .then((res) => {
          const _refs = {};
          res.list.forEach((item) => {
            const _play_id = [item.ball].join("");
            _refs[_play_id] = item.odds;
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
