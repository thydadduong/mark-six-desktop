<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="1000">
        <GameActionBar>
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
        </GameActionBar>
        <GameActionBarFlat>
          <v-btn-toggle
            v-model="selectedType"
            @change="onSubOptionChange"
            active-class="primary white--text"
            color="primary"
            mandatory
          >
            <v-btn
              v-for="(item, key) in typeOptions"
              :key="`mode-${key}`"
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
            <BittingItem49
              @toggle-item="toggleSelectItem"
              :gridItems="gridBalls"
              :selectedItems="selectedList"
              :rates="itemsRate"
              ref="item49Picker"
              single-amount
            />
            <v-sheet height="8"></v-sheet>

            <ActionBarBallAmount
              v-model="editedItem.amount"
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
            class="primary--text pa-1 text-center"
          >
            最新注单
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="pa-1">
            <Shortcut49
              @click:item="onClickItem49"
              :selected-items="selectedItems"
            />
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-layout>
    <DialogBittingAmountHitAny
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :type="selectedProp.type"
      :typeTitle="selectedType.title"
      :propertyTitle="selectedProp.title"
    />
  </div>
</template>

<script>
import { gridNumbers } from "~/models/balls-map";
import { POSITION } from "vue-toastification";
import GameActionBarFlat from "~/components/GameActionBarFlat.vue";

export default {
  name: "PageTepingzhong",
  data() {
    return {
      amount: undefined,
      activeShortcut: "",
      selectedProp: { title: "一粒任中", value: 1, type: 38, property: 95 },
      selectedType: { title: "复式", value: 1 },
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [], amount: undefined },
      closeTimer: 0,
      issueId: "",
      selectedList: [],
      ref_rates: {},
      activeChannel: "A",
      loadingRates: false,
    };
  },
  computed: {
    selectedItems() {
      return this.selectedList.map((item) => item.value);
    },
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
      return gridNumbers.map((cols) =>
        cols.map((ball) => ({
          play_id: this.$common.getPlayId("2002", ball),
          label: this.$common.getNumberLabel(ball),
          name: this.$common.getNumberLabel(ball),
          value: ball,
          color: this.$common.getBallColor(ball),
        }))
      );
    },
    propertyOptions() {
      return [
        { title: "一粒任中", value: 1, type: 38, property: 95 },
        { title: "二粒任中", value: 2, type: 39, property: 96 },
        { title: "三粒任中", value: 3, type: 40, property: 97 },
        { title: "四粒任中", value: 4, type: 41, property: 98 },
        { title: "五粒任中", value: 5, type: 42, property: 99 },
      ];
    },
    typeOptions() {
      return [{ title: "复式", value: 1 }];
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.item49Picker.setItemAmount(value);
    },
    onClickInputReadonly(item) {
      this.toggleSelectItem(item);
      setTimeout(() => {
        this.$refs[item.play_id][0].focus();
      }, 100);
    },
    toggleSelectItem(item) {
      this.activeShortcut = "";
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      if (this.selectedList.length >= 10) this.selectedList.shift();
      this.selectedList.push(item);
    },
    onClickItem49(item) {
      if (!this.editedItem.amount)
        return this.$toast.error(`请先预设你的金额`, {
          position: POSITION.TOP_CENTER,
        });
      let ballItem;
      for (const column of this.gridBalls) {
        ballItem = column.find((ball) => ball.value == item);
        if (ballItem) break;
      }
      this.toggleSelectItem(ballItem);
    },
    isActive(label) {
      return !!this.selectedList.find((item) => item.label == label);
    },
    onClickShortcut(item = {}) {
      const balls = item.balls || [];
      const prefix = "2002";
      let ids = balls.map((item) => {
        return {
          play_id: this.$common.getPlayId(prefix, item),
          value: item,
          label: this.$common.getNumberLabel(item),
          color: this.$common.getBallColor(item),
        };
      });
      this.selectBalls(ids, item.value);
    },
    selectBalls(items = [], type) {
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
      this.selectedList = [];
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
        rate: this.getBallRate(item.label),
        amount: +formData.get(item.play_id) || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.editedItem.minRate = Math.min(
        ...this.selectedList.map((item) => this.getBallRate(item.label))
      );
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
    getBallRate(play_id) {
      return this.ref_rates[play_id];
    },
    onOptionChange() {
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
      setTimeout(() => {
        this.$store.dispatch("lottery/getRecentBets");
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
  components: { GameActionBarFlat },
};
</script>
