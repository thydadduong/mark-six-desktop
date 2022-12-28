<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="850">
        <GameActionBar> 五行 </GameActionBar>
        <v-divider></v-divider>

        <v-card :disabled="loadingRates" class="mb-4" flat tile>
          <v-form ref="formItem">
            <v-card class="text-center grey lighten-3" flat tile> 生肖 </v-card>
            <v-card-text class="pa-2">
              <PickItemBanbo
                @toggle-item="toggleSelectItem"
                :gridItems="gridBalls"
                :selectedItems="selectedList"
                :rates="itemsRate"
                ref="wuhangItemPicker"
              />
              <v-sheet height="8"></v-sheet>
              <ActionBarBallAmount
                @set-amount="setItemAmount"
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
      :type="14"
      :gClass="8"
      :tot_num="selectedList.length"
    />
  </div>
</template>

<script>
import { POSITION } from "vue-toastification";

export default {
  name: "PageWuhang",
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
      this.gridBalls.forEach(({ name, play_id }) => {
        rates[play_id] = this.getBallRate(name);
      });
      return rates;
    },
    gridBalls() {
      return [
        {
          name: "金",
          color: "",
          play_id: "190101",
          balls: ["01", "06", "11", "16", "21", "26", "31", "36", "41", "46"],
        },
        {
          name: "木",
          color: "",
          play_id: "190102",
          balls: ["02", "07", "12", "17", "22", "27", "32", "37", "42", "47"],
        },
        {
          name: "水",
          color: "",
          play_id: "190103",
          balls: ["03", "08", "13", "18", "23", "28", "33", "38", "43", "48"],
        },
        {
          name: "火",
          color: "",
          play_id: "190104",
          balls: ["04", "09", "14", "19", "24", "29", "34", "39", "44", "49"],
        },
        {
          name: "土",
          color: "",
          play_id: "190105",
          balls: ["05", "10", "15", "20", "25", "30", "35", "40", "45"],
        },
      ];
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.wuhangItemPicker.setItemAmount(value);
    },
    toggleSelectItem(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      this.selectedList.push(item);
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

      let _URI = "/api-base/GetOddsFiveCates";
      params.gClass = 37;
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
