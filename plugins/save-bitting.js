const assert = require("assert");
const gcom = require("generatorics");

function combination(arr, n) {
  let dest_balls = [];
  let elements = arr;
  var combs = gcom.clone.combination(elements, n);
  for (let comb of combs) {
    dest_balls.push(comb);
  }
  return dest_balls;
}

function combination0(arr, n) {
  let dest_balls = [];
  let elements = arr.split(",");
  var combs = gcom.clone.combination(elements, n);
  for (let comb of combs) {
    dest_balls.push(comb);
  }
  return dest_balls;
}

function get_factor(title) {
  var f = 0;
  let ldict = {
    五不中: 5,
    六不中: 6,
    七不中: 7,
    八不中: 8,
    九不中: 9,
    十不中: 10,
    五中一: 5,
    六中一: 6,
    七中一: 7,
    八中一: 8,
    九中一: 9,
    十中一: 10,
  };
  return ldict[title];
}

function fixedfront(balls, combination_factor, odds_dict) {
  assert(balls.length >= combination_factor);
  let fixed_front_size = combination_factor - 1;

  let fixed_part = [];
  let append_part = [];
  for (const i in balls) {
    if (i < fixed_front_size) {
      fixed_part.push(balls[i]);
    } else {
      append_part.push(balls[i]);
    }
  }

  let order_name = fixed_part + " 拖 " + append_part;
  let count = 0;
  let arrstring = "",
    odds_string = "";
  for (const v of append_part) {
    count++;
    let temp_front = [];
    for (const v2 of fixed_part) {
      temp_front.push(v2);
    }
    temp_front.push(v);

    if (arrstring.length > 0) {
      arrstring = arrstring + "#";
    }
    arrstring = arrstring + temp_front;

    if (odds_string.length > 0) {
      odds_string = odds_string + ",";
    }
    odds_string = odds_string + min_odds(temp_front, odds_dict);
  }

  let ret = {};
  ret["count"] = count;
  ret["d"] = arrstring;
  ret["odds"] = odds_string;
  ret["name"] = order_name;
  return ret;
}

function multiple(balls, combination_factor, odds_dict) {
  let arrstring = "",
    odds_string = "";
  let temp_arr = combination(balls, combination_factor);
  let count = temp_arr.length;
  assert(count > 0);

  for (const item in temp_arr) {
    if (arrstring.length > 0) {
      arrstring = arrstring + "#";
    }
    arrstring = arrstring + temp_arr[item];

    if (odds_string.length > 0) {
      odds_string = odds_string + ",";
    }
    odds_string = odds_string + min_odds(temp_arr[item], odds_dict);
  }
  let ret = {};
  ret["count"] = count;
  ret["d"] = arrstring;
  ret["odds"] = odds_string;
  ret["name"] = "";
  return ret;
}

function min_odds(arr, odds_dict) {
  let m = odds_dict[arr[0]];
  for (const v of arr) {
    let sv = v.toString();
    if (odds_dict[sv] < m) {
      m = odds_dict[v];
    }
  }
  return m;
}

function compose_payload(
  title_select_item,
  title_compose_item,
  balls,
  odds,
  amount
) {
  // filter paramters
  assert(amount > 0);
  assert(balls.length > 0 && balls.length == odds.length);

  // PreDifined datas :
  const property_dict = {
    五不中: 54,
    六不中: 85,
    七不中: 70,
    八不中: 86,
    九不中: 87,
    十不中: 88,
    五中一: 89,
    六中一: 90,
    七中一: 91,
    八中一: 92,
    九中一: 93,
    十中一: 94,
  };
  let odds_dict = {};
  for (const i in balls) {
    odds_dict[balls[i]] = odds[i];
  }

  // Get combination factor from the title_select_item
  let combination_factor = get_factor(title_select_item);

  assert(combination_factor > 0);

  let t = {};
  switch (title_compose_item) {
    case "复式": // the left one
      t = multiple(balls, combination_factor, odds_dict);
      break;
    default:
      assert(-1);
  }

  let ret = {};
  ret["client_order_id"] = new Date().valueOf();
  ret["t_no"] = t["d"];
  ret["s0"] = balls;
  ret["rate"] = odds;
  ret["amount"] = amount;
  ret["combin"] = t["count"];
  ret["t_rate"] = t["odds"];
  ret["gameType"] = 1;
  ret["property"] = property_dict[title_select_item];
  if (title_compose_item == "胆拖") {
    ret["orderName"] = t["name"];
  }

  return encode_str(ret);
}

function encode_str(v) {
  let s = "";
  for (const item in v) {
    if (s.length > 0) {
      s = s + "&";
    }
    s = s + item;
    s = s + "=";
    s = s + encodeURIComponent(v[item]);
  }
  return s;
}

export {
  combination,
  combination0,
  get_factor,
  fixedfront,
  multiple,
  min_odds,
  compose_payload,
  encode_str,
};
