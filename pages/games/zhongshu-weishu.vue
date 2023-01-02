<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="900">
        <GameActionBar>
          <v-btn-toggle
            v-model="selectedProperty"
            @change="onCountingOptionChanged"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn
              v-for="(item, key) in propertyOptions"
              :key="`item-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              small
            >
              {{ item.label }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBar>

        <v-divider></v-divider>
        <v-card class="pa-2" flat tile>
          <v-form ref="formItem">
            <PickItemTail
              @toggle-item="toggleSelectItem"
              :rates="itemsRate"
              :gridItems="gridBalls"
              :selectedItems="selectedList"
              ref="tailItemPicker"
            />
            <v-sheet height="8"></v-sheet>
            <ActionBarBallAmount
              v-model="amount"
              @change="setItemAmount"
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
    />
  </div>
</template>

<script>
import { TailGridNumbersGrouped } from "~/models/balls-map";

export default {
  name: "PageLianWei",
  data() {
    return {
      amount: undefined,
      minRate: "-",
      selectedProperty: { label: "尾数中，", count: 2, value: 1 },
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
      let _prefix = this.selectedProperty.value == 2 ? "1701" : "1401";
      return TailGridNumbersGrouped.map((item) =>
        item.map((subitem) => ({
          ...subitem,
          label: subitem.name,
          play_id: this.$common.getPlayId(_prefix, subitem.value),
        }))
      );
    },
    propertyOptions() {
      return [
        { label: "尾数中", count: 1, value: 1 },
        { label: "尾数不中", count: 1, value: 2 },
      ];
    },
    propertyType() {
      const mapped = { 2: 64, 3: 65, 4: 66 };
      return mapped[this.selectedProperty];
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.tailItemPicker.setItemAmount(value);
    },
    setItemAmountIndividual(play_id, value) {
      this.$refs.tailItemPicker.setItemAmountIndividual(play_id, value);
    },
    toggleSelectItem(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      this.selectedList.push(item);
      this.setItemAmountIndividual(item.play_id, this.amount);
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

      let _URI = "/api-base/GetOdds";
      if (this.selectedProperty.value == 2) {
        _URI = "/api-base/GetOddsSumMissingTail";
        params.gClass = 29;
        params.gameCode = "oth";
      } else {
        params.type = 16;
      }
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
    onCountingOptionChanged() {
      this.selectedList = [];
      this.getOddValues();
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
