<template>
  <v-container>
    <v-sheet color="primary" height="1rem"></v-sheet>
    <v-card tile outlined>
      <v-card-title class="grey lighten-4 justify-center text-center">
        用戶協議與規則
      </v-card-title>
      <v-card-text class="text--primary pt-4">
        <p>( 1 ) 當你在下注之後，請等待下注後的成功提示信息。</p>
        <p>( 2 ) 為了避免出現爭議，你必須在下注之後檢查“下注狀況”。</p>
        <p>
          ( 3 ) 任何的投訴必須在開獎之前提出，本公司不會受理任何開獎之後的投訴。
        </p>
        <p>
          ( 4 )
          所有投注項目，公佈賠率時出現的任何打字錯誤或非故意人為失誤，本公司將保留改正錯誤和按正確賠率結算投注的權利。
        </p>
        <p>
          ( 5 )
          公佈之所有賠率為浮動賠率，下注時請確認當前賠率及金額，下注確認後一概不能更改。
        </p>
        <p>( 6 ) 開獎後的投注，將被視為無效。</p>
        <p>
          ( 7 )
          因根據不同的會員賬號所設置的投注金額範圍有所不同，如投注金額超出設定範圍，本公司有權取消其超出之投注金額。
        </p>
        <p>
          ( 8 )
          客戶每次登陸時都應該核對自己賬戶的結算金額。如對結算金額有任何疑問，請在第一時間內通知本公司。
        </p>
        <p>
          ( 9 )
          敬告有意與本公司博彩之客戶，應注意您所在的國家或居住地可能規定網絡博彩不合法，若此情況屬實，本公司將不接受任何客戶因違反當地博彩或賭博法令所引起之任何責任。
        </p>
        <p>
          ( 10 )
          倘若發生遭駭客入侵破壞行為或不可抗拒之災害因素導致網站故障或資料損壞、資料丟失等情況，我們將以本公司線上交易之後備資料為最後處理依據；為了確保各方真實利益，請各會員交易後列印資料，本公司才接受投訴及處理。
        </p>
        <p>
          ( 11 )
          敬告：如由于网络問題或其它原因导致投注重复（同一时间，同一注单与同一金额）的情况，本公司有權將重復的其中一注注單清零，會員不得有任何異議以及延遲交收！
        </p>
        <p>( 12 ) 請認真了解遊戲規則。</p>

        <v-sheet color="primary" height="0.125rem"></v-sheet>
        <v-card color="primary lighten-4" tile flat>
          <v-card-title class="error--text">‧親切提示 </v-card-title>
          <v-card-text>
            1.尊敬的客戶：本系統已新增
            <span class="error--text">
              【一肖不中】【尾數不中】【五至十中一】【七碼】【五行】【特平中】【一肖量】
              【尾数量】
            </span>
            等新項目，如有需求的客戶請联系上级调整新项目退水！
          </v-card-text>
        </v-card>
        <v-sheet color="primary" height="0.125rem"></v-sheet>

        <div class="mt-4" style="border: 1px solid #cacaca">
          <v-card color="grey lighten-4 pt-2" tile flat>
            <v-card-text class="error--text text-center">
              了解 以及 同意 以上 列明的協議和規則
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn @click="disagreeTerm" outlined>不同意</v-btn>
              <v-btn @click="agreeTerm" color="primary" elevation="0"
                >同意</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
    <v-sheet color="primary" height="1rem"></v-sheet>
  </v-container>
</template>

<script>
export default {
  name: "PageTermOfUse",
  layout: "blank",
  middleware: "auth",
  data() {
    return {
      pageLoaded: false,
    };
  },
  middleware({ $cookiz }) {
    if (!$cookiz.get("m6_uid")) {
      $cookiz.remove("m6_uid");
      return redirect("/login");
    }
  },
  methods: {
    disagreeTerm() {
      this.$cookiz.remove("m6_uid");
      window.location.href = "/login";
    },
    agreeTerm() {
      this.$cookiz.set("agree_term", true);
      window.location.href = "/";
    },
    checkTermAgreement() {
      const isAgreeTerm = this.$cookiz.get("agree_term");
      if (isAgreeTerm) return (window.location.href = "/");
      this.$cookiz.remove("m6_uid");
      this.$cookiz.remove("agree_term");
      window.location.href = "/login";
    },
  },
  beforeDestroy() {
    this.checkTermAgreement();
  },
};
</script>
