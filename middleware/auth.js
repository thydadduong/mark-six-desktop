export default function ({ route, $cookiz, redirect }) {
  if (!$cookiz.get("m6_uid"))
    return redirect("/login?redirect=" + route.fullPath);
  if (!$cookiz.get("agree_term")) return redirect("/check-policy");
}
