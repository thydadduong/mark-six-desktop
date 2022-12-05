const state = () => ({ records: [], isLoading: true });

const actions = {
  fetchResultHistories({ commit }, params) {
    const r = Math.random().toFixed(17);
    const uid = this.$cookiz.get("m6_uid");
    const payload = { params: { r, uid, ...params } };
    this.$axios.$get("/api-base/ResultHistory", payload).then((res) => {
      commit("RECORDS", res.records);
      commit("LOADING", false);
    });
  },
};

const mutations = {
  RECORDS(state, res) {
    state.records = res;
  },
  LOADING(state, value) {
    state.isLoading = value;
  },
};

export default { state, actions, mutations };
