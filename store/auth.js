const URL_LOGIN = "/api-base/login";
const URL_REFRESH_TOKEN = "/api-auth/RefreshToken";
const URL_REVOKE_TOKEN = "/api-auth/revoke-token";
const URL_USER_PROFILE = "/api-auth/me";

export const state = () => ({
  authenticating: false,
  isAuthenticated: false,
  currentUser: {},
});

export const mutations = {
  REQUESTING(state, { isLoading = false, action = "", inProgress = false }) {
    state.isLoading = isLoading;
    if (action) state[action] = inProgress;
  },

  SET_CURRENT_USER(state, payload) {
    state.currentUser = Object.assign({}, this.$common.cloneJSON(payload));
  },
};

export const actions = {
  async authenticate({ commit }, { payload, options }) {
    commit("REQUESTING", {
      isLoading: true,
      action: "authenticating",
      inProgress: true,
    });
    try {
      const response = await this.$axios.$post(URL_LOGIN, payload, options);
      this.$axios.setToken(response.jwtToken, "Bearer");
      let cookieOpt = undefined;
      if (credential.remember_me) {
        cookieOpt = { maxAge: 60 * 60 * 24 * 7 };
        this.$cookiz.set("remember_me", true, cookieOpt);
      }
      console.log(response);
      this.$cookiz.set("m6_uid", response.uid, cookieOpt);
      commit("REQUESTING", {
        isLoading: false,
        action: "authenticating",
        inProgress: false,
      });
      return response;
    } catch (error) {
      commit("REQUESTING", {
        isLoading: false,
        action: "authenticating",
        inProgress: false,
      });
      throw error;
    }
  },
  async reauthenticate({ commit }, credential) {
    commit("REQUESTING", {
      isLoading: true,
      action: "authenticating",
      inProgress: true,
    });
    try {
      const response = await this.$axios.$post(URL_REFRESH_TOKEN, credential);
      this.$axios.setToken(response.jwtToken, "Bearer");
      commit("SET_CURRENT_USER", response);
      const isRemember = this.$cookiz.get("remember_me");
      let cookieOpt = undefined;
      if (isRemember) cookieOpt = { maxAge: 60 * 60 * 24 * 7 };
      this.$cookiz.set("user_id", response.userId, cookieOpt);
      this.$cookiz.set("access_token", response.token, cookieOpt);
      this.$cookiz.set("refresh_token", response.refreshToken, cookieOpt);
      commit("REQUESTING", {
        isLoading: false,
        action: "authenticating",
        inProgress: false,
      });
      return response;
    } catch (error) {
      commit("REQUESTING", {
        isLoading: false,
        action: "authenticating",
        inProgress: false,
      });
      throw error;
    }
  },
  async getUserProfile({ commit, dispatch }) {
    commit("REQUESTING", {
      isLoading: true,
      action: "fetching",
      inProgress: true,
    });
    try {
      const response = await this.$axios.$get(URL_USER_PROFILE);
      let currentUser = JSON.parse(JSON.stringify(response));
      commit("UPDATE_CURRENT_USER", currentUser);
      commit("REQUESTING", {
        isLoading: false,
        action: "fetching",
        inProgress: false,
      });
      return response;
    } catch (error) {
      commit("REQUESTING", {
        isLoading: false,
        action: "fetching",
        inProgress: false,
      });
      throw error;
    }
  },

  async logout({ commit }) {
    commit("REQUESTING", {
      isLoading: true,
      action: "loggingOut",
      inProgress: true,
    });
    try {
      const _URI = "/api-base/Logout";
      const options = {
        params: {
          UID: this.$cookiz.get("m6_uid"),
          r: Math.random().toFixed(16),
        },
      };
      const response = await this.$axios.$get(_URI, options);
      this.$cookiz.remove("m6_uid");
      this.$cookiz.remove("agree_term");

      commit("REQUESTING", {
        isLoading: false,
        action: "loggingOut",
        inProgress: false,
      });
      return response;
    } catch (error) {
      commit("REQUESTING", {
        isLoading: false,
        action: "loggingOut",
        inProgress: false,
      });
    }
  },
};
