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
                <th class="text-right pr-2" style="width: 40px">赔率</th>
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
                <td class="pt-4 text-right pr-2">
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
import { DialogType } from "~/models/types/dialog.type";
import { compose_tpz_payload } from "~/plugins/payload_tpz";

export default {
  name: "DialogBittingAmountHitAny",
  props: {
    visible: Boolean,
    loading: Boolean,
    typeTitle: String,
    propertyTitle: String,
    type: [String, Number],
    amount: [String, Number],
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
      return this.editedItem.balls.map((item) => item.label).join(", ");
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
        rates.push(+item.rate);
        balls.push(item.label);
      });

      const _qs = compose_tpz_payload(
        this.propertyTitle,
        this.typeTitle,
        balls,
        rates,
        +this.amount
      );
      const options = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: { UID: uid },
      };
      this.$axios
        .$post("/api-base/SaveHitAny", _qs, options)
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
    padding: 0.5rem 1.25rem
    text-align: left
    height: 56px
  tbody tr td
    vertical-align: top
</style>
