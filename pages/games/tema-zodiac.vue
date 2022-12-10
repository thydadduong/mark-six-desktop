<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          特码生肖
        </v-card-text>
        <v-divider></v-divider>

        <v-card :disabled="loadingRates" class="mb-4" flat tile>
          <v-card class="text-center grey lighten-3" flat tile> 生肖 </v-card>
          <v-card-text class="pa-2">
            <v-row dense>
              <v-col
                v-for="(item, key) in gridBalls"
                :key="`lucky-number-${key}`"
                cols="6"
              >
                <table class="game-table-animal">
                  <tbody>
                    <tr
                      v-for="subitem in item"
                      :key="`lucky-number-item-${key}-${subitem.play_id}`"
                    >
                      <td class="game-table-animal__label">
                        {{ subitem.name }}
                      </td>
                      <td class="game-table-animal__balls pb-0 px-4">
                        <v-avatar
                          v-for="(ball, index) in subitem.balls"
                          :key="`ball-${key}-${subitem.play_id}-${index}`"
                          :color="$common.getBallColor(ball.value)"
                          class="white--text mr-1 mb-1"
                          size="26"
                        >
                          <small class="font-weight-bold">
                            {{ ball.label || "-" }}
                          </small>
                        </v-avatar>
                      </td>
                      <td class="game-table-animal__odd">
                        {{ getBallRate(subitem.play_id) }}
                      </td>
                      <td class="game-table-animal__input">
                        <input type="text" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
          </v-card-text>
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

    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      type="7"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import { AnimalGroupedList } from "~/models/balls-map";

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
      return AnimalGroupedList.map((item) =>
        item.map((subitem) => {
          return {
            ...subitem,
            play_id: this.$common.getPlayId("1101", subitem.value),
            balls: subitem.balls.map((ball) => ({
              label: this.$common.getNumberLabel(ball),
              value: ball,
              color: this.$common.getBallColor(ball),
            })),
          };
        })
      );
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
