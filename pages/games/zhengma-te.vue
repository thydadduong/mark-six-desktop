<template>
  <v-container>
    <v-card flat>
      <v-card-text class="pa-2">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card class="mb-5" outlined tile>
              <v-sheet class="text-center py-2"> 生肖 </v-sheet>
              <v-divider></v-divider>
              <v-sheet color="#f3f5f8">
                <v-card-text class="px-2 py-0">
                  <v-chip-group
                    v-model="activeType"
                    @change="onPrefixChanged"
                    active-class="primary--text"
                    mandatory
                    column
                  >
                    <v-chip
                      v-for="(item, key) in typeOptions"
                      :key="`option-${key}`"
                      :value="item"
                      small
                    >
                      {{ item.title }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-sheet>
            </v-card>
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
                  <v-layout wrap>
                    <v-card
                      v-for="(item, rowKey) in flipCoins"
                      :width="`${100 / 4}%`"
                      :key="`yes-no-row-${rowKey}`"
                      class="pa-1"
                      flat
                    >
                      <CardBallOutlined
                        @toggle="toggleSelectItem(item)"
                        :title="item.label"
                        :active="isActive(item.play_id)"
                        :rate="getBallRate(item.play_id)"
                      />
                    </v-card>
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
                  <v-layout class="gap-xs text-center">
                    <CardBallOutlined
                      v-for="(item, rowKey) in colorBalls"
                      :key="`color-ball-${rowKey}`"
                      @toggle="toggleSelectItem(item)"
                      :color="item.color"
                      :title="item.label"
                      :active="isActive(item.play_id)"
                      :width="`${100 / 3}%`"
                      :rate="getBallRate(item.play_id)"
                    />
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
        :amount="inputAmount"
        :type="activeType.value"
      />
    </v-card>

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-container>
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
        { suffix: "0301", label: "大" },
        { suffix: "0302", label: "小" },
        { suffix: "0201", label: "单" },
        { suffix: "0202", label: "双" },
        { suffix: "0401", label: "合单" },
        { suffix: "0402", label: "合双" },
      ].map((item) => ({
        ...item,
        play_id: [this.activeType.prefix, item.suffix].join(""),
      }));
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
