<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="850">
        <GameActionBar>
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
              {{ item.title }}
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle v-model="selectedType" color="primary" mandatory>
            <v-btn
              v-for="(item, key) in typeOptions"
              :key="`combined-option-${key}`"
              :value="item"
              mandatory
              small
            >
              {{ item.label }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBar>

        <v-divider></v-divider>
        <v-card :disabled="loadingRates" class="pa-2" flat tile>
          <v-form ref="formItem">
            <PickItemTail
              @toggle-item="toggleSelectItem"
              :rates="itemsRate"
              :gridItems="gridBalls"
              :selectedItems="selectedList"
              ref="tailItemPicker"
            />
            <v-sheet height="8"></v-sheet>
            <ActionBarBallAmount
              @set-amount="setItemAmount"
              @compose="openDialogBitting"
              @clear="clearSelection"
            />
          </v-form>
        </v-card>
      </v-sheet>
    </v-layout>
    <DialogBittingAmountTail
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :property="selectedProp.value"
      :amount="inputAmount"
      :type="1"
      :fixedFrontIndex="fixedFrontIndex"
      :propertyTitle="selectedProp.title"
      :rate="minRate"
    />
  </div>
</template>

<script>
import { TailGridNumbersGrouped } from "~/models/balls-map";
import { POSITION } from "vue-toastification";

export default {
  name: "PageLianWei",
  data() {
    return {
      selectedProp: { title: "二连尾", count: 2, value: 64 },
      selectedType: { label: "复式", value: 1 },
      minRate: "-",
      gameType: 1,
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
      return TailGridNumbersGrouped.map((item, index) =>
        item.map((subitem) => ({
          ...subitem,
          label: subitem.name,
          play_id: this.$common.getPlayId("1504", subitem.value),
        }))
      );
    },
    showInput() {
      return this.selectedList.length >= this.selectedProp.count;
    },
    propertyOptions() {
      return [
        { title: "二连尾", count: 2, value: 64 },
        { title: "三连尾", count: 3, value: 65 },
        { title: "四连尾", count: 4, value: 66 },
      ];
    },
    typeOptions() {
      return [
        { label: "复式", value: 1 },
        { label: "胆拖 ", value: 2 },
      ];
    },
    fixedFrontIndex() {
      if (this.selectedType.value != 2) return -1;
      return this.selectedProp.count - 2;
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.tailItemPicker.setItemAmount(value);
    },
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
      if (this.selectedType.value != 2) return false;
      let index = this.selectedList.findIndex((item) => item.label == label);
      if (index == -1) return false;
      return index <= this.selectedProp.count - 2;
    },
    clearSelection() {
      this.selectedList = [];
    },
    openDialogBitting() {
      const minSelected = this.selectedProp.count;
      if (this.selectedList.length < minSelected)
        return this.$toast.error(`请至少选择 ${minSelected} 项`, {
          position: POSITION.TOP_CENTER,
        });

      const formData = new FormData(this.$refs.formItem.$el);
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.name),
        amount: formData.get(item.play_id) || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.minRate = Math.min(..._balls.map((item) => item.rate));
      this.editedItem.amount =
        Math.min(..._balls.map((item) => item.amount)) || 0;
      this.bittingInputs = true;
    },
    getOddValues() {
      this.loadingRates = true;
      const r = Math.random().toFixed(10);
      const UID = this.$cookiz.get("m6_uid");
      const property = this.selectedProp.value;
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
