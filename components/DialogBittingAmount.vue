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
                <th class="pl-4">球号</th>
                <th class="pl-2">赔率</th>
                <th style="width: 100px">
                  <v-layout align-center>
                    <span class="mr-2">金额</span>
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
              <tr
                v-for="(ball, index) in editedItem.balls"
                :key="`row-${index}`"
              >
                <td class="pl-4">
                  <div class="pt-2">{{ ball.label || ball.play_id }}</div>
                </td>
                <td class="pl-2">
                  <div class="pt-2">{{ ball.rate }}</div>
                </td>
                <td class="pr-4">
                  <v-text-field
                    v-model.number="ball.amount"
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

export default {
  name: "DialogBittingAmount",
  props: {
    visible: Boolean,
    loading: Boolean,
    type: [String, Number],
    gClass: [String, Number], //some game
    tot_num: [String, Number], //some game
    bitNumber: { type: [Number, String], default: "—" },
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
      if (v) this.editedItem.balls.sort((a, b) => a.value - b.value);
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
      const data = [];
      this.editedItem.balls.forEach((ball, index) => {
        data.push(`id_${index}=${ball.play_id}`);
        data.push(`rate_${index}=${ball.rate}`);
        data.push(`amount_${index}=${ball.amount}`);
      });
      if (this.type) data.push(`type=${this.type}`);
      if (this.gClass) data.push(`gClass=${this.gClass}`);

      data.push(`client_order_id=${new Date().getTime()}`);
      data.push(`tot_num=${this.editedItem.balls.length}`);

      const options = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        params: { UID: uid },
      };
      this.$axios
        .$post("/api-base/Save", data.join("&"), options)
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
