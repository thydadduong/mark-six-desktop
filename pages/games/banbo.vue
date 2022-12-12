<template>
  <div>
    <v-layout class="gap-sm">
      <v-sheet class="flex-fill">
        <v-card-text
          style="background: linear-gradient(0deg, #dae8fc, #fff)"
          class="primary--text py-1 px-2"
        >
          半波
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
                    >dd
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
  name: "PageBanBo",
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
          name: "紅單",
          color: "error",
          play_id: "120101",
          balls: ["01", "07", "13", "19", "23", "29", "35", "45"],
        },
        {
          name: "紅雙",
          color: "error",
          play_id: "120102",
          balls: ["02", "08", "12", "18", "24", "30", "34", "40", "46"],
        },
        {
          name: "紅大",
          color: "error",
          play_id: "120201",
          balls: ["29", "30", "34", "35", "40", "45", "46"],
        },
        {
          name: "紅小",
          color: "error",
          play_id: "120202",
          balls: ["01", "02", "07", "08", "12", "13", "18", "19", "23", "24"],
        },
        {
          name: "藍單",
          color: "primary",
          play_id: "120301",
          balls: ["03", "09", "15", "25", "31", "37", "41", "47"],
        },
        {
          name: "藍雙",
          color: "primary",
          play_id: "120302",
          balls: ["04", "10", "14", "20", "26", "36", "42", "48"],
        },
        {
          name: "藍大",
          color: "primary",
          play_id: "120401",
          balls: ["25", "26", "31", "36", "37", "41", "42", "47", "48"],
        },
        {
          name: "藍小",
          color: "primary",
          play_id: "120402",
          balls: ["03", "04", "09", "10", "14", "15", "20"],
        },
        {
          name: "綠單",
          color: "success",
          play_id: "120501",
          balls: ["05", "11", "17", "21", "27", "33", "39", "43"],
        },
        {
          name: "綠雙",
          color: "success",
          play_id: "120502",
          balls: ["06", "16", "22", "28", "32", "38", "44"],
        },
        {
          name: "綠大",
          color: "success",
          play_id: "120601",
          balls: ["27", "28", "32", "33", "38", "39", "43", "44"],
        },
        {
          name: "綠小",
          color: "success",
          play_id: "120602",
          balls: ["05", "06", "11", "16", "17", "21", "22"],
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

      let _URI = "/api-base/GetOddsMixColor";
      params.gClass = 17;
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
