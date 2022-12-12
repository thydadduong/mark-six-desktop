<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          五行
        </v-card-text>
        <v-divider></v-divider>

        <v-card :disabled="loadingRates" class="mb-4" flat tile>
          <v-card class="text-center grey lighten-3" flat tile> 生肖 </v-card>
          <v-card-text class="pa-2">
            <v-card flat>
              <v-card
                color="#0000001f"
                style="margin-top: -1px"
                outlined
                tile
                flat
              >
                <v-layout class="gap-sm" align-center>
                  <v-sheet
                    class="flex-grow-0 font-weight-bold pa-2 py-2 text-center"
                    color="transparent"
                    width="50"
                  >
                    半波
                  </v-sheet>
                  <v-divider vertical></v-divider>
                  <v-sheet
                    width="50"
                    class="flex-grow-0 font-weight-bold pa-2 py-2 text-center"
                    color="transparent"
                  >
                    赔率
                  </v-sheet>
                  <v-divider vertical></v-divider>
                  <v-sheet
                    class="flex-grow-1 font-weight-bold pa-2 py-2"
                    color="transparent"
                  >
                    号码
                  </v-sheet>
                  <v-divider vertical></v-divider>
                  <v-sheet
                    class="flex-grow-0 font-weight-bold pa-2 py-2"
                    color="transparent"
                    width="150"
                  >
                  </v-sheet>
                </v-layout>
              </v-card>

              <v-card
                v-for="(item, index) in gridBalls"
                :key="`item-${index}`"
                @click="toggleSelectItem(item)"
                flat
                tile
              >
                <CardGrid3Item
                  :name="item.name"
                  :balls="item.balls"
                  :ballsColor="item.color"
                  :rate="getBallRate(item.name)"
                />
              </v-card>
            </v-card>
            <v-sheet height="8"></v-sheet>

            <ActionBarBallValue
              @input="openDialogBitting"
              :value.sync="inputAmount"
              class="d-none d-sm-block"
            />
          </v-card-text>
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
            class="primary--text py-1 px-2"
          >
            <v-sheet height="24" color="transparent"></v-sheet>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-layout>

    <DialogBittingAmount
      @saved="onSaveAmount"
      :visible.sync="bittingInputs"
      :edited-item="editedItem"
      :type="14"
      :gClass="8"
      :tot_num="selectedList.length"
    />
  </div>
</template>

<script>
export default {
  name: "PageWuhang",
  data() {
    return {
      minRate: "-",
      gameType: 16,
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
      return [
        {
          name: "金",
          color: "",
          play_id: "190101",
          balls: ["01", "06", "11", "16", "21", "26", "31", "36", "41", "46"],
        },
        {
          name: "木",
          color: "",
          play_id: "190102",
          balls: ["02", "07", "12", "17", "22", "27", "32", "37", "42", "47"],
        },
        {
          name: "水",
          color: "",
          play_id: "190103",
          balls: ["03", "08", "13", "18", "23", "28", "33", "38", "43", "48"],
        },
        {
          name: "火",
          color: "",
          play_id: "190104",
          balls: ["04", "09", "14", "19", "24", "29", "34", "39", "44", "49"],
        },
        {
          name: "土",
          color: "",
          play_id: "190105",
          balls: ["05", "10", "15", "20", "25", "30", "35", "40", "45"],
        },
      ];
    },
    showInput() {
      return !!this.selectedList.length;
    },
  },
  methods: {
    toggleSelectItem(item) {
      let index = this.selectedList.findIndex(
        ({ play_id }) => item.play_id == play_id
      );
      if (index != -1) return this.selectedList.splice(index, 1);
      this.selectedList.push(item);
    },
    isActive(play_id) {
      return !!this.selectedList.find((item) => item.play_id == play_id);
    },
    clearSelection() {
      this.selectedList = [];
    },
    openDialogBitting() {
      const _balls = this.selectedList.map((item) => ({
        ...item,
        label: item.name,
        rate: this.getBallRate(item.name),
        amount: this.inputAmount || 0,
      }));
      this.minRate = Math.min(
        ...this.selectedList.map((item) => this.getBallRate(item.name))
      );

      this.editedItem.balls = Object.assign([], _balls);
      this.bittingInputs = true;
    },
    getOddValues() {
      this.loadingRates = true;
      const params = {
        UID: this.$cookiz.get("m6_uid"),
        r: Math.random().toFixed(10),
      };

      let _URI = "/api-base/GetOddsFiveCates";
      params.gClass = 37;
      params.gameCode = "oth";

      this.$axios
        .$get(_URI, { params })
        .then((res) => {
          const _refs = {};
          res.list.forEach((item) => {
            const _play_id = [item.ball].join("");
            _refs[_play_id] = item.odds;
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
