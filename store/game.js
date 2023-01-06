const state = () => ({
  records: [],
  isLoading: true,
  activeGameTitle: "",
});

const actions = {
  getGameList({ commit }) {
    commit("LOADING", true);
    const r = Math.random().toFixed(17);
    const uid = this.$cookiz.get("m6_uid");
    const payload = { params: { uid, r } };
    this.$axios
      .$get("/api-base/GetGameList", payload)
      .then((res) => {
        commit("RECORDS", res.list);
      })
      .finally(() => {
        commit("LOADING", false);
      });
  },
};

const mutations = {
  RECORDS(state, list = []) {
    state.activeGameTitle = list[0]?.title;
    state.records = list;
  },
  LOADING(state, value) {
    state.isLoading = value;
  },
};

export default { state, actions, mutations };
