<template>
  <v-container>
    <v-card flat>
      <v-card-text class="pa-2">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-card color="grey lighten-4" flat tile>
              <GameActionBar>
                <v-chip-group
                  v-model="selectedOption"
                  @change="onCountingOptionChanged"
                  color="primary"
                  mandatory
                  column
                >
                  <v-chip
                    v-for="(item, key) in gameOptions"
                    :key="`item-${key}`"
                    :value="item.value"
                    small
                  >
                    {{ item.label }}
                  </v-chip>
                </v-chip-group>
              </GameActionBar>
            </v-card>
            <v-divider></v-divider>
            <v-card color="grey lighten-4" class="text-center" flat tile>
              <v-card-text class="py-0 px-2">
                {{ selectedOptionLabel }}
              </v-card-text>
            </v-card>
            <v-divider class="mb-4"></v-divider>

            <v-card :disabled="loadingRates" class="mb-4" flat tile>
              <v-item-group v-model="selectedList" multiple>
                <v-layout wrap>
                  <v-sheet
                    v-for="(item, key) in gridBalls"
                    :key="`lucky-number-${key}`"
                    class="pa-1"
                    width="calc(100% / 5)"
                    cols="3"
                  >
                    <v-item v-slot="{ active, toggle }">
                      <v-card
                        @click="toggle"
                        :color="active ? 'primary' : ''"
                        :dark="active"
                        class="text-center"
                        outlined
                      >
                        <v-card-text class="pa-1">
                          <v-layout column>
                            <strong>{{ item.name }}</strong>
                            <small>10</small>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-item>
                  </v-sheet>
                </v-layout>
              </v-item-group>
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
        :visible.sync="bittingInputs"
        :edited-item="editedItem"
        type="7"
      />
    </v-card>

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
</template>

<script>
import { TailNumbers } from "~/models/balls-map";

export default {
  name: "PageZhengmaOneSix",
  data() {
    return {
      selectedOption: 1,
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
      return TailNumbers;
    },
    showInput() {
      return !!this.selectedList.length;
    },
    gameOptions() {
      return [
        { label: "正码一", value: 1 },
        { label: "正码二", value: 2 },
        { label: "正码三", value: 3 },
        { label: "正码四", value: 4 },
        { label: "正码五", value: 5 },
        { label: "正码六", value: 6 },
      ];
    },
    selectedOptionLabel() {
      return this.gameOptions.find(({ value }) => value == this.selectedOption)
        ?.label;
    },
  },
  methods: {
    toggleSelectItem(value) {
      this.activeShortcut = "";
      let index = this.selectedList.indexOf(value);
      if (index != -1) this.selectedList.splice(index, 1);
      else this.selectedList.push(value);
    },
    isActive(play_id) {
      return this.selectedList.includes(play_id);
    },
    onSelectBalls(play_id) {
      const index = this.selectedList.findIndex((_id) => _id == play_id);
      if (index != -1) {
        this.selectedList.splice(index, 1);
        return;
      }

      if (this.selectedOption == this.selectedList.length) {
        this.selectedList.shift();
      }
      this.selectedList.push(play_id);
    },
    clearSelection() {
      this.activeShortcut = "";
      this.selectedList = [];
    },
    openDialogBitting() {
      const _balls = this.selectedList.map((play_id) => ({
        play_id,
        rate: this.getBallRate(play_id),
        amount: this.inputAmount || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.bittingInputs = true;
    },
    getOddValues(uid, order_type = "A") {
      this.loadingRates = true;
      const r = Math.random().toFixed(10);
      this.$axios
        .$get("/api-base/GetOddsAnimal", {
          params: { uid, r, gClass: 8, gameCode: "oth" },
        })
        .then((res) => {
          const _refs = {};
          res.list.forEach((item) => {
            _refs[item.play_id] = item.odds;
          });
          this.ref_rates = Object.assign({}, _refs);
          this.loadingRates = false;
        })
        .catch((error) => {
          console.log(error);
          this.loadingRates = false;
        });
    },
    switchChannel(channel) {
      this.activeChannel = channel;
      const uid = this.$cookiz.get("m6_uid");
      this.getOddValues(uid, channel);
    },
    getBallRate(play_id) {
      return this.ref_rates[play_id];
    },
    onCountingOptionChanged() {
      this.selectedList = [];
    },
  },
  mounted() {
    const uid = this.$cookiz.get("m6_uid");
    this.getOddValues(uid);
  },
};
</script>
