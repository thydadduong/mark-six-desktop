export const initialState = {
  isLoading: false,
  isFetching: false,
  isCreating: false,
  isDeleting: false,
  isUpdating: false,
  currentPage: 1,
  itemCount: 0,
  totalPage: 0,
  perPage: 20,
  dataList: [],
};
export const state = () => ({
  ...initialState,
});

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    let _TOKEN = this.$cookiz.get("access_token");
    if (!_TOKEN) return;
    let _USER_ID = this.$cookiz.get("user_id");
    let _RE_TOKEN = this.$cookiz.get("refresh_token");
    if (!!_TOKEN) {
      const credential = {
        userId: _USER_ID,
        token: _TOKEN,
        refreshToken: _RE_TOKEN,
      };
      await dispatch("auth/reauthenticate", credential);
    }
  },
};
