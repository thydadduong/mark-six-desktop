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
                  >
                    <v-chip
                      v-for="(item, key) in ballPropOptions"
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
              <v-layout v-if="selectedType.value == 2" class="gap-sm">
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
                    :secondary="isFixedFront(item.label)"
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
              <v-layout v-else class="gap-sm">
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
      <DialogBittingAmountLianma
        @saved="onSaveAmount"
        :visible.sync="bittingInputs"
        :edited-item="editedItem"
        :saveMultiple="selectedType.value == 1"
        :property="selectedProp.value"
        :typeTitle="selectedType.title"
        :propertyTitle="selectedProp.title"
        :amount="inputAmount"
        :fixedFrontIndex="fixedFrontIndex"
        type="4"
      />
    </v-card>

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
</template>

<script>
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
      selectedProp: { title: "三全中", value: 44, min: 3, prefix: "1001" },
      selectedType: { title: "复式", value: 1 },
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [] },
      closeTimer: 0,
      selectedList: [],
      ref_rates: {},
      activeChannel: "A",
      loadingRates: false,
    };
  },
  computed: {
    gridBalls() {
      return gridNumbers.map((col) =>
        col.map((ball) => ({
          play_id: getPlayId(this.selectedProp.prefix, ball),
          label: getNumberLabel(ball),
          value: ball,
          color: getBallColor(ball),
        }))
      );
    },
    showInput() {
      return this.selectedList.length >= this.selectedProp.min;
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
      // if (this.selectedProp < 44)
      //   return [
      //     { title: "复式", value: 1 },
      //     { title: "胆拖", value: 2 },
      //     { title: "生肖对碰", value: 3 },
      //     { title: "尾数对碰", value: 4 },
      //     { title: "肖尾对碰", value: 5 },
      //   ];
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
    toggleSelectItem(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      if (this.selectedList.length >= 10) this.selectedList.shift();
      this.selectedList.push(item);
    },
    isFixedFront(label) {
      if (this.selectedType.value != 2) return false;
      let index = this.selectedList.findIndex((item) => item.label == label);
      if (index == -1) return false;
      return index <= this.selectedProp.min - 2;
    },
    isActive(play_id) {
      6;
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    clearSelection() {
      this.selectedList = [];
    },
    async openDialogBitting() {
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.label),
        amount: this.inputAmount || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.editedItem.amount = this.inputAmount || 0;
      this.editedItem.minRate =
        Math.min(
          ...this.selectedList.map((item) => this.getBallRate(item.label))
        ) || this.getBallRate(this.selectedList[0].label);
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
