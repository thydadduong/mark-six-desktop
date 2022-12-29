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
    console.log('gettign');
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
