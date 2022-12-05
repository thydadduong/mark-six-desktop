import VuexAction from "@/utils/vuex-utils/actions";
const PATH = "/api-online";
let vuexAction = new VuexAction(PATH, true);
const { setLoading } = vuexAction;

export const state = () => ({
  ...vuexAction.getInitialState(),
  closeCountDown: 0,
  loadingInfo: false,
});

export const mutations = {
  ...vuexAction.getCommonMutations(),
  SET_ONLINE_LOADING(state, loading = false) {
    state.loadingInfo = loading;
  },
  SET_CLOSE_COUNTDOWN(state, timer = 0) {
    state.closeCountDown = timer;
  },
};

export const actions = {
  ...vuexAction.getActions(),
  async getCloseTimeInfo({ commit }) {
    commit("SET_ONLINE_LOADING", true);
    try {
      const _URI = `${PATH}/info_closetime`;
      const response = await this.$axios.$get(_URI);
      commit("SET_CLOSE_COUNTDOWN", response);
      commit("SET_ONLINE_LOADING", true);
      return response;
    } catch (error) {
      commit("SET_ONLINE_LOADING", true);
      throw error;
    }
  },
};
