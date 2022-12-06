<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
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
          <v-layout class="gap-xs">
            <v-layout
              v-for="(luckNumbs, key) in gridBalls"
              :key="`lucky-number-${key}`"
              class="gap-sm"
              style="width: 20%"
              column
            >
              <table class="game-item-table">
                <tbody>
                  <tr
                    v-for="item in luckNumbs"
                    :key="`lucky-number-item-${key}-${item.play_id}`"
                  >
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
                      <input type="text" />
                    </td>
                  </tr>
                  <tr v-if="key == 4">
                    <td><v-sheet color="transparent" height="26"></v-sheet></td>
                    <td><v-sheet color="transparent" height="26"></v-sheet></td>
                    <td><v-sheet color="transparent" height="26"></v-sheet></td>
                  </tr>
                </tbody>
              </table>
            </v-layout>
          </v-layout>
          <v-sheet height="8"></v-sheet>
          <v-layout class="gap-xs">
            <v-layout
              v-for="(rowNumbers, rowKey) in flipCoins"
              :key="`yes-no-row-${rowKey}`"
              class="gap-xs"
              style="width: 25%"
            >
              <table class="game-item-table">
                <tbody>
                  <tr
                    v-for="(item, subKey) in rowNumbers"
                    :key="`color-ball-${rowKey}-${subKey}`"
                  >
                    <td>{{ item.label }}</td>
                    <td>
                      {{ getBallRate(item.play_id) }}
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- <CardBallOutlined
                v-for="(item, subKey) in rowNumbers"
                @toggle="toggleSelectItem(item)"
                :key="`color-ball-${rowKey}-${subKey}`"
                :title="item.label"
                :active="isActive(item.play_id)"
                width="25%"
                :rate="getBallRate(item.play_id)"
              /> -->
            </v-layout>
          </v-layout>
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
                <v-layout
                  v-for="(rowNumbers, rowKey) in shortcutBalls"
                  :key="`row-${rowKey}`"
                  wrap
                >
                  <v-card
                    v-for="(item, colKey) in rowNumbers"
                    @click="onClickShortcut(item.balls, item.title)"
                    :key="`row-${rowKey}-col-${colKey}`"
                    width="25%"
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
              </v-card-text>
            </v-card>
          </section>
          <section>
            <v-card :disabled="loadingRates" class="mb-4" flat tile>
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
