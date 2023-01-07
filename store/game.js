const state = () => ({
  records: [],
  isLoading: true,
  activeGameTitle: "",
  closed: false,
  closedTimer: 0,
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
  getCloseTime({ commit }) {
    const uid = this.$cookiz.get("m6_uid");
    const r = Math.random().toFixed(16);
    const response = this.$axios.$get("/api-base/GetCloseTime", {
      params: { uid, r },
    });
    response
      .then((res) => {
        if (!!res?.code) return;
        const payload = { closed: false, closedTimer: res.seconds || 0 };
        commit("CLOSE_TIME", payload);
      })

      .catch((error) => {
        console.log(error);
      });

    return response;
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
  CLOSE_TIME(state, payload) {
    state.closed = payload.closed;
    state.closedTimer = payload.closedTimer;
  },
};

export default { state, actions, mutations };
