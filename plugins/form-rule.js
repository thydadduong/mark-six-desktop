import { formRules } from "~/utils/form-rule";

export default (ctx, inject) => {
  inject("formRules", formRules);
};
