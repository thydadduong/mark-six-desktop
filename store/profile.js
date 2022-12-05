const state = () => ({ basicItem: {}, gameTable: {} });

const actions = {
  fetchBasicItem({ commit }) {
    const r = Math.random().toFixed(17);
    const uid = this.$cookiz.get("m6_uid");
    const payload = { params: { r, uid } };
    this.$axios.$get("/api-base/BasicItemSettings", payload).then((res) => {
      commit("BASIC_ITEM", res);
    });
  },
  getGameTable({ commit }) {
    const r = Math.random().toFixed(17);
    const UID = this.$cookiz.get("m6_uid");
    const payload = { params: { r, UID } };
    this.$axios.$get("/api-base/Tables", payload).then((res) => {
      commit("GAME_TABLE", res);
    });
  },
  resetPassword({ commit }, payload) {
    const r = Math.random().toFixed(17);
    const uid = this.$cookiz.get("m6_uid");
    const options = {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      params: { r, uid },
    };
    const url = "/api-base/ChangePassword";
    return this.$axios.$post(url, payload, options);
  },
};

const mutations = {
  BASIC_ITEM(state, res) {
    state.basicItem = Object.assign({}, res || {});
  },
  GAME_TABLE(state, res) {
    state.gameTable = Object.assign({}, res || {});
  },
};

export default { state, actions, mutations };
