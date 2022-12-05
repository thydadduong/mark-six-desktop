<template>
  <v-dialog
    @input="visibleChange"
    :value="visible"
    width="30rem"
    scrollable
    persistent
  >
    <v-card :disabled="loading || isSaving">
      <v-card-title class="justify-center text-center"> 确认订单 </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pb-2 px-0 text--primary">
        <v-form ref="editedForm" v-model="formValid" :disabled="isSaving">
          <table class="table-ball-amount">
            <thead>
              <tr>
                <th style="width: 80px" class="pl-4">项目</th>
                <th>球号</th>
                <th class="text-right pr-4" style="width: 40px">赔率</th>
                <th class="text-right pr-4" style="width: 70px">
                  <v-layout class="gap-xs" align-center>
                    <span class="text-no-wrap">金额</span>
                    <v-btn
                      @click="customAmount = true"
                      class="rounded"
                      color="primary"
                      small
                      icon
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </v-layout>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="pl-4 pt-4">
                  <v-layout class="gap-xs" wrap>
                    <span>{{ propertyTitle }}</span>
                    <span v-if="typeTitle"> [{{ typeTitle }}]</span>
                  </v-layout>
                </td>

                <td class="pt-4">
                  {{ displayBallItems }}
                </td>
                <td class="pa-4 text-right">
                  {{ editedItem.minRate }}
                </td>
                <td class="pr-4 py-2 text-right">
                  <v-text-field
                    v-model.number="editedItem.amount"
                    :rules="$formRules.bittingAmount"
                    :readonly="!customAmount"
                    placeholder="0"
                    outlined
                    dense
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-btn @click="visibleChange(false)" elevation="0"> 取消 </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          @click="submit"
          :loading="isSaving"
          color="primary"
          elevation="0"
        >
          保存
        </v-btn>
      </v-card-actions>
      <DialogMessageBox ref="dialogMessage" auto-close />
    </v-card>
  </v-dialog>
</template>

<script>
import assert from "assert";
import gcom from "generatorics";
import { DialogType } from "~/models/types/dialog.type";
function combination(arr, n) {
  let dest_balls = [];
  let elements = arr;
  let combs = gcom.clone.combination(elements, n);
  for (let comb of combs) {
    dest_balls.push(comb);
  }
  return dest_balls;
}

function combination0(arr, n) {
  let dest_balls = [];
  let elements = arr.split(",");
  let combs = gcom.clone.combination(elements, n);
  for (let comb of combs) {
    dest_balls.push(comb);
  }
  return dest_balls;
}

function get_factor(title) {
  let f = 0;
  switch (title) {
    case "三全中":
    case "三中二":
      f = 3;
      break;
    case "二全中":
    case "特串":
    case "二中特":
      f = 2;
      break;
    default:
      f = -1;
      break;
  }

  return f;
}

function fixedfront(balls, combination_factor, odds_dict) {
  assert(balls.length >= combination_factor);
  let fixed_front_size = combination_factor - 1;

  let fixed_part = [];
  let append_part = [];
  for (const i in balls) {
    if (i < fixed_front_size) {
      fixed_part.push(balls[i]);
    } else {
      append_part.push(balls[i]);
    }
  }

  let order_name = fixed_part + " 拖 " + append_part;
  let count = 0;
  let arrstring = "",
    odds_string = "";
  for (const v of append_part) {
    count++;
    let temp_front = [];
    for (const v2 of fixed_part) {
      temp_front.push(v2);
    }
    temp_front.push(v);

    if (arrstring.length > 0) {
      arrstring = arrstring + "#";
    }
    arrstring = arrstring + temp_front;

    if (odds_string.length > 0) {
      odds_string = odds_string + ",";
    }
    odds_string = odds_string + min_odds(temp_front, odds_dict);
  }

  const ret = {};
  ret["count"] = count;
  ret["d"] = arrstring;
  ret["odds"] = odds_string;
  ret["name"] = order_name;
  return ret;
}

function multiple(balls, combination_factor, odds_dict) {
  let arrstring = "",
    odds_string = "";
  let temp_arr = combination(balls, combination_factor);
  let count = temp_arr.length;
  assert(count > 0);

  for (const item in temp_arr) {
    if (arrstring.length > 0) {
      arrstring = arrstring + "#";
    }
    arrstring = arrstring + temp_arr[item];

    if (odds_string.length > 0) {
      odds_string = odds_string + ",";
    }
    odds_string = odds_string + min_odds(temp_arr[item], odds_dict);
  }
  const ret = {};
  ret["count"] = count;
  ret["d"] = arrstring;
  ret["odds"] = odds_string;
  ret["name"] = "";
  return ret;
}

function min_odds(arr, odds_dict) {
  let m = odds_dict[arr[0]];
  for (const v of arr) {
    let sv = v.toString();
    if (odds_dict[sv] < m) {
      m = odds_dict[v];
    }
  }
  return m;
}

function compose_payload(
  title_select_item,
  title_compose_item,
  balls,
  odds,
  amount
) {
  // filter paramters
  assert(amount > 0);
  assert(balls.length > 0 && balls.length == odds.length);

  // PreDifined datas :
  const property_dict = {
    三全中: 44,
    三中二: 45,
    二全中: 41,
    特串: 43,
    二中特: 42,
  };
  const itype = 4;
  let odds_dict = {};
  for (const i in balls) {
    odds_dict[balls[i]] = odds[i];
  }

  // Get combination factor from the title_select_item
  let combination_factor = get_factor(title_select_item);
  assert(combination_factor > 0);

  let t = {};
  switch (title_compose_item) {
    case "复式": // the left one
      t = multiple(balls, combination_factor, odds_dict);
      break;

    case "胆拖":
      t = fixedfront(balls, combination_factor, odds_dict);
      break;
    default:
      assert(-1);
  }

  let ret = {};
  ret["client_order_id"] = new Date().valueOf();
  ret["t_no"] = t["d"];
  ret["s0"] = balls;
  ret["rate"] = odds;
  ret["amount"] = amount;
  ret["totCount"] = t["count"];
  ret["t_rate"] = t["odds"];
  ret["property"] = property_dict[title_select_item];
  if (title_compose_item == "胆拖") {
    ret["orderName"] = t["name"];
  }

  console.log(ret);

  return encode_str(ret);
}

function encode_str(v) {
  let s = "";
  for (const item in v) {
    if (s.length > 0) s = s + "&";
    s = s + item;
    s = s + "=";
    s = s + encodeURIComponent(v[item]);
  }

  return s;
}

export default {
  name: "DialogBittingAmountLianma",
  props: {
    visible: Boolean,
    loading: Boolean,
    amount: [Number, String],
    type: [String, Number],
    property: [String, Number],
    typeTitle: String,
    propertyTitle: String,
    saveMultiple: Boolean,
    fixedFrontIndex: [String, Number],
    editedItem: {
      type: Object,
      default: () => ({ balls: [], minRate: 0, amount: 5 }),
    },
  },
  data() {
    return {
      isSaving: false,
      formValid: true,
      customAmount: false,
    };
  },
  computed: {
    dialogTitle() {
      return this.editedItem.id
        ? this.$t("channel.dialog.title.update")
        : this.$t("channel.dialog.title.create");
    },
    submitTitle() {
      return !this.editedItem.id
        ? this.$t("channel.button.new")
        : this.$t("channel.button.update");
    },
    displayBallItems() {
      const fixed = [];
      const items = [];
      this.editedItem.balls.forEach((item, index) => {
        if (index <= this.fixedFrontIndex) fixed.push(item.label);
        else items.push(item.label);
      });
      if (fixed.length) return `[${fixed.join(", ")}]拖[${items.join(", ")}]`;
      return items.join(", ");
    },
  },
  watch: {
    visible(v) {
      this.customAmount = false;
      this.$refs.editedForm?.resetValidation();
      setTimeout(() => {
        if (v) {
          this.$refs.editedForm.validate();
        }
      }, 100);
    },
  },
  methods: {
    visibleChange(v = false) {
      this.$emit("update:visible", v);
    },
    submit() {
      if (!this.$refs.editedForm.validate()) return;
      this.isSaving = true;

      const uid = this.$cookiz.get("m6_uid");
      const rates = [];
      const balls = [];
      this.editedItem.balls.forEach((item) => {
        rates.push(+item.rate || item.rate);
        balls.push(item.label);
      });
      let _qs = compose_payload(
        this.propertyTitle,
        this.typeTitle,
        balls,
        rates,
        this.amount
      );
      const _URI =
        this.typeTitle == "胆拖"
          ? "/api-base/SaveFixedFront"
          : "/api-base/SaveMultiple";

      console.log(_qs);
      const options = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: { UID: uid },
      };
      this.$axios
        .$post(_URI, _qs, options)
        .then((res) => {
          this.isSaving = false;
          if (!res.code) {
            this.$refs.dialogMessage.show(DialogType.SUCCESS);
            this.$emit("saved");
            this.visibleChange(false);
            return;
          }
          const message = res.error;
          this.$refs.dialogMessage.show(DialogType.ERROR, message);
        })
        .catch((error) => {
          console.log(error);
          this.isSaving = false;
        });
    },
  },
};
</script>

<style lang="sass">
.table-ball-amount
  width: 100%
  border-collapse: collapse
  thead tr
    background-color: #f5f5f5

  tr th,
  tr td
    padding: 0.5rem 1.25rem
    text-align: left
    height: 56px
  tbody tr td
    vertical-align: top
</style>
