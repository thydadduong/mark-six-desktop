<template>
  <v-container>
    <v-card flat>
      <v-card-text class="pa-2">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card class="mb-4" outlined tile>
              <v-sheet color="grey lighten-4">
                <v-card-text class="py-0 px-2">
                  <v-layout class="gap-sm">
                    <v-chip-group
                      v-model="selectedProperty"
                      @change="onCountingOptionChanged"
                      color="primary"
                      mandatory
                      column
                    >
                      <v-chip
                        v-for="(item, key) in propertyOptions"
                        :key="`item-${key}`"
                        :value="item"
                        small
                      >
                        {{ item.label }}
                      </v-chip>
                    </v-chip-group>
                  </v-layout>
                </v-card-text>
              </v-sheet>
            </v-card>

            <v-card :disabled="loadingRates" class="mb-4" flat tile>
              <v-layout wrap>
                <v-sheet
                  v-for="(item, key) in gridBalls"
                  :key="`lucky-number-${key}`"
                  class="pa-1"
                  width="calc(100% / 5)"
                  cols="3"
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
      />
    </v-card>

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
</template>

<script>
import { TailGridNumbers } from "~/models/balls-map";

export default {
  name: "PageLianWei",
  data() {
    return {
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
    gridBalls() {
      let _prefix = this.selectedProperty.value == 2 ? "1701" : "1401";
      return TailGridNumbers.map((item, index) => ({
        ...item,
        label: item.name,
        value: index,
        play_id: this.$common.getPlayId(_prefix, index),
      }));
    },
    showInput() {
      return !!this.selectedList.length;
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
