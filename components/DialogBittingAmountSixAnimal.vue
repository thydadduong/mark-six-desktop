<template>
  <v-dialog
    @input="visibleChange"
    :value="visible"
    width="40rem"
    scrollable
    persistent
  >
    <v-card :disabled="loading || isSaving">
      <v-card-title class="justify-center text-center"> 确认订单 </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pb-2 px-0 text--primary">
        <v-form ref="editedForm" v-model="formValid" :disabled="isSaving">
          <table class="table-bitting">
            <thead>
              <tr>
                <th style="width: 200px" class="pl-4">项目</th>
                <th class="px-3">球号</th>
                <th class="text-right px-3" style="width: 75px">赔率</th>
                <th class="text-right px-3" style="width: 100px">
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
                <td class="pl-4 pa-3">
                  <v-layout class="gap-xs" wrap>
                    <span>{{ propertyTitle }}</span>
                    <span v-if="typeTitle"> [{{ typeTitle }}]</span>
                  </v-layout>
                </td>

                <td class="pa-3">
                  {{ displayBallItems }}
                </td>
                <td class="text-right pa-3">
                  {{ editedItem.minRate }}
                </td>
                <td class="px-3 py-2 text-right">
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
import qs from "qs";
import { DialogType } from "~/models/types/dialog.type";

export default {
  name: "DialogBittingAmountSixAnimal",
  props: {
    visible: Boolean,
    loading: Boolean,
    typeTitle: String,
    property: [String, Number],
    propertyTitle: String,
    type: [String, Number],
    ck_property: [String, Number],
    fixedFrontIndex: [String, Number],
    editedItem: { type: Object, default: () => ({ balls: [], amount: 5 }) },
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
      const s0List = [];
      this.editedItem.balls.forEach((item) => {
        rates.push(+item.rate);
        balls.push(item.label);
        s0List.push(item.value >= 10 ? item.value : `0${item.value}`);
      });
      const data = {
        s0: s0List.join(","),
        sn: balls.join(","),
        rate: this.editedItem.minRate,
        type: this.type,
        amount: this.editedItem.amount,
        property: this.property,
        ck_property: this.ck_property,
        client_order_id: new Date().getTime(),
      };
      const options = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: { UID: uid },
      };
      this.$axios
        .$post("/api-base/SaveSixAnimals", qs.stringify(data), options)
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
