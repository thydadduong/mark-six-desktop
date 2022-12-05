export default function ({ $axios, redirect, store, $cookiz }) {
  $axios.setHeader("Accept-Language", "en");
  $axios.onRequest(({ headers }) => {
    const _TOKEN = $cookiz.get("access_token");
    if (_TOKEN) headers.common["Authorization"] = `Bearer ${_TOKEN}`;
  });

  $axios.onError((error) => {
    console.log(error.request);
    const isUnauthorized = [401 /* , 504 */].includes(error.response?.status);
    if (isUnauthorized) {
      $cookiz.remove("user_id");
      $cookiz.remove("m6_uid");
      $cookiz.remove("agree_term");
      $cookiz.remove("access_token");
      $cookiz.remove("refresh_token");
      redirect("/login");
    }
  });
  $axios.onResponse((res) => {
    if (res?.data?.code != 4) return;
    $cookiz.remove("m6_uid");
    redirect("/login");
  });
}
