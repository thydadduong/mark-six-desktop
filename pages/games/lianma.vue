<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet color="transparent">
        <GameActionBar>
          <v-btn-toggle
            v-model="selectedProp"
            @change="onOptionChange"
            class="mr-2"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn
              v-for="(item, key) in ballPropOptions"
              :key="`option-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              small
            >
              {{ item.title }}
            </v-btn>
          </v-btn-toggle>
          <v-btn-toggle
            v-model="selectedType"
            @change="clearSelection"
            color="primary"
            active-class="primary white--text"
            mandatory
          >
            <v-btn
              v-for="(item, key) in subOptions"
              :key="`mode-${key}`"
              :value="item"
              class="px-1 ma-0"
              height="24"
              small
            >
              {{ item.title }}
            </v-btn>
          </v-btn-toggle>
        </GameActionBar>
        <v-divider></v-divider>
        <v-card :disabled="loadingRates" class="pa-2" flat tile>
          <v-form ref="formItem">
            <v-layout class="gap-xs">
              <v-layout
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
                          {{ getBallRate(item.label) }}
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
                        <td>{{ getBallRate(item.label) }}</td>
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
              </v-layout>
            </v-layout>
            <v-sheet height="8"></v-sheet>
            <ActionBarBallAmount
              @set-amount="setItemAmount"
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
          <section>
            <v-card :disabled="loadingRates" class="mb-4" flat tile>
              <v-card-text class="pa-1">
                <Shortcut49
                  @click:item="onClickItem49"
                  :selected-items="selectedItems"
                />
                <!-- <ShortcutColor
                  @click:item="onClickShortcut"
                  :selected="activeShortcut"
                />
                <ShortcutItem
                  @click:item="onClickShortcut"
                  :selected="activeShortcut"
                /> -->
              </v-card-text>
            </v-card>
          </section>
        </v-card>
      </v-sheet>
    </v-layout>
    <DialogBittingAmountLianma
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :saveMultiple="selectedType.value == 1"
      :property="selectedProp.value"
      :typeTitle="selectedType.title"
      :propertyTitle="selectedProp.title"
      :amount="inputAmount"
      :fixedFrontIndex="fixedFrontIndex"
      type="4"
    />

    <v-overlay :value="loadingRates">
      <v-progress-circular indeterminate />
    </v-overlay>
  </div>
</template>

<script>
import { POSITION } from "vue-toastification";
import {
  getBallColor,
  getNumberLabel,
  getPlayId,
  gridNumbers,
} from "~/models/balls-map";

export default {
  name: "PageLuckyDraw",
  data() {
    return {
      activeShortcut: "",
      selectedProp: { title: "三全中", value: 44, min: 3, prefix: "1001" },
      selectedType: { title: "复式", value: 1 },
      inputAmount: 5,
      bittingInputs: false,
      editedItem: { balls: [] },
      closeTimer: 0,
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
    gridBalls() {
      return gridNumbers.map((col) =>
        col.map((ball) => ({
          play_id: getPlayId(this.selectedProp.prefix, ball),
          label: getNumberLabel(ball),
          value: ball,
          color: getBallColor(ball),
        }))
      );
    },
    ballPropOptions() {
      return [
        { title: "三全中", min: 3, value: 44, prefix: "1001" },
        { title: "三中二", min: 3, value: 45, prefix: "1002" },
        { title: "二全中", min: 2, value: 41, prefix: "1003" },
        { title: "特串", min: 2, value: 43, prefix: "1004" },
        { title: "二中特", min: 2, value: 42, prefix: "1005" },
      ];
    },
    subOptions() {
      return [
        { title: "复式", value: 1 },
        { title: "胆拖", value: 2 },
      ];
    },
    fixedFrontIndex() {
      if (this.selectedType.value != 2) return -1;
      return this.selectedProp.min - 2;
    },
  },
  methods: {
    setItemAmount(value) {
      this.selectedList.forEach((item) => {
        const _item = this.$refs[item.play_id]?.[0];
        console.log(_item);
        if (_item) _item.value = value;
      });
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
      const prefix = this.selectedProp.prefix;
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
    isFixedFront(label) {
      if (this.selectedType.value != 2) return false;
      let index = this.selectedList.findIndex((item) => item.label == label);
      if (index == -1) return false;
      return index <= this.selectedProp.min - 2;
    },
    async openDialogBitting() {
      const min = this.selectedProp.min;
      if (this.selectedList.length < min)
        return this.$toast.error(`请至少选择 ${min} 项`, {
          position: POSITION.TOP_CENTER,
        });

      const formData = new FormData(this.$refs.formItem.$el);
      const _balls = this.selectedList.map((item) => ({
        ...item,
        rate: this.getBallRate(item.label),
        amount: formData.get(item.play_id) || 0,
      }));
      this.editedItem.balls = Object.assign([], _balls);
      this.editedItem.amount =
        Math.min(..._balls.map((item) => item.amount)) || 0;
      this.editedItem.minRate =
        Math.min(..._balls.map((item) => item.rate)) ||
        this.getBallRate(this.selectedList[0].label);
      this.bittingInputs = true;
    },
    getOddValues() {
      this.loadingRates = true;
      const r = Math.random().toFixed(17);
      const uid = this.$cookiz.get("m6_uid");
      const type = 4;
      const property = this.selectedProp.value;
      return this.$axios
        .$get("/api-base/GetOddsMulti", { params: { uid, r, type, property } })
        .then((res) => {
          const _refs = {};
          res.list.forEach((item) => {
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
      // this.selectedType = Object.assign({}, { title: "复式", value: 1 });
      this.selectedList = [];
      setTimeout(() => {
        this.getOddValues();
      }, 200);
    },
    clearSelection() {
      this.activeShortcut = "";
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
