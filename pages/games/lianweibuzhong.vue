<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
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
              small
            >
              {{ item.title }}
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
      :property="selectedProp.value"
      :amount="inputAmount"
      :type="1"
      :fixedFrontIndex="fixedFrontIndex"
      :propertyTitle="selectedProp.title"
      :rate="minRate"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import { TailGridNumbersGrouped } from "~/models/balls-map";
import { POSITION } from "vue-toastification";

export default {
  name: "PageLianWeiBuZhong",
  data() {
    return {
      selectedProp: { label: "二连尾不中", count: 2, value: 67 },
      selectedType: { label: "复式", value: 1 },
      minRate: "-",
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
      return TailGridNumbersGrouped.map((item) =>
        item.map((subitem) => ({
          ...subitem,
          label: subitem.name,
          play_id: this.$common.getPlayId("1502", subitem.value),
        }))
      );
    },
    propertyOptions() {
      return [
        { title: "二连尾不中", count: 2, value: 67 },
        { title: "三连尾不中", count: 3, value: 68 },
        { title: "四连尾不中", count: 4, value: 69 },
      ];
    },
    typeOptions() {
      return [
        { title: "复式 ", value: 1 },
        { title: "胆拖 ", value: 2 },
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
    onSelectBalls(play_id) {
      const index = this.selectedList.findIndex((_id) => _id == play_id);
      if (index != -1) {
        this.selectedList.splice(index, 1);
        return;
      }

      if (this.selectedProp.count == this.selectedList.length) {
        this.selectedList.shift();
      }
      this.selectedList.push(play_id);
    },
    clearSelection() {
      this.activeShortcut = "";
      this.selectedList = [];
    },
    openDialogBitting() {
      const min = this.selectedProp.count;
      if (this.selectedList.length < min)
        return this.$toast.error(`请至少选择 ${min} 项`, {
          position: POSITION.TOP_CENTER,
        });

      const formData = new FormData(this.$refs.formItem.$el);
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.name),
        amount: formData.get(item.play_id) || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.editedItem.amount =
        Math.min(..._balls.map((item) => item.amount)) || 0;
      this.minRate = Math.min(..._balls.map((item) => item.rate));
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
