<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet>
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          <v-btn-toggle
            v-model="activeChannel"
            @change="switchChannel"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn class="px-1 ma-0" height="24" value="A" small>
              特码 A
            </v-btn>
            <v-btn class="px-1 ma-0" height="24" value="B" small>
              特码 B
            </v-btn>
          </v-btn-toggle>
        </v-card-text>
        <v-divider></v-divider>
        <v-card :disabled="loadingRates" class="pa-2" flat tile>
          <v-form ref="formItem">
            <v-layout class="gap-xs">
              <v-sheet
                v-for="(luckNumbs, key) in gridBalls"
                :key="`lucky-number-${key}`"
                width="165"
              >
                <table class="game-item-table disable-select">
                  <tbody>
                    <tr
                      v-for="item in luckNumbs"
                      :key="`lucky-number-item-${key}-${item.play_id}`"
                      @click="toggleSelectItem(item)"
                      class="cursor-pointer"
                    >
                      <template v-if="isActive(item.label)">
                        <td class="white--text primary">
                          <v-avatar
                            :color="$common.getBallColor(item.value)"
                            class="darken-1"
                            size="26"
                          >
                            <small class="font-weight-bold">
                              {{ item.label || "-" }}
                            </small>
                          </v-avatar>
                        </td>
                        <td class="primary white--text">
                          {{ getBallRate(item.play_id) }}
                        </td>
                        <td class="primary">
                          <input
                            @click.stop="() => {}"
                            :ref="item.play_id"
                            :id="item.play_id"
                            :name="item.play_id"
                            class="text-right px-1 hidden-spin"
                            placeholder="0"
                            type="number"
                          />
                        </td>
                      </template>
                      <template v-else>
                        <td>
                          <v-avatar
                            :color="$common.getBallColor(item.value)"
                            class="white--text"
                            size="26"
                          >
                            <small class="font-weight-bold">
                              {{ item.label || "-" }}
                            </small>
                          </v-avatar>
                        </td>
                        <td>{{ getBallRate(item.play_id) }}</td>
                        <td>
                          <input
                            @click.stop="onClickInputReadonly(item)"
                            placeholder="0"
                            class="text-right px-1"
                            tabindex="-1"
                            readonly
                          />
                        </td>
                      </template>
                    </tr>
                    <tr v-if="key == 4">
                      <td>
                        <v-sheet color="transparent" height="26"></v-sheet>
                      </td>
                      <td>
                        <v-sheet color="transparent" height="26"></v-sheet>
                      </td>
                      <td>
                        <v-sheet color="transparent" height="26"></v-sheet>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-sheet>
            </v-layout>
            <v-sheet height="8"></v-sheet>
            <BittingFlipItem
              @click:row="toggleSelectItem"
              :rates="flipBallRates"
              :selectedItems="selectedList"
              ref="flipItem"
            />
            <v-sheet height="8"></v-sheet>
            <BittingColorItem
              @click:row="toggleSelectItem"
              :rates="colorBallsRate"
              :selectedItems="selectedList"
              ref="colorItem"
            />
            <v-sheet height="8"></v-sheet>
            <ActionBarBallAmount
              @set-amount="setItemAmount"
              @compose="openDialogBitting"
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
          <section>
            <v-card :disabled="loadingRates" class="mb-4" flat tile>
              <v-card-text class="pa-1">
                <Shortcut49
                  @click:item="onClickItem49"
                  :selected-items="selectedItems"
                />
                <ShortcutColor
                  @click:item="onClickShortcut"
                  :selected="activeShortcut"
                />
                <ShortcutItem
                  @click:item="onClickShortcut"
                  :selected="activeShortcut"
                />
              </v-card-text>
            </v-card>
          </section>
        </v-card>
      </v-sheet>
    </v-layout>

    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      type="1"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import {
  getPlayId,
  GridTemaA,
  GridTemaB,
  ColorBalls,
} from "~/models/balls-map";
import {
  ColorBallsFlat,
  TemaFlipCoin,
  ShortcutsTema,
} from "~/models/balls-map";
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
    selectedItems() {
      return this.selectedList.map((item) => item.value);
    },
    flipBallRates() {
      const rates = {};
      TemaFlipCoin.forEach((balls) => {
        balls.forEach(({ play_id }) => {
          rates[play_id] = this.getBallRate(play_id);
        });
      });
      return rates;
    },
    colorBallsRate() {
      const rates = {};
      ColorBalls.forEach(({ play_id }) => {
        rates[play_id] = this.getBallRate(play_id);
      });
      return rates;
    },
    gridBalls() {
      return this.activeChannel == "A" ? GridTemaA : GridTemaB;
    },
    shortcutBalls() {
      return ShortcutsTema;
    },
    colorBalls() {
      const prefix = this.activeChannel == "A" ? "0101" : "0102";
      return ColorBallsFlat.map((item) => ({
        ...item,
        play_id: [prefix, item.suffix].join(""),
      }));
    },
    showInput() {
      return !!this.selectedList.length;
    },
  },
  methods: {
    setItemAmount(value) {
      this.selectedList.forEach((item) => {
        const _item = this.$refs[item.play_id]?.[0];
        if (_item) _item.value = value;
      });
      this.$refs.colorItem.setItemAmount(value);
      this.$refs.flipItem.setItemAmount(value);
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
      this.selectedList.push(item);
    },
    onClickItem49(item) {
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
      console.log(item);
      const balls = item.balls || [];
      const prefix = this.activeChannel == "A" ? "0101" : "0102";
      let ids = balls.map((item) => {
        return {
          play_id: getPlayId(prefix, item),
          value: item,
          label: getNumberLabel(item),
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
      this.activeShortcut = "";
      this.selectedList = [];
    },
    openDialogBitting() {
      // TODO: Handle bitting value
      // const formData = new FormData(this.$refs.formItem.$el);
      // const play_id = this.selectedList[0].play_id;
      // console.log(formData.get(play_id));
      // const _balls = this.selectedList.map((item) => ({
      //   ...item,
      //   rate: this.getBallRate(item.play_id),
      //   amount: this.inputAmount || 0,
      // }));
      // this.editedItem.balls = Object.assign([], _balls);
      // this.bittingInputs = true;
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
