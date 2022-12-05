import { initialState } from "~/store";
import { mutationNames } from "./mutation-names";
import { mutationProps } from "./mutations";

export default class VuexAction {
  basePath = "";
  suffixSlug = "";
  mutationNames = mutationNames;
  constructor(basePath, suffixSlug = false) {
    this.basePath = basePath;
    if (suffixSlug) {
      this.suffixSlug = "/";
    }
  }

  getActions() {
    const { basePath, suffixSlug, setLoading } = this;
    return {
      async get({ commit }, options) {
        setLoading(commit, true, "isFetching");
        try {
          const response = await this.$axios.$get(
            basePath + suffixSlug,
            options
          );
          commit(mutationNames.UPDATE_LIST, response);
          setLoading(commit, false, "isFetching");
          return response;
        } catch (error) {
          setLoading(commit, false, "isFetching");
          throw error;
        }
      },
      async getById({ commit }, { id, options }) {
        setLoading(commit, true, "isFetching");
        try {
          const response = await this.$axios.$get(
            basePath + "/" + id + suffixSlug,
            options
          );

          commit(mutationNames.REPLACE_LIST_ITEM, response);
          setLoading(commit, false, "isFetching");
          return response;
        } catch (error) {
          setLoading(commit, false, "isFetching");
          throw error;
        }
      },
      async create({ commit }, { payload, options }) {
        setLoading(commit, true, "isCreating");
        try {
          const response = await this.$axios.$post(
            basePath + suffixSlug,
            payload,
            options
          );
          commit(mutationNames.UNSHIFT_LIST, response);
          setLoading(commit, false, "isCreating");
          return response;
        } catch (error) {
          setLoading(commit, false, "isCreating");
          throw error;
        }
      },
      async update({ commit }, { id, payload, preventUpdateItem, options }) {
        setLoading(commit, true, "isUpdating");
        try {
          const response = await this.$axios.$put(
            basePath + "/" + id + suffixSlug,
            payload,
            options
          );
          if (!preventUpdateItem) {
            commit(mutationNames.REPLACE_LIST_ITEM, response);
          }
          setLoading(commit, false, "isUpdating");
          return response;
        } catch (error) {
          setLoading(commit, false, "isUpdating");
          throw error;
        }
      },
      async updatePartial({ commit }, { id, payload, options }) {
        setLoading(commit, true, "isUpdating");
        try {
          const response = await this.$axios.$patch(
            basePath + "/" + id + suffixSlug,
            payload,
            options
          );
          commit(mutationNames.REPLACE_LIST_ITEM, response);
          setLoading(commit, false, "isUpdating");
          return response;
        } catch (error) {
          setLoading(commit, false, "isUpdating");
          throw error;
        }
      },
      async delete({ commit }, { id, options }) {
        setLoading(commit, true, "isDeleting");
        try {
          const response = await this.$axios.delete(
            basePath + "/" + id + suffixSlug,
            options
          );
          commit(mutationNames.REMOVE_LIST_ITEM, id);
          setLoading(commit, false, "isDeleting");
          return response;
        } catch (error) {
          setLoading(commit, false, "isDeleting");
          throw error;
        }
      }
    };
  }
  setLoading(commit, isLoading = true, action = "") {
    commit(mutationNames.REQUESTING, {
      isLoading,
      action,
      inProgress: isLoading
    });
  }
  getCommonMutations() {
    return mutationProps;
  }
  getInitialState() {
    return initialState;
  }
}
