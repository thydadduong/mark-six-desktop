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
              正码 A
            </v-btn>
            <v-btn class="px-1 ma-0" height="24" value="B" small>
              正码 B
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
              v-for="(item, rowKey) in flipCoins"
              :key="`yes-no-row-${rowKey}`"
              class="gap-xs"
              style="width: calc(100% / 2)"
            >
              <table class="game-item-table">
                <tbody>
                  <tr>
                    <td :class="`${item.color}--text`">{{ item.label }}</td>
                    <td>
                      {{ getBallRate(item.play_id) }}
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-layout>
            <v-sheet width="25%"></v-sheet>
          </v-layout>
          <v-sheet height="8"></v-sheet>
          <ActionBarBallValue
            @input="openDialogBitting"
            :value.sync="inputAmount"
          />
        </v-card>
      </v-sheet>
    </v-layout>
    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      type="2"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
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
