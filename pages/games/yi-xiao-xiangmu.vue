<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent" width="900">
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
              {{ item.label }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBar>
        <v-divider></v-divider>

        <v-card class="mb-4" flat tile>
          <v-form ref="formItem">
            <v-card class="text-center grey lighten-3" flat tile> 生肖 </v-card>
            <v-card-text class="pa-2">
              <PickItemAnimal
                @toggle-item="toggleSelectItem"
                :rates="itemsRate"
                :gridItems="gridBalls"
                :selectedItems="selectedList"
                ref="animalItemPicker"
              />

              <v-sheet height="8"></v-sheet>
              <ActionBarBallAmount
                @set-amount="setItemAmount"
                @compose="openDialogBitting"
                @clear="clearSelection"
              />
            </v-card-text>
          </v-form>
        </v-card>
      </v-sheet>
    </v-layout>

    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :type="saveType"
      :gClass="8"
      :tot_num="selectedList.length"
    />
  </div>
</template>

<script>
import { AnimalGroupedList } from "~/models/balls-map";
import { POSITION } from "vue-toastification";

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
      const _prefix = this.selectedProp.value == 1 ? "1301" : "1601";
      return AnimalGroupedList.map((item, index) =>
        item.map((subitem) => ({
          ...subitem,
          play_id: this.$common.getPlayId(_prefix, subitem.value),
          balls: subitem.balls.map((ball) => ({
            label: this.$common.getNumberLabel(ball),
            value: ball,
            color: this.$common.getBallColor(ball),
          })),
        }))
      );
    },
    saveType() {
      return this.selectedProp.value == 1 ? 19 : 7;
    },
    propertyOptions() {
      return [
        { label: "一肖中", value: 1, type: 14, property: 55 },
        { label: "一肖不中", value: 2, type: 14, property: 56 },
      ];
    },
  },
  methods: {
    setItemAmount(value) {
      this.$refs.animalItemPicker.setItemAmount(value);
    },
    isActive(play_id) {
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    toggleSelectItem(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);

      this.selectedList.push(item);
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
      this.editedItem.amount =
        Math.min(..._balls.map((item) => item.amount)) || 0;
      this.editedItem.minRate = Math.min(..._balls.map((item) => item.rate));
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
    clearSelection() {
      this.selectedList = [];
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
      this.$store.dispatch("lottery/getRecentBets");
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
