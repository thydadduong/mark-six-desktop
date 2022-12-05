<template>
  <v-container>
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
                        <v-list-item-content>盘A</v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        @click="switchChannel('B')"
                        :disabled="activeChannel == 'B'"
                      >
                        <v-list-item-content>盘B</v-list-item-content>
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
                <v-card-text class="pa-1">
                  <v-layout column class="gap-xs">
                    <v-layout
                      v-for="(rowNumbers, rowKey) in shortcutBalls"
                      :key="`row-${rowKey}`"
                      class="gap-xs"
                    >
                      <v-card
                        v-for="(item, colKey) in rowNumbers"
                        @click="onClickShortcut(item.balls, item.title)"
                        :key="`row-${rowKey}-col-${colKey}`"
                        :width="`${100 / 7}%`"
                        :color="item.title == activeShortcut ? 'primary' : ''"
                        :dark="item.title == activeShortcut"
                        outlined
                        flat
                        tile
                      >
                        <v-layout
                          class="fill-height py-1"
                          justify-center
                          align-center
                        >
                          {{ item.title }}
                        </v-layout>
                      </v-card>
                    </v-layout>
                  </v-layout>
                </v-card-text>
              </v-card>
            </section>
            <section>
              <v-card :disabled="loadingRates" class="mb-4" outlined tile>
                <v-layout column class="gap-xs">
                  <v-sheet color="grey lighten-4 text-center py-1">
                    双面
                  </v-sheet>
                </v-layout>
                <v-card-text class="pa-1">
                  <v-layout column class="gap-xs">
                    <v-layout
                      v-for="(rowNumbers, rowKey) in flipCoins"
                      :key="`yes-no-row-${rowKey}`"
                      class="gap-xs"
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
            <section>
              <v-card :disabled="loadingRates" class="mb-4" outlined tile>
                <v-layout column class="gap-xs">
                  <v-sheet color="grey lighten-4 text-center py-1">
                    色波
                  </v-sheet>
                </v-layout>
                <v-card-text class="pa-1">
                  <v-layout column class="gap-xs text-center">
                    <v-layout
                      v-for="(rowNumbers, rowKey) in colorBalls"
                      :key="`color-ball-${rowKey}`"
                      class="gap-xs"
                    >
                      <CardBallOutlined
                        v-for="(item, subKey) in rowNumbers"
                        @toggle="toggleSelectItem(item)"
                        :key="`color-ball-${rowKey}-${subKey}`"
                        :color="item.color"
                        :title="item.label"
                        :active="isActive(item.play_id)"
                        :width="`${100 / 3}%`"
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
        type="1"
      />
    </v-card>

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
</template>

<script>
import { getPlayId, GridTemaA, GridTemaB } from "~/models/balls-map";
import { ColorBalls, ShortcutsTema, TemaFlipCoin } from "~/models/balls-map";
const getNumberLabel = (number) => (number < 10 ? `0${number}` : `${number}`);
export default {
  name: "PageLuckyDraw",
  data() {
    return {
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
      return this.activeChannel == "A" ? GridTemaA : GridTemaB;
    },
    shortcutBalls() {
      return ShortcutsTema;
    },
    flipCoins() {
      return TemaFlipCoin;
    },
    colorBalls() {
      return ColorBalls;
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
    onClickShortcut(items = [], type) {
      const prefix = this.activeChannel == "A" ? "0101" : "0102";
      let ids = items.map((item) => {
        return {
          play_id: getPlayId(prefix, item),
          value: item,
          label: getNumberLabel(item),
          color: this.$common.getBallColor(item),
        };
      });
      this.selectBalls(ids, type);
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
        .$get("/api-base/GetOdds", { params: { uid, r, order_type, type: 1 } })
        .then((res) => {
          this.loadingRates = false;
          if (!res.list) return;
          const _refs = {};
          res.list.forEach((item) => {
            _refs[item.play_id] = item.odds;
          });
          this.ref_rates = Object.assign({}, _refs);
          this.loadingRates = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    switchChannel(channel) {
      this.activeChannel = channel;
      this.selectedList = [];
      this.getOddValues();
      clearInterval(this.intervalRequest);
      this.startIntervalRequest(channel);
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
