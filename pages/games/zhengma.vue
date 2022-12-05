<template>
  <v-container flat>
    <v-card flat>
      <v-card-text class="pa-2">
        <v-row>
          <v-col cols="12">
            <v-card outlined tile>
              <v-sheet color="grey lighten-4 pa-1" class="relative">
                <v-layout justify-center>
                  <v-menu>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        class="px-1"
                        color="grey darken-2"
                        small
                        text
                      >
                        盘: {{ activeChannel }}
                        <v-icon>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="switchChannel('A')"
                        :disabled="activeChannel == 'A'"
                      >
                        <v-list-item-content>盘 A</v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        @click="switchChannel('B')"
                        :disabled="activeChannel == 'B'"
                      >
                        <v-list-item-content>盘 B</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-layout>
              </v-sheet>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card :disabled="loadingRates" class="mb-4" flat tile>
              <v-layout class="gap-sm">
                <v-layout
                  v-for="(luckNumbs, key) in gridBalls"
                  :key="`lucky-number-${key}`"
                  class="gap-sm"
                  style="width: 20%"
                  column
                >
                  <CardBoardItem
                    v-for="item in luckNumbs"
                    @toggle="toggleSelectItem(item)"
                    :key="`lucky-number-item-${key}-${item.play_id}`"
                    :color="item.color"
                    :title="item.label"
                    :active="isActive(item.play_id)"
                    :rate="getBallRate(item.play_id)"
                  />
                  <v-card
                    @click="clearSelection"
                    color="error lighten-1"
                    v-if="key == 4"
                    height="100%"
                    flat
                    dark
                  >
                    <v-layout class="fill-height" justify-center align-center>
                      <v-icon>mdi-close</v-icon>
                    </v-layout>
                  </v-card>
                </v-layout>
              </v-layout>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <section>
              <v-card :disabled="loadingRates" class="mb-4" outlined tile>
                <v-layout column class="gap-xs">
                  <v-sheet color="grey lighten-4 text-center py-1">
                    双面
                  </v-sheet>
                </v-layout>
                <v-card-text class="pa-2">
                  <v-layout column class="gap-sm">
                    <v-layout
                      v-for="(rowNumbers, rowKey) in flipCoins"
                      :key="`yes-no-row-${rowKey}`"
                      class="gap-sm"
                    >
                      <CardBallOutlined
                        v-for="(item, subKey) in rowNumbers"
                        @toggle="toggleSelectItem(item)"
                        :key="`color-ball-${rowKey}-${subKey}`"
                        :title="item.label"
                        :active="isActive(item.play_id)"
                        :width="`${100 / 4}%`"
                        :rate="getBallRate(item.play_id)"
                      />
                    </v-layout>
                  </v-layout>
                </v-card-text>
              </v-card>
            </section>

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
        type="2"
      />
    </v-card>

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
</template>

<script>
import { GridZhengmaA, GridZhengmaB, ZhengmaFlip } from "~/models/balls-map";

export default {
  name: "PageLuckyDraw",
  data() {
    return {
      activeShortcut: "",
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [] },
      selectedList: [],
      ref_rates: {},
      activeChannel: "A",
      loadingRates: false,
    };
  },
  computed: {
    gridBalls() {
      return this.activeChannel == "A" ? GridZhengmaA : GridZhengmaB;
    },
    flipCoins() {
      return ZhengmaFlip;
    },
    showInput() {
      return !!this.selectedList.length;
    },
  },
  methods: {
    toggleSelectItem(item) {
      this.activeShortcut = "";
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      this.selectedList.push(item);
    },
    isActive(play_id) {
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    onSelectBalls(items = [], type) {
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
      this.activeShortcut = "";
      this.selectedList = [];
    },
    openDialogBitting() {
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.play_id),
        amount: this.inputAmount || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.bittingInputs = true;
    },
    getOddValues() {
      this.loadingRates = true;
      const uid = this.$cookiz.get("m6_uid");
      const r = Math.random().toFixed(17);
      const order_type = this.activeChannel;
      this.$axios
        .$get("/api-base/GetOdds", { params: { uid, r, order_type, type: 2 } })
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
      this.selectedList = [];
      this.getOddValues();
      clearInterval(this.intervalRequest);
      this.startIntervalRequest();
    },
    getBallRate(play_id) {
      return this.ref_rates[play_id];
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
