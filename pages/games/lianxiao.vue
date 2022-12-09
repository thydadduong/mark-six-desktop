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
          <v-btn-toggle v-model="selectedType" color="primary" mandatory>
            <v-btn
              v-for="(item, key) in combinedOptions"
              :key="`combined-option-${key}`"
              :value="item"
              mandatory
              small
            >
              {{ item.label }}
            </v-btn>
          </v-btn-toggle>
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
                      :key="`lucky-number-item-${key}-${subitem.name}`"
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
                        {{ getBallRate(subitem.name) }}
                      </td>
                      <td class="game-table-animal__input">
                        <input type="text" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>

            <ActionBarBallValue
              @input="openDialogBitting"
              :value.sync="inputAmount"
              class="d-none d-sm-block"
            />
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

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import { AnimalGroupedList } from "~/models/balls-map";

export default {
  name: "PageLianxiao",
  data() {
    return {
      selectedProp: { label: "二肖连", value: 2, type: 14, property: 55 },
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
      return AnimalGroupedList.map((item, index) =>
        item.map((subitem) => ({
          ...subitem,
          play_id: this.$common.getPlayId("1503", index + 1),
          balls: subitem.balls.map((ball) => ({
            label: this.$common.getNumberLabel(ball),
            value: ball,
            color: this.$common.getBallColor(ball),
          })),
        }))
      );
    },
    showInput() {
      return this.selectedList.length >= this.selectedProp.value;
    },
    propertyOptions() {
      return [
        { label: "二肖连", value: 2, type: 14, property: 55 },
        { label: "三肖连", value: 3, type: 14, property: 56 },
        { label: "四肖连", value: 4, type: 14, property: 57 },
        { label: "五肖连", value: 5, type: 14, property: 61 },
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
