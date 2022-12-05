import common from "@/utils/common";
import { mutationNames } from "./mutation-names";
export const mutationProps = {
  [mutationNames.REQUESTING](
    state,
    { isLoading = false, action = "", inProgress = false }
  ) {
    state.isLoading = isLoading;
    if (action) {
      state[action] = inProgress;
    }
  },
  [mutationNames.UPDATE_LIST](state, payload) {
    const { results = [], pageCount = 1, itemCount = results.length } = payload;
    state.itemCount = itemCount;
    state.totalPage = pageCount;
    state.dataList = Object.assign([], common.cloneJSON(results));
  },
  [mutationNames.UNSHIFT_LIST](state, payload) {
    state.dataList.unshift(payload);
  },
  [mutationNames.REPLACE_LIST_ITEM](state, payload) {
    let idx = state.dataList.findIndex((i) => i.id === payload.id);
    state.dataList.splice(idx, 1);
    state.dataList.splice(idx, 0, payload);
  },
  [mutationNames.REMOVE_LIST_ITEM](state, id) {
    let idx = state.dataList.findIndex((i) => i.uuid === id || i.id === id);
    if (idx != -1) {
      state.dataList.splice(idx, 1);
    }
  },
  [mutationNames.REMOVE_SOME_ITEMS](state, items = []) {
    items.forEach((item) => {
      let idx = state.dataList.findIndex(
        (i) => i.uuid === item.uuid || i.id === item.uuid
      );
      if (idx != -1) {
        state.dataList.splice(idx, 1);
      }
    });
  },
};
