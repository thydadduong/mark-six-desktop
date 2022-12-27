<template>
  <v-dialog
    @input="visibleChange"
    :value="visible"
    content-class="rounded-0"
    width="40rem"
    scrollable
    persistent
  >
    <v-card :disabled="loading || isSaving" class="dialog-bit" tile>
      <v-card-title class="py-2 justify-center body-2 primary white--text">
        确认订单
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <v-form ref="editedForm" v-model="formValid" :disabled="isSaving">
          <table class="table-bitting">
            <thead>
              <tr>
                <th class="table-bitting__title">项目</th>
                <th class="table-bitting__ball">球号</th>
                <th class="table-bitting__rate">赔率</th>
                <th class="table-bitting__input">
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
                <td class="table-bitting__title">{{ propertyTitle }}</td>
                <td class="table-bitting__ball">{{ displayBallItems }}</td>
                <td class="table-bitting__rate">{{ rate }}</td>
                <td class="table-bitting__input">
                  <input
                    v-model.number="editedItem.amount"
                    :disabled="!customAmount"
                    class="hidden-spin"
                    placeholder="0"
                    type="number"
                    required
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
      <v-card-actions class="dialog-bit__footer justify-center">
        <v-btn @click="visibleChange(false)" elevation="0" outlined small>
          取消
        </v-btn>
        <v-btn
          @click="submit"
          :loading="isSaving"
          color="primary"
          elevation="0"
          small
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
