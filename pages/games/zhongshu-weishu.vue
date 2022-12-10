<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          <v-btn-toggle
            v-model="selectedProperty"
            @change="onCountingOptionChanged"
            color="primary"
            mandatory
            column
          >
            <v-btn
              v-for="(item, key) in propertyOptions"
              :key="`item-${key}`"
              :value="item"
              small
            >
              {{ item.label }}
            </v-btn>
          </v-btn-toggle>
      
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
                    v-for="(item, subindex) in luckNumbs"
                    :key="`lucky-number-item-${key}-${subindex}`"
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
    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import { TailGridNumbersGrouped } from "~/models/balls-map";

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
      return TailGridNumbersGrouped.map((item, index) =>
        item.map((subitem) => ({
          ...subitem,
          label: item.name,
          value: index,
          play_id: this.$common.getPlayId(_prefix, index),
        }))
      );
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
