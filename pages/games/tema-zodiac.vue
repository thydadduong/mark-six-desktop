<template>
  <v-container>
    <v-card flat>
      <v-card-text class="pa-2">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card :disabled="loadingRates" class="mb-4" flat tile>
              <v-card class="text-center mb-2 py-2" outlined tile>
                生肖
              </v-card>
              <v-row dense>
                <v-col
                  v-for="(zodiac, key) in gridBalls"
                  :key="`lucky-number-${key}`"
                  cols="6"
                >
                  <v-card
                    @click="onSelectBalls(zodiac)"
                    flat
                    class="fill-height"
                  >
                    <CardZodiacItem
                      :active="isActive(zodiac.play_id)"
                      :name="zodiac.name"
                      :balls="zodiac.balls"
                      :rate="getBallRate(zodiac.play_id)"
                      class="fill-height"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-expand-transition>
              <div v-if="showInput">
                <ActionBarBallValue
                  @input="openDialogBitting"
                  :value.sync="inputAmount"
                  class="d-none d-sm-block"
                />
                <ActionBarBallValue
                  @input="openDialogBitting"
                  :value.sync="inputAmount"
                  class="d-sm-none"
                  mobile
                />
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-card-text>
      <DialogBittingAmount
        @saved="onSaveAmount"
        :visible.sync="bittingInputs"
        :edited-item="editedItem"
        type="7"
      />
    </v-card>

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
</template>

<script>
import { TemaZodiac } from "~/models/balls-map";

export default {
  name: "PageLuckyDraw",
  data() {
    return {
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
    gridBalls() {
      return TemaZodiac;
    },
    showInput() {
      return !!this.selectedList.length;
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
    toggleSelectItem(value) {
      this.activeShortcut = "";
      let index = this.selectedList.indexOf(value);
      if (index != -1) this.selectedList.splice(index, 1);
      else this.selectedList.push(value);
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
    clearSelection() {
      this.activeShortcut = "";
      this.selectedList = [];
    },
    openDialogBitting() {
      const _balls = this.selectedList.map((item) => ({
        ...item,
        label: item.name,
        rate: this.getBallRate(item.play_id),
        amount: this.inputAmount || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.bittingInputs = true;
    },
    getOddValues(order_type = "A") {
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
    onCountingOptionChanged() {
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
