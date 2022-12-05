export default function (context) {
  let _LOGGED_IN = context.$cookiz.get("m6_uid");
  if (!!_LOGGED_IN) {
    return context.redirect("/");
  }
}
