<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
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
          <v-btn-toggle
            v-model="selectedType"
            @change="onSubOptionChange"
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
        </v-card-text>
        <v-divider></v-divider>
        <v-card :disabled="loadingRates" class="pa-2" flat tile>
          <v-layout class="gap-xs">
            <v-layout
              v-for="(luckNumbs, key) in gridBalls"
              :key="`lucky-number-${key}`"
              class="gap-sm"
              style="width: 20%"
              column
            >
              <table class="game-item-table">
                <tbody>
                  <tr
                    v-for="item in luckNumbs"
                    :key="`lucky-number-item-${key}-${item.play_id}`"
                  >
                    <td>
                      <v-avatar
                        :color="$common.getBallColor(item.value)"
                        class="white--text"
                        size="26"
                      >
                        <small class="font-weight-bold">
                          {{ item.label || "-" }}
                        </small>
                      </v-avatar>
                    </td>
                    <td>{{ getBallRate(item.label) }}</td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                  <!-- :secondary="isFixedFront(item.label)"
                    :active="isActive(item.play_id)" -->

                  <tr v-if="key == 4">
                    <td><v-sheet color="transparent" height="26"></v-sheet></td>
                    <td><v-sheet color="transparent" height="26"></v-sheet></td>
                    <td><v-sheet color="transparent" height="26"></v-sheet></td>
                  </tr>
                </tbody>
              </table>
            </v-layout>
          </v-layout>
          <v-sheet height="8"></v-sheet>
          <ActionBarBallValue
            @input="openDialogBitting"
            :value.sync="inputAmount"
          />
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
      :amount="inputAmount"
      :fixedFrontIndex="fixedFrontIndex"
      type="4"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
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
