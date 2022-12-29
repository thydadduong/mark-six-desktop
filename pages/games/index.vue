<template></template>
<script>
export default {
  name: "PageGameLobby",
  middleware({ redirect }) {
    redirect("/games/tema");
  },
};
</script>
