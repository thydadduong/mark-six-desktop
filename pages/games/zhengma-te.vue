<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          <v-btn-toggle
            v-model="activeType"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn
              v-for="(item, key) in typeOptions"
              :key="`option-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              small
            >
              {{ item.title }}
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
              v-for="(item, key) in flipCoins"
              :width="`${100 / 3}%`"
              :key="`yes-no-row-${key}`"
              class="gap-sm"
              style="width: 20%"
              column
            >
              <table class="game-item-table">
                <tbody>
                  <tr
                    v-for="subItem in item"
                    :key="`lucky-number-subItem-${key}-${subItem.play_id}`"
                  >
                    <td class="primary--text">
                      {{ subItem.label || "-" }}
                    </td>
                    <td>{{ getBallRate(subItem.play_id) }}</td>
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
          <v-layout class="gap-xs" style="margin-top: -1px">
            <v-layout
              v-for="(item, rowKey) in colorBalls"
              :key="`color-ball-${rowKey}`"
              :width="`${100 / 3}%`"
              class="gap-sm"
              style="width: 20%"
              column
            >
              <table class="game-item-table">
                <tbody>
                  <tr>
                    <td :class="`${item.color}--text`">
                      {{ item.label || "-" }}
                    </td>
                    <td>{{ getBallRate(item.play_id) }}</td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-layout>
          </v-layout>
          <v-sheet height="8"></v-sheet>

          <ActionBarBallValue
            @input="openDialogBitting"
            :value.sync="inputAmount"
          />
        </v-card>
      </v-sheet>

      <v-sheet
        class="flex-shrink-0 flex-grow-0"
        width="15rem"
        color="transparent"
      >
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          <v-sheet height="24" color="transparent"></v-sheet>
        </v-card-text>
        <v-card :disabled="loadingRates" class="mb-4" outlined tile>
          <v-card-text class="pa-2 pr-1">
            <v-layout column class="gap-xs">
              <v-layout
                v-for="(rowNumbers, rowKey) in shortcutBalls"
                :key="`row-${rowKey}`"
                wrap
              >
                <v-card
                  v-for="(item, colKey) in rowNumbers"
                  @click="onClickShortcut(item.balls, item.title)"
                  :key="`row-${rowKey}-col-${colKey}`"
                  :width="`${100 / 4}%`"
                  :color="item.title == activeShortcut ? 'primary' : ''"
                  :dark="item.title == activeShortcut"
                  style="margin-top: -1px; margin-left: -1px"
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
      </v-sheet>
    </v-layout>
    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :amount="inputAmount"
      :type="activeType.value"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import { ColorBallsFlat, gridNumbers, ShortcutsTema } from "~/models/balls-map";

export default {
  name: "PageZhengmaTe",
  data() {
    return {
      activeType: {
        title: "正一特",
        prefix: "03",
        ball_prefix: "0301",
        value: 8,
      },
      activeShortcut: "",
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [] },
      selectedList: [],
      ref_rates: {},
      loadingRates: false,
    };
  },
  computed: {
    gridBalls() {
      return gridNumbers.map((col) =>
        col.map((ball) => ({
          play_id: this.$common.getPlayId(this.activeType.ball_prefix, ball),
          label: this.$common.getNumberLabel(ball),
          value: ball,
          color: this.$common.getBallColor(ball),
        }))
      );
    },
    shortcutBalls() {
      return ShortcutsTema;
    },
    colorBalls() {
      return ColorBallsFlat.map((item) => ({
        ...item,
        play_id: [this.activeType.prefix, item.suffix].join(""),
      }));
    },
    flipCoins() {
      return [
        [
          { suffix: "0301", label: "大" },
          { suffix: "0302", label: "小" },
        ],
        [
          { suffix: "0201", label: "单" },
          { suffix: "0202", label: "双" },
        ],
        [
          { suffix: "0401", label: "合单" },
          { suffix: "0402", label: "合双" },
        ],
      ].map((item) =>
        item.map((subItem) => ({
          ...subItem,
          play_id: [this.activeType.prefix, subItem.suffix].join(""),
        }))
      );
    },
    showInput() {
      return !!this.selectedList.length;
    },
    typeOptions() {
      return [
        { title: "正一特", prefix: "03", ball_prefix: "0301", value: 8 },
        { title: "正二特", prefix: "04", ball_prefix: "0401", value: 9 },
        { title: "正三特", prefix: "05", ball_prefix: "0501", value: 10 },
        { title: "正四特", prefix: "06", ball_prefix: "0601", value: 11 },
        { title: "正五特", prefix: "07", ball_prefix: "0701", value: 12 },
        { title: "正六特", prefix: "08", ball_prefix: "0801", value: 13 },
      ];
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
      const prefix = this.activeType.ball_prefix;
      let ids = items.map((item) => {
        console.log(item);
        return {
          play_id: this.$common.getPlayId(prefix, item),
          value: item,
          label: this.$common.getNumberLabel(item),
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

      const type = this.activeType.value;
      this.$axios
        .$get("/api-base/GetOdds", { params: { uid, r, type } })
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
    getBallRate(play_id) {
      return this.ref_rates[play_id];
    },
    onPrefixChanged() {
      this.selectedList = [];
      setTimeout(() => {
        this.getOddValues();
      }, 100);
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
