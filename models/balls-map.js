export const getPlayId = (prefix = "", number) => {
  if (number < 0 || number > 49) return console.error("Invalid Input number.");
  const suffix = number < 10 ? `0${number}` : number;
  return [prefix, suffix].join("");
};

export const getNumberLabel = (number) =>
  number < 10 ? `0${number}` : `${number}`;

export const gridNumbers = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
  [41, 42, 43, 44, 45, 46, 47, 48, 49],
];

let RedBalls = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
let GreenBalls = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49];
let BlueBalls = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];

let SmallBalls = [];
let BigBalls = [];
let SmallTailBalls = [];
let BigTailBalls = [];
let OddBalls = [];
let EvenBalls = [];
let SingleBalls = [];
let DoubleBalls = [];

for (let ball = 1; ball < 50; ball++) {
  if (ball % 2 == 0) EvenBalls.push(ball);
  if (ball % 2 == 0 && ball < 49) OddBalls.push(ball);

  if ((Math.trunc(ball / 10) + (ball % 10)) % 2 == 1) SingleBalls.push(ball);
  if ((Math.trunc(ball / 10) + (ball % 10)) % 2 == 0) DoubleBalls.push(ball);

  if (ball < 25) SmallBalls.push(ball);
  if (ball > 24 && ball < 49) BigBalls.push(ball);

  if (ball % 10 > 4 && ball < 49) BigTailBalls.push(ball);
  if (ball % 10 <= 4) SmallTailBalls.push(ball);
}

export const getBallColor = (ball) => {
  if (RedBalls.includes(ball)) return "error"; //vuetify error(red) color
  if (BlueBalls.includes(ball)) return "primary"; //vuetify primary(blue) color
  if (GreenBalls.includes(ball)) return "success"; //vuetify success(green) color
  return "";
};

export const GridZhengmaA = gridNumbers.map((col) =>
  col.map((ball) => ({
    play_id: getPlayId("0201", ball),
    label: getNumberLabel(ball),
    value: ball,
    color: getBallColor(ball),
  }))
);

export const GridZhengmaB = GridZhengmaA.map((col) =>
  col.map((item) => ({
    ...item,
    play_id: getPlayId("0202", item.value),
  }))
);

export const ZhengmaFlip = [
  [
    { play_id: "020301", label: "??????" },
    { play_id: "020302", label: "??????" },
    { play_id: "020401", label: "??????" },
    { play_id: "020402", label: "??????" },
  ],
];

export const GridTemaA = GridZhengmaA.map((col) =>
  col.map((item) => ({
    ...item,
    play_id: getPlayId("0101", item.value),
  }))
);

export const GridTemaB = GridZhengmaA.map((col) =>
  col.map((item) => ({
    ...item,
    play_id: getPlayId("0102", item.value),
  }))
);

export const ShortcutsTema = [
  [
    { title: "???", balls: [3, 15, 27, 39] },
    { title: "???", balls: [12, 24, 36, 48] },
    { title: "???", balls: [9, 21, 33, 45] },
    { title: "???", balls: [6, 18, 30, 42] },
    { title: "???", balls: RedBalls },
    { title: "???", balls: BigBalls },
    { title: "???", balls: SmallBalls },
  ],
  [
    { title: "???", balls: [2, 14, 26, 38] },
    { title: "???", balls: [11, 23, 35, 47] },
    { title: "???", balls: [8, 20, 32, 44] },
    { title: "???", balls: [5, 17, 29, 41] },
    { title: "???", balls: BlueBalls },
    { title: "???", balls: OddBalls },
    { title: "???", balls: EvenBalls },
  ],
  [
    { title: "???", balls: [1, 13, 25, 37, 49] },
    { title: "???", balls: [10, 22, 34, 46] },
    { title: "???", balls: [7, 19, 31, 43] },
    { title: "???", balls: [4, 16, 28, 40] },
    { title: "???", balls: GreenBalls },
    { title: "??????", balls: SingleBalls },
    { title: "??????", balls: DoubleBalls },
  ],
  [
    { title: "?????????", balls: BigTailBalls },
    { title: "?????????", balls: SmallTailBalls },
  ],
];

export const TemaFlipCoin = [
  [
    { play_id: "010401", label: "???" },
    { play_id: "010402", label: "???" },
    { play_id: "010301", label: "???" },
    { play_id: "010302", label: "???" },
  ],
  [
    { play_id: "010501", label: "??????" },
    { play_id: "010502", label: "??????" },
    { play_id: "010701", label: "??????" },
    { play_id: "010702", label: "??????" },
  ],
];
export const ColorBalls = [
  [
    { play_id: "010601", suffix: "0501", label: "???", color: "error" },
    { play_id: "010602", suffix: "0502", label: "???", color: "primary" },
    { play_id: "010603", suffix: "0503", label: "???", color: "success" },
  ],
];
export const ColorBallsFlat = [
  { suffix: "0501", label: "???", color: "error" },
  { suffix: "0502", label: "???", color: "primary" },
  { suffix: "0503", label: "???", color: "success" },
];

export const AnimalList = [
  { name: "???", value: 1, name_en: "Rat", balls: [3, 15, 27, 39] },
  { name: "???", value: 2, name_en: "Ox", balls: [2, 14, 26, 38] },
  { name: "???", value: 3, name_en: "Tiger", balls: [1, 13, 25, 37, 49] },
  { name: "???", value: 4, name_en: "Hare", balls: [12, 24, 36, 48] },
  { name: "???", value: 5, name_en: "Dragon", balls: [11, 23, 35, 47] },
  { name: "???", value: 6, name_en: "Snake", balls: [10, 22, 34, 46] },
  { name: "???", value: 7, name_en: "Horse", balls: [9, 21, 33, 45] },
  { name: "???", value: 8, name_en: "Sheep", balls: [8, 20, 32, 44] },
  { name: "???", value: 9, name_en: "Monkey", balls: [7, 19, 31, 43] },
  { name: "???", value: 10, name_en: "Rooster", balls: [6, 18, 30, 42] },
  { name: "???", value: 11, name_en: "Dog", balls: [5, 17, 29, 41] },
  { name: "???", value: 12, name_en: "Boa", balls: [4, 16, 28, 40] },
];
export const TemaZodiac = AnimalList.map((item, index) => ({
  ...item,
  play_id: getPlayId("1101", index + 1),
  balls: item.balls.map((ball) => ({
    label: getNumberLabel(ball),
    value: ball,
    color: getBallColor(ball),
  })),
}));
export const TailGridNumbers = [
  { name: "0???", value: 0, balls: [10, 20, 30, 40] },
  { name: "1???", value: 1, balls: [1, 11, 21, 31, 41] },
  { name: "2???", value: 2, balls: [2, 12, 22, 32, 42] },
  { name: "3???", value: 3, balls: [3, 13, 23, 33, 43] },
  { name: "4???", value: 4, balls: [4, 14, 24, 34, 44] },
  { name: "5???", value: 5, balls: [5, 15, 25, 35, 45] },
  { name: "6???", value: 6, balls: [6, 16, 26, 36, 46] },
  { name: "7???", value: 7, balls: [7, 17, 27, 37, 47] },
  { name: "8???", value: 8, balls: [8, 18, 28, 38, 48] },
  { name: "9???", value: 9, balls: [9, 19, 29, 39, 49] },
];
export const TailNumbers = TailGridNumbers.map((item, index) => ({
  ...item,
  play_id: getPlayId("1101", index + 1),
  balls: item.balls.map((ball) => ({
    label: getNumberLabel(ball),
    value: ball,
    color: getBallColor(ball),
  })),
}));

const YiXiaoLiangBalls = [
  { name: "???2", value: 1 },
  { name: "???3", value: 2 },
  { name: "???4", value: 3 },
  { name: "???5", value: 4 },
  { name: "???6", value: 5 },
  { name: "???7", value: 6 },
];
const YiWeiLiangBalls = [
  { name: "???2", value: 1 },
  { name: "???3", value: 2 },
  { name: "???4", value: 3 },
  { name: "???5", value: 4 },
  { name: "???6", value: 5 },
  { name: "???7", value: 6 },
];

export {
  RedBalls,
  GreenBalls,
  BlueBalls,
  SmallBalls,
  BigBalls,
  SmallTailBalls,
  BigTailBalls,
  OddBalls,
  EvenBalls,
  SingleBalls,
  DoubleBalls,
  YiWeiLiangBalls,
  YiXiaoLiangBalls,
};
