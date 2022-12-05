import { AnimalList } from "~/models/balls-map";

export const getBallAnimalName = (ball) => {
  let title = "";
  for (const item of AnimalList) {
    if (item.balls.includes(ball)) {
      title = item.name;
      break;
    }
  }
  return title;
};
