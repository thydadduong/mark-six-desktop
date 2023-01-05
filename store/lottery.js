const state = () => ({
  records: [],
  recentBets: [],
  isLoading: false,
  loadingBet: false,
});

const actions = {
  fetchResultHistories({ commit }, params) {
    const r = Math.random().toFixed(17);
    const uid = this.$cookiz.get("m6_uid");
    const payload = { params: { r, uid, ...params } };
    const res = this.$axios.$get("/api-base/ResultHistory", payload);
    res
      .then((res) => {
        commit("RECORDS", res.records);
      })
      .finally(() => {
        commit("LOADING", false);
      });
    return res;
  },

  getRecentBets({ commit }) {
    commit("LOADING_BET", false);
    const _uri = "/api-base/Dynamic";
    const UID = this.$cookiz.get("m6_uid");
    const res = this.$axios.$get(_uri, { params: { UID } });
    res
      .then((res) => {
        if (res.code !== 0) return;
        commit("UPDATE_RECENT", res?.recent || []);
      })
      .finally((error) => {
        commit("LOADING_BET", false);
      });
    return res;
  },

  setRecentBets({ state, commit }, value) {
    let newBets = Object.assign([], state.recentBets);
    const date = new Date();
    let time = date.toLocaleString("en-GB");

    value.map((item) => {
      const bet = item.split(" ");
      newBets.unshift([time.slice(12), bet[0], bet[2]]);
    });

    if (newBets.length >= 9) {
      newBets = newBets.slice(0, 10);
    }
    commit("UPDATE_RECENT", newBets || []);
  },
};

const mutations = {
  RECORDS(state, res) {
    state.records = res;
  },
  LOADING(state, value) {
    state.isLoading = value;
  },
  LOADING_BET(state, value) {
    state.loadingBet = value;
  },
  UPDATE_RECENT(state, items = []) {
    state.recentBets = Object.assign([], items);
  },
};

export default { state, actions, mutations };
