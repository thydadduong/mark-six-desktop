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
              <v-divider></v-divider>
              <v-sheet color="grey lighten-4">
                <v-card-text class="py-0 px-2">
                  <v-layout class="gap-sm">
                    <v-chip-group
                      v-model="selectedType"
                      color="primary"
                      mandatory
                    >
                      <v-chip
                        v-for="(item, key) in combinedOptions"
                        :key="`combined-option-${key}`"
                        :value="item"
                        mandatory
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
                      :secondary="isFixedFront(zodiac.name)"
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
      <DialogBittingAmountAnimalMulti
        @saved="onSaveAmount"
        :visible.sync="bittingInputs"
        :edited-item="editedItem"
        :typeTitle="selectedType.label"
        :property="selectedProp.property"
        :propertyTitle="selectedProp.label"
        :fixedFrontIndex="fixedFrontIndex"
        :type="1"
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
  name: "PageLianxiaobuzhong",
  data() {
    return {
      selectedProp: { label: "二肖连不中", value: 2, type: 14, property: 58 },
      selectedType: { label: "复式 ", value: 1 },
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
      return AnimalList.map((item, index) => ({
        ...item,
        play_id: this.$common.getPlayId("1503", index + 1),
        balls: item.balls.map((ball) => ({
          label: this.$common.getNumberLabel(ball),
          value: ball,
          color: this.$common.getBallColor(ball),
        })),
      }));
    },
    showInput() {
      return this.selectedList.length >= this.selectedProp.value;
    },
    propertyOptions() {
      return [
        { label: "二肖连不中", value: 2, type: 14, property: 58 },
        { label: "三肖连不中", value: 3, type: 14, property: 59 },
        { label: "四肖连不中", value: 4, type: 14, property: 60 },
        { label: "五肖连不中", value: 5, type: 14, property: 62 },
      ];
    },
    combinedOptions() {
      return [
        { label: "复式 ", value: 1 },
        { label: "胆拖 ", value: 2 },
      ];
    },
    fixedFrontIndex() {
      if (this.selectedType.value != 2) return -1;
      return this.selectedProp.value - 2;
    },
  },
  methods: {
    isActive(play_id) {
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    isFixedFront(label) {
      if (this.selectedType.value != 2) return false;
      let index = this.selectedList.findIndex((item) => item.name == label);
      if (index == -1) return false;
      return index <= this.selectedProp.value - 2;
    },
    onSelectBalls(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );

      if (index != -1) return this.selectedList.splice(index, 1);

      if (this.selectedList.length >= 8) this.selectedList.shift();
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
      // this.selectedType = Object.assign({}, { label: "复式 ", value: 1 });
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
