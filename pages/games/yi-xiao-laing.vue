<template>
  <v-container>
    <v-card flat>
      <v-card-text class="pa-2">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card class="text-center mb-4 py-2" outlined tile>
              生肖量
            </v-card>
            <v-card :disabled="loadingRates" class="mb-4" flat tile>
              <v-layout wrap>
                <v-sheet
                  v-for="(item, key) in gridBalls"
                  :key="`lucky-number-${key}`"
                  class="pa-1"
                  width="calc(100% / 3)"
                >
                  <CardBoardItem
                    @toggle="toggleSelectItem(item)"
                    :key="`lucky-number-item-${key}-${item.play_id}`"
                    :title="item.label"
                    :active="isActive(item.play_id)"
                    :rate="getBallRate(item.name)"
                    splitTitle
                  />
                </v-sheet>
              </v-layout>
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
        :type="7"
        :gClass="8"
        :tot_num="selectedList.length"
      />
    </v-card>

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
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
    gridBalls() {
      return YiXiaoLiangBalls.map((item) => ({
        ...item,
        label: item.name,
        play_id: this.$common.getPlayId("2101", item.value),
      }));
    },
    showInput() {
      return !!this.selectedList.length;
    },
  },
  methods: {
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
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.name),
        amount: this.inputAmount || 0,
      }));
      this.minRate = Math.min(
        ...this.selectedList.map((item) => this.getBallRate(item.name))
      );

      this.editedItem.balls = Object.assign([], _balls);
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
