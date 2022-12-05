const state = () => ({
  isLoading: true,
  appTitle: "",
});

const actions = {
  getAppTitle({ commit }) {
    commit("LOADING", true);
    this.$axios
      .$get("/api-base/")
      .then((res) => {
        commit("SET_TITLE", res.title);
      })
      .finally(() => {
        commit("LOADING", false);
      });
  },
};

const mutations = {
  SET_TITLE(state, title) {
    state.appTitle = title;
  },
  LOADING(state, value) {
    state.isLoading = value;
  },
};

export default { state, actions, mutations };
