<template>
  <div class="flex-grow-0 flex-shrink-0">
    <p class="mb-2">
      <span>澳门六合彩</span>
      <span>{{ issueNumber }}</span>
      <span>期</span>
    </p>
    <v-layout class="gap-xs">
      <div
        v-for="(ball, index) in ballList"
        :key="`ball-${index}`"
        class="d-flex align-center gap-xs"
      >
        <v-avatar
          :color="$common.getBallColor(ball)"
          class="darken-1 white--text"
          size="24"
        >
          <small class="font-weight-bold">
            {{ ball || "-" }}
          </small>
        </v-avatar>
        <div>{{ $common.getBallAnimalName(+ball) }}</div>
      </div>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "CardTodayResult",
  props: {
    issueNumber: String,
    ballList: { type: Array, default: () => [] },
  },
};
</script>

<style></style>
