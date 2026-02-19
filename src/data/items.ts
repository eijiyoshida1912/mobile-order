import beer from "../data/drink/beer.jpg";
import hiball from "../data/drink/hiball.jpg";
import lemon from "../data/drink/lemon.jpg";
import cola from "../data/drink/cola.jpg";
import oolong from "../data/drink/oolong.jpg";
import coffee from "../data/drink/coffee.jpg";
import orange from "../data/drink/orange.jpg";
import ginger from "../data/drink/ginger.jpg";

import fries from "../data/food/dummy2.jpg";
import edamame from "../data/food/edamame.jpg";
import karaage from "../data/food/karaage.jpg";
import sausage from "../data/food/sausage.jpg";
import pizza from "../data/food/pizza.jpg";
import nuts from "../data/food/nuts.jpg";
import chocolate from "../data/food/chocolate.jpg";
import toast from "../data/food/toast.jpg";
import cheese from "../data/food/cheese.jpg";
import salad from "../data/food/salad.jpg";
import katsu from "../data/food/katsu.jpg";
import icecream from "../data/food/icecream.jpg";

type ItemType = "drink" | "food";
export type Item = {
  id: string;
  name: string;
  price: number;
  image: string;
  type: ItemType;
  desc: string;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const pickDrinkImage = (name: string) => {
  // 画像は既存を使い回し。雰囲気で割当て
  if (
    name.includes("ビール") ||
    name.includes("IPA") ||
    name.includes("ラガー") ||
    name.includes("スタウト")
  )
    return beer;
  if (
    name.includes("ハイボール") ||
    name.includes("ウイスキー") ||
    name.includes("ジム") ||
    name.includes("ジン") ||
    name.includes("ウォッカ")
  )
    return hiball;
  if (
    name.includes("レモン") ||
    name.includes("サワー") ||
    name.includes("シトラス")
  )
    return lemon;
  if (name.includes("コーラ")) return cola;
  if (
    name.includes("ウーロン") ||
    name.includes("緑茶") ||
    name.includes("ジャスミン")
  )
    return oolong;
  if (
    name.includes("コーヒー") ||
    name.includes("エスプレッソ") ||
    name.includes("カフェ")
  )
    return coffee;
  if (
    name.includes("オレンジ") ||
    name.includes("グレープフルーツ") ||
    name.includes("ピーチ")
  )
    return orange;
  if (name.includes("ジンジャー")) return ginger;
  // 迷ったらローテーションっぽく
  return lemon;
};

const pickFoodImage = (name: string) => {
  if (name.includes("枝豆")) return edamame;
  if (
    name.includes("唐揚げ") ||
    name.includes("フライ") ||
    name.includes("天ぷら") ||
    name.includes("串")
  )
    return karaage;
  if (name.includes("ソーセージ")) return sausage;
  if (name.includes("ピザ")) return pizza;
  if (name.includes("ナッツ")) return nuts;
  if (name.includes("チョコ") || name.includes("ブラウニー")) return chocolate;
  if (name.includes("トースト") || name.includes("パン")) return toast;
  if (name.includes("チーズ")) return cheese;
  if (name.includes("サラダ")) return salad;
  if (name.includes("カツ")) return katsu;
  if (
    name.includes("アイス") ||
    name.includes("パフェ") ||
    name.includes("プリン")
  )
    return icecream;
  if (name.includes("ポテト")) return fries;
  return fries;
};

// --------------------
// 100 DRINKS 生成
// --------------------
const drinkBasesBeer = [
  "生ビール",
  "瓶ビール",
  "黒ビール",
  "クラフトビール",
  "IPA",
  "ペールエール",
  "ラガー",
  "ヴァイツェン",
  "スタウト",
  "セゾン",
];

const drinkBasesHighball = [
  "角ハイボール",
  "ジンジャーハイボール",
  "コークハイボール",
  "メガハイボール",
  "ウイスキーハイボール",
  "ジンソーダ",
  "ジントニック",
  "ウォッカソーダ",
  "モスコミュール",
  "ラムコーク",
];

const drinkBasesSour = [
  "レモンサワー",
  "グレープフルーツサワー",
  "梅サワー",
  "カルピスサワー",
  "シトラスサワー",
  "トマトサワー",
  "青りんごサワー",
  "白ぶどうサワー",
  "パインサワー",
  "柚子サワー",
];

const drinkBasesCocktail = [
  "カシスオレンジ",
  "カシスソーダ",
  "ピーチウーロン",
  "ファジーネーブル",
  "チャイナブルー",
  "スクリュードライバー",
  "ソルティドッグ",
  "テキーラサンライズ",
  "モヒート",
  "ミモザ",
];

const drinkBasesSoft = [
  "コーラ",
  "ジンジャーエール",
  "オレンジジュース",
  "グレープフルーツジュース",
  "烏龍茶",
  "緑茶",
  "ジャスミン茶",
  "炭酸水",
  "トニックウォーター",
  "ホットコーヒー",
  "アイスコーヒー",
  "カフェラテ",
  "アイスティー",
  "レモネード",
  "ノンアルビール",
];

const flavors = [
  "塩レモン",
  "はちみつレモン",
  "生搾り",
  "無糖",
  "濃いめ",
  "爽快",
  "すっきり",
  "大人",
  "甘さ控えめ",
  "贅沢",
];

function uniqueTake(list: string[], n: number) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of list) {
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
    if (out.length >= n) break;
  }
  return out;
}

const drinkNameCandidates = uniqueTake(
  [
    ...drinkBasesBeer,
    ...drinkBasesHighball,
    ...drinkBasesSour,
    ...drinkBasesCocktail,
    ...drinkBasesSoft,
    // フレーバー付けで増やす
    ...drinkBasesSour.flatMap((b) => flavors.map((f) => `${b}（${f}）`)),
    ...drinkBasesHighball.flatMap((b) => flavors.map((f) => `${b}（${f}）`)),
    ...drinkBasesBeer.flatMap((b) => flavors.map((f) => `${b}（${f}）`)),
    ...drinkBasesSoft.flatMap((b) => flavors.map((f) => `${b}（${f}）`)),
  ],
  500,
);

const drinks: Item[] = Array.from({ length: 100 }, (_, i) => {
  const name = drinkNameCandidates[i] ?? `ドリンク${i + 1}`;
  const base = 420 + (i % 12) * 30; // 420〜750くらい
  const price = name.includes("メガ")
    ? base + 180
    : name.includes("クラフト") ||
        name.includes("IPA") ||
        name.includes("スタウト")
      ? base + 120
      : name.includes("ノンアル")
        ? 380
        : clamp(base, 380, 980);

  const desc =
    name.includes("ビール") ||
    name.includes("IPA") ||
    name.includes("ラガー") ||
    name.includes("スタウト")
      ? "キンキンに冷えた一杯。まずはこれ。"
      : name.includes("ハイボール") ||
          name.includes("ジン") ||
          name.includes("ウォッカ") ||
          name.includes("ラム")
        ? "キレのある炭酸感でスッと飲める。"
        : name.includes("サワー")
          ? "さっぱり爽快。食事にも合う。"
          : name.includes("コーヒー") || name.includes("カフェ")
            ? "食後にゆっくりどうぞ。"
            : "すっきり飲みやすい定番。";

  return {
    id: String(i + 1),
    name,
    price,
    image: pickDrinkImage(name),
    type: "drink",
    desc,
  };
});

// --------------------
// 100 FOODS 生成
// --------------------
const foodSnacks = [
  "枝豆",
  "冷やしトマト",
  "たたききゅうり",
  "塩キャベツ",
  "白菜キムチ",
  "漬物盛り合わせ",
  "チャンジャ",
  "もずく酢",
  "たこわさ",
  "塩辛",
];

const foodFried = [
  "フライドポテト",
  "鶏の唐揚げ",
  "なんこつ唐揚げ",
  "タコ唐揚げ",
  "フライドチキン",
  "オニオンリング",
  "カマンベールフライ",
  "エビフライ",
  "アジフライ",
  "コロッケ",
];

const foodGrill = [
  "ソーセージ盛り合わせ",
  "焼き鳥（ねぎま）",
  "焼き鳥（もも）",
  "焼き鳥（皮）",
  "焼き鳥（つくね）",
  "ホッケ焼き",
  "ししゃも焼き",
  "エリンギバター焼き",
  "厚揚げ焼き",
  "焼きナス",
];

const foodCarb = [
  "ミックスピザ",
  "マルゲリータピザ",
  "明太マヨピザ",
  "ガーリックトースト",
  "バタートースト",
  "焼きおにぎり",
  "お茶漬け",
  "ナポリタン",
  "焼きそば",
  "キーマカレー",
];

const foodSalad = [
  "シーザーサラダ",
  "豆腐サラダ",
  "海藻サラダ",
  "ポテトサラダ",
  "コールスロー",
  "トマトサラダ",
  "生ハムサラダ",
  "チョレギサラダ",
  "ツナサラダ",
  "彩りサラダ",
];

const foodHearty = [
  "ハムカツ",
  "メンチカツ",
  "ロースカツ",
  "チキン南蛮",
  "豚の生姜焼き",
  "牛すじ煮込み",
  "もつ煮込み",
  "麻婆豆腐",
  "餃子",
  "もつ鍋（小）",
];

const foodCheeseNuts = [
  "チーズ盛り合わせ",
  "カマンベールチーズ",
  "スモークチーズ",
  "クリームチーズクラッカー",
  "ミックスナッツ",
  "塩ナッツ",
  "ハニーナッツ",
  "チョコナッツ",
  "ジャーキー",
  "サラミ",
];

const foodDessert = [
  "アイスクリーム",
  "バニラアイス",
  "チョコアイス",
  "抹茶アイス",
  "プリン",
  "チョコレート",
  "ブラウニー",
  "チーズケーキ",
  "シャーベット",
  "ミニパフェ",
];

const toppings = [
  "（大盛り）",
  "（ピリ辛）",
  "（ガーリック）",
  "（チーズ）",
  "（ねぎ塩）",
  "（明太）",
  "（バター）",
  "（柚子）",
  "（わさび）",
  "（山椒）",
];

const foodNameCandidates = uniqueTake(
  [
    ...foodSnacks,
    ...foodFried,
    ...foodGrill,
    ...foodCarb,
    ...foodSalad,
    ...foodHearty,
    ...foodCheeseNuts,
    ...foodDessert,
    // トッピングで増やす
    ...foodFried.flatMap((b) => toppings.map((t) => `${b}${t}`)),
    ...foodGrill.flatMap((b) => toppings.map((t) => `${b}${t}`)),
    ...foodCarb.flatMap((b) => toppings.map((t) => `${b}${t}`)),
    ...foodHearty.flatMap((b) => toppings.map((t) => `${b}${t}`)),
    ...foodCheeseNuts.flatMap((b) => toppings.map((t) => `${b}${t}`)),
  ],
  800,
);

const foods: Item[] = Array.from({ length: 100 }, (_, i) => {
  const name = foodNameCandidates[i] ?? `フード${i + 1}`;
  const base = 420 + (i % 16) * 40; // 420〜1020くらい
  const price = name.includes("鍋")
    ? base + 280
    : name.includes("煮込み")
      ? base + 180
      : name.includes("ピザ")
        ? base + 220
        : name.includes("サラダ")
          ? base + 80
          : name.includes("アイス") ||
              name.includes("プリン") ||
              name.includes("ケーキ") ||
              name.includes("パフェ")
            ? base - 40
            : clamp(base, 380, 1480);

  const desc = name.includes("サラダ")
    ? "さっぱり食べたい時に。"
    : name.includes("唐揚げ") || name.includes("フライ")
      ? "外カリ中ジューシー。お酒が進む。"
      : name.includes("焼き鳥") || name.includes("焼き")
        ? "香ばしく焼き上げた定番。"
        : name.includes("チーズ")
          ? "濃厚で相性抜群。"
          : name.includes("アイス") ||
              name.includes("プリン") ||
              name.includes("ケーキ") ||
              name.includes("パフェ")
            ? "食後の甘いしめに。"
            : "迷ったらこれ。";

  return {
    id: String(101 + i),
    name,
    price,
    image: pickFoodImage(name),
    type: "food",
    desc,
  };
});

// ★アプリ側は今まで通り `items` を import するだけでOK
export const items: Item[] = [...drinks, ...foods];
