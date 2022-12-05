import { getCamelCase } from "./casing.util";
import { cloneJSON } from "./clone-deep";
import { encryptData } from "./encryption";
import { getJsonKeyValue } from "./json.util";
import { getPascalCase } from "./pascal-case";
import { getPrice } from "./price.utils";
import { toSuffixString } from "./suffix-string";
import { getBallAnimalName } from "./ball-animal";
import getBallColor from "./ball-color";
import { getNumberLabel, getPlayId } from "~/models/balls-map";

export default {
  cloneJSON,
  encryptData,
  getPascalCase,
  getCamelCase,
  getJsonKeyValue,
  toSuffixString,
  getPlayId,
  getNumberLabel,
  getPrice,
  getBallColor,
  getBallAnimalName,
};
