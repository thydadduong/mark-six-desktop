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
                <th style="min-width: 50px" class="pl-4">项目</th>
                <th>球号</th>
                <th class="text-right pr-4" style="width: 50px">赔率</th>
                <th class="text-right pr-4" style="width: 50px">金额</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="pl-4 py-2">
                  {{ propertyTitle }}
                </td>

                <td class="py-2">
                  {{ displayBallItems }}
                </td>
                <td class="py-2 pr-4 text-right">
                  {{ rate }}
                </td>
                <td class="pr-4 py-2 text-right">
                  {{ amount }}
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
import { DialogType } from "~/models/types/dialog.type";
import qs from "qs";
export default {
  name: "DialogBittingAmountTail",
  props: {
    visible: Boolean,
    loading: Boolean,
    rate: [Number, String],
    amount: [Number, String],
    type: [String, Number],
    property: [String, Number],
    propertyTitle: String,
    saveMultiple: Boolean,
    fixedFrontIndex: [String, Number],
    editedItem: { type: Object, default: () => ({ balls: [] }) },
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
      const amounts = [];
      this.editedItem.balls.forEach((item) => {
        rates.push(item.rate);
        balls.push(item.name);
        amounts.push(item.amount);
      });
      const data = {};
      data.rate = rates.join(",");
      data.amount = this.amount;
      data.chBall = balls.join(",");
      data.property = this.property;
      data.gameType = this.type;
      data.tt = 15;
      data.client_order_id = new Date().getTime();

      const options = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: { UID: uid },
      };
      this.$axios
        .$post("/api-base/SaveTail", qs.stringify(data), options)
        .then((res) => {
          this.isSaving = false;
          if (res.code === 0) {
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
    padding: 0.125rem
    text-align: left
    height: 56px
  tbody tr td
    vertical-align: top
</style>
