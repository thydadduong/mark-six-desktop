<template>
  <v-container>
    <v-card flat>
      <v-card-text class="pa-2">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card class="mb-4" outlined tile>
              <v-sheet color="#f3f5f8">
                <v-card-text class="px-2 py-0">
                  <v-chip-group
                    v-model="selectedProp"
                    @change="onOptionChange"
                    active-class="primary--text"
                    mandatory
                    column
                  >
                    <v-chip
                      v-for="(item, key) in propertyOptions"
                      :key="`option-${key}`"
                      :value="item"
                      small
                    >
                      {{ item.title }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text class="px-2 py-0">
                  <v-chip-group
                    v-model="selectedType"
                    @change="onSubOptionChange"
                    active-class="primary--text"
                    mandatory
                  >
                    <v-chip
                      v-for="(item, key) in subOptions"
                      :key="`mode-${key}`"
                      :value="item"
                      small
                    >
                      {{ item.title }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-sheet>
            </v-card>
            <v-card :disabled="loadingRates" class="mb-4" flat tile>
              <v-layout class="gap-sm">
                <v-layout
                  v-for="(luckNumbs, key) in gridBalls"
                  :key="`lucky-number-${key}`"
                  class="gap-sm"
                  style="width: 20%"
                  column
                >
                  <CardBoardItem
                    v-for="item in luckNumbs"
                    @toggle="toggleSelectItem(item)"
                    :key="`lucky-number-item-${key}-${item.play_id}`"
                    :color="item.color"
                    :title="item.label"
                    :active="isActive(item.play_id)"
                    :rate="getBallRate(item.label)"
                  />
                  <v-card
                    @click="clearSelection"
                    color="error lighten-1"
                    v-if="key == 4"
                    height="100%"
                    flat
                    dark
                  >
                    <v-layout class="fill-height" justify-center align-center>
                      <v-icon>mdi-close</v-icon>
                    </v-layout>
                  </v-card>
                </v-layout>
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
      <DialogBittingAmountHit
        @saved="onSaveAmount"
        :visible.sync="bittingInputs"
        :edited-item="editedItem"
        :type="selectedProp.type"
        :typeTitle="selectedType.title"
        :propertyTitle="selectedProp.title"
      />
    </v-card>
    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
</template>

<script>
import { gridNumbers } from "~/models/balls-map";

export default {
  name: "PageZixuanZhongYi",
  data() {
    return {
      selectedProp: { title: "五中一", value: 5, type: 30, property: 89 },
      selectedType: { title: "复式", value: 1 },
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [] },
      closeTimer: 0,
      issueId: "",
      selectedList: [],
      ref_rates: {},
      activeChannel: "A",
      loadingRates: false,
    };
  },
  computed: {
    gridBalls() {
      return gridNumbers.map((cols) =>
        cols.map((ball) => ({
          play_id: this.$common.getPlayId("2001", ball),
          label: this.$common.getNumberLabel(ball),
          value: ball,
          color: this.$common.getBallColor(ball),
        }))
      );
    },
    showInput() {
      return this.selectedList.length >= this.selectedProp.value;
    },
    propertyOptions() {
      return [
        { title: "五中一", value: 5, type: 30, property: 89 },
        { title: "六中一", value: 6, type: 31, property: 90 },
        { title: "七中一", value: 7, type: 32, property: 91 },
        { title: "八中一", value: 8, type: 33, property: 92 },
        { title: "九中一", value: 9, type: 34, property: 93 },
        { title: "十中一", value: 10, type: 35, property: 94 },
      ];
    },
    subOptions() {
      return [{ title: "复式", value: 1 }];
    },
  },
  methods: {
    toggleSelectItem(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      let mapMax = { 5: 8, 6: 9, 7: 10, 9: 11, 10: 12 };
      if (this.selectedList.length >= mapMax[this.selectedProp.value])
        this.selectedList.shift();
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
        rate: this.getBallRate(item.label),
        amount: this.inputAmount || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.editedItem.amount = this.inputAmount || 0;
      this.editedItem.minRate = Math.min(
        ...this.selectedList.map((item) => this.getBallRate(item.label))
      );
      this.bittingInputs = true;
    },
    getIssueID(uid) {
      const r = Math.random().toFixed(7);
      this.$axios
        .$get("/api-base/GetIssueId", { params: { uid, r } })
        .then((res) => {
          this.issueId = res.issue;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getOddValues() {
      this.loadingRates = true;
      const r = Math.random().toFixed(17);
      const uid = this.$cookiz.get("m6_uid");
      const type = this.selectedProp?.type;
      const property = this.selectedProp?.property;
      this.$axios
        .$get("/api-base/GetOddsMulti", { params: { uid, r, type, property } })
        .then((res) => {
          const _refs = {};
          res.list?.forEach((item) => {
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
    switchChannel(channel) {
      this.activeChannel = channel;
      const uid = this.$cookiz.get("m6_uid");
      this.getOddValues(uid, channel);
    },
    getBallRate(play_id) {
      return this.ref_rates[play_id];
    },
    onOptionChange() {
      this.selectedList = [];
      this.getOddValues();
    },
    onSubOptionChange() {
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
