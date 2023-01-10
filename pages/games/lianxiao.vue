<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="1000">
        <GameActionBar>
          <v-btn-toggle
            v-model="selectedProp"
            @change="onCountingOptionChanged"
            active-class="primary white--text"
            color="primary"
            mandatory
            column
          >
            <v-btn
              v-for="(item, key) in propertyOptions"
              :key="`item-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              small
            >
              {{ item.label }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBar>
        <GameActionBarFlat>
          <v-btn-toggle
            v-model="selectedType"
            active-class="primary white--text"
            color="primary"
            mandatory
          >
            <v-btn
              v-for="(item, key) in combinedOptions"
              :key="`combined-option-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              mandatory
              small
            >
              {{ item.label }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBarFlat>
        <v-divider></v-divider>

        <v-card class="mb-4" flat tile>
          <v-form ref="formItem">
            <v-card-text class="pa-2">
              <PickItemAnimal
                @toggle-item="toggleSelectItem"
                :disabled="gameClosed"
                :rates="itemsRate"
                :gridItems="gridBalls"
                :selectedItems="selectedList"
                :type="selectedType.value"
                :fixedFront="selectedProp.value - 2"
                ref="animalItemPicker"
                single-amount
              />

              <v-sheet height="8"></v-sheet>
              <ActionBarBallAmount
                v-model="editedItem.amount"
                @compose="openDialogBitting"
                @clear="clearSelection"
                :disabled="gameClosed"
              />
            </v-card-text>
          </v-form>
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
  </div>
</template>

<script>
import { POSITION } from "vue-toastification";
import { AnimalGroupedList } from "~/models/balls-map";
import { mapState } from "vuex";

export default {
  name: "PageLianxiao",
  data() {
    return {
      selectedProp: { label: "二肖连", value: 2, type: 14, property: 55 },
      selectedType: { label: "复式 ", value: 1 },
      activeShortcut: "",
      bittingInputs: false,
      editedItem: { balls: [], amount: undefined },
      issueId: "",
      selectedList: [],
      ref_rates: {},
      activeChannel: "A",
      loadingRates: false,
    };
  },
  computed: {
    ...mapState("game", { gameClosed: "closed" }),
    itemsRate() {
      const rates = {};
      this.gridBalls.forEach((subitems) => {
        subitems.forEach(({ name, play_id }) => {
          rates[play_id] = this.getBallRate(name);
        });
      });
      return rates;
    },
    gridBalls() {
      return AnimalGroupedList.map((item) =>
        item.map((subitem) => ({
          ...subitem,
          play_id: this.$common.getPlayId("1503", subitem.value),
          label: this.$common.getPlayId("1503", subitem.value),
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
    setItemAmount(value) {
      this.$refs.animalItemPicker.setItemAmount(value);
    },
    toggleSelectItem(item) {
      this.activeShortcut = "";
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
    openDialogBitting() {
      const minSelected = this.selectedProp.value;
      if (this.selectedList.length < minSelected)
        return this.$toast.error(`请至少选择 ${minSelected} 项`, {
          position: POSITION.TOP_CENTER,
        });

      const formData = new FormData(this.$refs.formItem.$el);
      const _balls = this.selectedList.map((item) => ({
        ...item,
        label: item.name,
        rate: this.getBallRate(item.name),
        amount: formData.get(item.play_id) || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.editedItem.minRate = Math.min(..._balls.map((item) => item.rate));
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
    clearSelection() {
      this.selectedList = [];
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
      setTimeout(() => {
        this.$store.dispatch("lottery/getRecentBets");
        this.$store.dispatch("profile/fetchBasicItem");
      }, 1000);
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
