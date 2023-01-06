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
      <v-card-title
        class="py-2 justify-center text-center body-2 primary white--text"
      >
        确认订单
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <v-form ref="editedForm" v-model="formValid" :disabled="isSaving">
          <table class="table-bitting">
            <thead>
              <tr>
                <th class="table-bitting__title text-center">球号</th>
                <th class="table-bitting__rate text-center">赔率</th>
                <th class="table-bitting__input text-center">
                  <v-layout align-center>
                    <span class="ml-auto">金额</span>
                    <v-btn
                      @click="customAmount = !customAmount"
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
                <td class="table-bitting__title text-center">
                  <div class="pt-1">{{ ball.label || ball.play_id }}</div>
                </td>
                <td class="table-bitting__rate text-center">
                  <div class="pt-1">{{ ball.rate }}</div>
                </td>
                <td class="table-bitting__input text-center">
                  <input
                    v-model.number="ball.amount"
                    :disabled="!customAmount"
                    class="hidden-spin"
                    type="number"
                    required
                    outlined
                    dense
                  />
                </td>
              </tr>

              <!-- <tr>
                <td>注数:3</td>
                <td colspan="2">合计金额:6</td>
              </tr>
              如赔率变化，以最新赔率确认投注！ -->
            </tbody>
          </table>
        </v-form>
      </v-card-text>
      <v-card-actions class="dialog-bit__footer justify-center">
        <v-btn @click="visibleChange(false)" elevation="0" small outlined>
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
            // this.$store.dispatch("lottery/setRecentBets", res.records);
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

<style lang="sass"></style>
