<template>
  <v-container>
    <v-card flat>
      <v-card-text class="pa-2">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card class="mb-4" outlined tile>
              <v-sheet color="grey lighten-4">
                <v-card-text class="py-0 pb-1 px-2">
                  <v-layout class="gap-sm">
                    <v-chip-group
                      v-model="selectedProp"
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
              <v-row dense>
                <v-col
                  v-for="(zodiac, key) in gridBalls"
                  :key="`lucky-number-${key}`"
                  cols="6"
                >
                  <v-card
                    @click="onSelectBalls(zodiac)"
                    class="fill-height"
                    flat
                  >
                    <CardZodiacItem
                      :active="isActive(zodiac.play_id)"
                      :name="zodiac.name"
                      :balls="zodiac.balls"
                      :rate="getBallRate(zodiac.name)"
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
        :type="saveType"
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
import { AnimalList } from "~/models/balls-map";

export default {
  name: "PageLianxiao",
  data() {
    return {
      selectedProp: { label: "二肖连", value: 1, type: 14, property: 55 },
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
      const _prefix = this.selectedProp.value == 1 ? "1301" : "1601";
      return AnimalList.map((item, index) => ({
        ...item,
        play_id: this.$common.getPlayId(_prefix, index + 1),
        balls: item.balls.map((ball) => ({
          label: this.$common.getNumberLabel(ball),
          value: ball,
          color: this.$common.getBallColor(ball),
        })),
      }));
    },
    saveType() {
      return this.selectedProp.value == 1 ? 19 : 7;
    },
    showInput() {
      return !!this.selectedList.length;
    },
    propertyOptions() {
      return [
        { label: "一肖中", value: 1, type: 14, property: 55 },
        { label: "一肖不中", value: 2, type: 14, property: 56 },
      ];
    },
  },
  methods: {
    isActive(play_id) {
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    onSelectBalls(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);

      this.selectedList.push(item);
    },
    openDialogBitting() {
      const _balls = this.selectedList.map((item) => ({
        ...item,
        label: item.name,
        rate: this.getBallRate(item.name),
        amount: this.inputAmount || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.editedItem.amount = this.inputAmount || 0;
      this.editedItem.minRate = Math.min(
        ...this.selectedList.map((item) => this.getBallRate(item.name))
      );
      this.bittingInputs = true;
    },
    getOddValues() {
      this.loadingRates = true;
      let _URI = "/api-base/GetOdds";
      const params = {
        UID: this.$cookiz.get("m6_uid"),
        r: Math.random().toFixed(17),
      };
      if (this.selectedProp.value == 2) {
        _URI = "/api-base/GetOddsOneAnimalMissing";
        params.gClass = 28;
        params.gameCode = "oth";
      } else params.type = 16;

      this.$axios
        .$get(_URI, { params })
        .then((res) => {
          const _refs = {};
          res.list?.forEach((item) => {
            _refs[item.ball] = item.odds;
          });
          this.ref_rates = Object.assign({}, _refs);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
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
