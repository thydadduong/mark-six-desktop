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
            active-class="primary white--text"
            color="primary"
            mandatory
          >
            <v-btn
              v-for="(item, key) in propertyOptions"
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
            active-class="primary white--text"
            color="primary"
            mandatory
          >
            <v-btn
              v-for="(item, key) in subOptions"
              :key="`mode-${key}`"
              :value="item.value"
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

    <!-- <DialogBittingAmountMissing
        @saved="onSaveAmount"
        :visible.sync="bittingInputs"
        :edited-item="editedItem"
        :type="selectedProp.type"
        typeTitle="复式"
        :propertyTitle="selectedProp.title"
        :amount="inputAmount"
        :rate="minRate"
      /> -->

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import { gridNumbers } from "~/models/balls-map";

export default {
  name: "PageZixuanbuzhong",
  data() {
    return {
      selectedProp: { title: "五不中", value: 5, type: 13, property: 54 },
      minRate: "",
      selectedType: 1,
      activeShortcut: "",
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
          play_id: this.$common.getPlayId("1509", ball),
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
        { title: "五不中", value: 5, type: 13, property: 54 },
        { title: "六不中", value: 6, type: 17, property: 85 },
        { title: "七不中", value: 7, type: 16, property: 70 },
        { title: "八不中", value: 8, type: 18, property: 86 },
        { title: "九不中", value: 9, type: 19, property: 87 },
        { title: "十不中", value: 10, type: 20, property: 88 },
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
    onSelectBalls(items = [], type) {
      this.selectedList = Object.assign([], []);
      this.activeShortcut = type;

      if (items.every((item) => this.selectedList.includes(item))) {
        items.forEach((item) => {
          let index = this.selectedList.indexOf(item);
          this.selectedList.splice(index, 1);
        });
        return;
      }
      const newList = [...new Set([...this.selectedList, ...items])];
      this.selectedList = Object.assign([], newList);
    },
    clearSelection() {
      this.activeShortcut = "";
      this.selectedList = [];
    },
    openDialogBitting() {
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.label),
        amount: this.inputAmount || 0,
      }));

      this.minRate = Math.min(
        ...this.selectedList.map((item) => this.getBallRate(item.label))
      );
      this.editedItem.amount = this.inputAmount;

      this.editedItem.balls = Object.assign([], _balls);
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
      this.selectedType = 1;
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
