const RedBalls = [
  1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46,
];
const GreenBalls = [
  5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49,
];
const BlueBalls = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];

export default (ball) => {
  ball = Number(ball);
  if (RedBalls.includes(ball)) return "error"; //vuetify error(red) color
  if (BlueBalls.includes(ball)) return "primary"; //vuetify primary(blue) color
  if (GreenBalls.includes(ball)) return "success"; //vuetify success(green) color
  return "";
};
