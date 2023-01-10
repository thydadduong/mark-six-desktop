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
              {{ item.title }}
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
              v-for="(item, key) in typeOptions"
              :key="`combined-option-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              small
            >
              {{ item.title }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBarFlat>

        <v-divider></v-divider>
        <v-card class="pa-2" flat tile>
          <v-form ref="formItem">
            <PickItemTail
              @toggle-item="toggleSelectItem"
              :disabled="gameClosed"
              :rates="itemsRate"
              :gridItems="gridBalls"
              :selectedItems="selectedList"
              :type="selectedType.value"
              :fixedFront="selectedProp.count - 2"
              ref="tailItemPicker"
              single-amount
            />
            <v-sheet height="8"></v-sheet>
            <ActionBarBallAmount
              v-model="editedItem.amount"
              @compose="openDialogBitting"
              @clear="clearSelection"
              :disabled="gameClosed"
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
import { mapState } from 'vuex';

export default {
  name: "PageLianWeiBuZhong",
  data() {
    return {
      amount: undefined,
      selectedProp: { label: "二连尾不中", count: 2, value: 67 },
      selectedType: { label: "复式", value: 1 },
      minRate: "-",
      activeShortcut: "",
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
