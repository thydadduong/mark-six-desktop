<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          <v-btn-toggle
            v-model="minSelection"
            @change="onCountingOptionChanged"
            color="primary"
            mandatory
            column
          >
            <v-btn
              v-for="(item, key) in requiredOptions"
              :key="`item-${key}`"
              :value="item.count"
              small
            >
              {{ item.label }}
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle v-model="gameType" color="primary" mandatory>
            <v-btn
              v-for="(item, key) in combinedOptions"
              :key="`combined-option-${key}`"
              :value="item.count"
              small
            >
              {{ item.label }}
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
                    <td class="primary--text">{{ item.name }}</td>
                    <td>{{ getBallRate(item.name) }}</td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-layout>
          </v-layout>
          <v-sheet height="8"></v-sheet>

          <ActionBarBallValue
            @input="openDialogBitting"
            :value.sync="inputAmount"
            class="d-none d-sm-block"
          />
        </v-card>
      </v-sheet>

      <v-sheet
        class="flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      >
        <v-card flat tile>
          <v-card-text
            style="background: linear-gradient(0deg, #dae8fc, #fff)"
            class="primary--text py-1 px-2"
          >
            <v-sheet height="24" color="transparent"></v-sheet>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-layout>
    <DialogBittingAmountTail
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :property="propertyType"
      :amount="inputAmount"
      :type="1"
      :fixedFrontIndex="fixedFrontIndex"
      :propertyTitle="propertyTitle"
      :rate="minRate"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import { TailGridNumbersGrouped } from "~/models/balls-map";

export default {
  name: "PageLianWeiBuZhong",
  data() {
    return {
      minRate: "-",
      minSelection: 2,
      gameType: 1,
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
      return TailGridNumbersGrouped.map((item, index) =>
        item.map((subitem) => ({
          ...subitem,
          label: item.name,
          value: index,
          play_id: this.$common.getPlayId("1502", index),
        }))
      );
    },
    showInput() {
      return this.selectedList.length >= this.minSelection;
    },
    propertyTitle() {
      return this.requiredOptions.find(
        (item) => this.minSelection == item.count
      )?.label;
    },
    requiredOptions() {
      return [
        { label: "二连尾不中", count: 2 },
        { label: "三连尾不中", count: 3 },
        { label: "四连尾不中", count: 4 },
        // { label: "五连尾不中", count: 5 },
      ];
    },
    propertyType() {
      const mapped = { 2: 67, 3: 68, 4: 69 };
      return mapped[this.minSelection];
    },
    combinedOptions() {
      return [
        { label: "复式 ", count: 1 },
        { label: "胆拖 ", count: 2 },
      ];
    },
    fixedFrontIndex() {
      if (this.gameType != 2) return -1;
      return this.minSelection - 2;
    },
  },
  methods: {
    toggleSelectItem(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);

      if (this.selectedList.length >= 8) this.selectedList.shift();
      this.selectedList.push(item);
    },
    isActive(play_id) {
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    isFixedFront(label) {
      if (this.gameType != 2) return false;
      let index = this.selectedList.findIndex((item) => item.label == label);
      if (index == -1) return false;
      return index <= this.minSelection - 2;
    },
    onSelectBalls(play_id) {
      const index = this.selectedList.findIndex((_id) => _id == play_id);
      if (index != -1) {
        this.selectedList.splice(index, 1);
        return;
      }

      if (this.minSelection == this.selectedList.length) {
        this.selectedList.shift();
      }
      this.selectedList.push(play_id);
    },
    clearSelection() {
      this.activeShortcut = "";
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
      const r = Math.random().toFixed(10);
      const UID = this.$cookiz.get("m6_uid");
      const property = this.propertyType;
      this.$axios
        .$get("/api-base/GetOddsMulti", {
          params: { UID, r, property, type: 15 },
        })
        .then((res) => {
          const _refs = {};
          res.list.forEach((item) => {
            const _play_id = [item.ball].join("");
            _refs[_play_id] = item.odds;
          });
          this.ref_rates = Object.assign({}, _refs);
          this.loadingRates = false;
          // const _refs = {};
          // res.list.forEach((item) => {
          //   _refs[item.play_id] = item.odds;
          // });
          // this.ref_rates = Object.assign({}, _refs);
          // this.loadingRates = false;
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
      // this.gameType = 1;
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
