import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

const PALETTE = {
  ink: '#342D4F',
  muted: '#786F91',
  cream: '#FFF9F0',
  pink: '#FF6F91',
  lavender: '#8B78E6',
  white: '#FFFFFF',
};

type Category = 'hairStyle' | 'hairColor' | 'eyes' | 'tops' | 'bottoms' | 'dresses' | 'shoes' | 'bags' | 'accessories';
type HairStyle = 'bob' | 'ponytail' | 'curls';
type BottomStyle = 'skirt' | 'tulle' | 'pleated' | 'shorts' | 'jeans';
type ShoeStyle = 'flats' | 'sneakers' | 'boots' | 'sandals';
type TopStyle = 'tank' | 'tee' | 'puff';
type BagStyle = 'none' | 'crossbody' | 'heart' | 'tote';

type Choice<T extends string> = {
  id: T;
  label: string;
  color?: string;
};

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'hairStyle', label: 'Capelli', icon: '✂️' },
  { id: 'hairColor', label: 'Colore', icon: '🎨' },
  { id: 'eyes', label: 'Occhi', icon: '👀' },
  { id: 'tops', label: 'Maglie', icon: '👕' },
  { id: 'bottoms', label: 'Gonne', icon: '🩰' },
  { id: 'dresses', label: 'Vestiti', icon: '👗' },
  { id: 'shoes', label: 'Scarpe', icon: '👟' },
  { id: 'bags', label: 'Borse', icon: '👜' },
  { id: 'accessories', label: 'Accessori', icon: '✨' },
];

const HAIR_STYLES: Choice<HairStyle>[] = [
  { id: 'bob', label: 'Caschetto' },
  { id: 'ponytail', label: 'Codine' },
  { id: 'curls', label: 'Ricci' },
];

const HAIR_COLORS = [
  { id: 'chocolate', label: 'Castano', color: '#5B3428' },
  { id: 'honey', label: 'Miele', color: '#D89B42' },
  { id: 'night', label: 'Nero', color: '#272334' },
  { id: 'ginger', label: 'Ramato', color: '#B95738' },
  { id: 'magic', label: 'Magico', color: '#8E5AC7' },
] as const;

const EYE_COLORS = [
  { id: 'brown', label: 'Nocciola', color: '#74462E' },
  { id: 'green', label: 'Verde', color: '#4F9A70' },
  { id: 'blue', label: 'Azzurro', color: '#438EC9' },
  { id: 'violet', label: 'Viola', color: '#7B5BB7' },
] as const;

const TOPS = [
  { id: 'berryTee', label: 'T-shirt stella', color: '#F55F86', accent: '#FFD2DE', decoration: '★', style: 'tee' as TopStyle, preview: '👕' },
  { id: 'sunPuff', label: 'Maniche a sbuffo', color: '#FFC84A', accent: '#FFF0A8', decoration: '✿', style: 'puff' as TopStyle, preview: '✿' },
  { id: 'skyTank', label: 'Canotta cielo', color: '#65BCEB', accent: '#D6F1FF', decoration: '⚓', style: 'tank' as TopStyle, preview: '♢' },
  { id: 'mintTee', label: 'T-shirt cuore', color: '#65CDAA', accent: '#CCF3E7', decoration: '♥', style: 'tee' as TopStyle, preview: '👕' },
  { id: 'lilacTank', label: 'Canotta luna', color: '#9A7BE8', accent: '#E2D9FF', decoration: '☾', style: 'tank' as TopStyle, preview: '♢' },
  { id: 'coralPuff', label: 'Maglia farfalla', color: '#FF896F', accent: '#FFE0D8', decoration: '✦', style: 'puff' as TopStyle, preview: '✦' },
] as const;

const BOTTOMS = [
  { id: 'violetSkirt', label: 'Gonna viola', color: '#8B78E6', style: 'skirt' as BottomStyle, preview: '▲' },
  { id: 'pinkTulle', label: 'Tulle rosa', color: '#F58DB6', style: 'tulle' as BottomStyle, preview: '✦' },
  { id: 'sunPleated', label: 'Gonna sole', color: '#F5B942', style: 'pleated' as BottomStyle, preview: '▾' },
  { id: 'orangeShorts', label: 'Shorts', color: '#FF9F68', style: 'shorts' as BottomStyle, preview: '▰' },
  { id: 'blueJeans', label: 'Jeans', color: '#547DB7', style: 'jeans' as BottomStyle, preview: 'Ⅱ' },
] as const;

const DRESSES = [
  { id: 'princess', label: 'Principessa', color: '#A879E6', accent: '#F3D7FF', decoration: '♛' },
  { id: 'rainbow', label: 'Arcobaleno', color: '#60BDE7', accent: '#FFD166', decoration: '🌈' },
  { id: 'garden', label: 'Giardino', color: '#68C89F', accent: '#FFF0A8', decoration: '✿' },
  { id: 'party', label: 'Festa', color: '#F2638C', accent: '#FFD4E1', decoration: '★' },
] as const;

const SHOES = [
  { id: 'pinkFlats', label: 'Ballerine', color: '#F45F88', accent: '#FFD1DF', style: 'flats' as ShoeStyle, preview: '🎀' },
  { id: 'mintSneakers', label: 'Sneakers', color: '#44A889', accent: '#FFFFFF', style: 'sneakers' as ShoeStyle, preview: '★' },
  { id: 'purpleBoots', label: 'Stivaletti', color: '#7564C7', accent: '#C9BFFF', style: 'boots' as ShoeStyle, preview: '✦' },
  { id: 'sunSandals', label: 'Sandali', color: '#F4B942', accent: '#FFF0A8', style: 'sandals' as ShoeStyle, preview: '☀' },
] as const;

const BAGS = [
  { id: 'noBag', label: 'Nessuna', color: '#D8D1C8', accent: '#FFFFFF', style: 'none' as BagStyle, preview: '×' },
  { id: 'crossbody', label: 'Tracolla', color: '#F09A62', accent: '#FFD6B8', style: 'crossbody' as BagStyle, preview: '●' },
  { id: 'heartBag', label: 'Borsa cuore', color: '#EC5F91', accent: '#FFD0DF', style: 'heart' as BagStyle, preview: '♥' },
  { id: 'toteBag', label: 'Borsetta', color: '#7E69CD', accent: '#DCD3FF', style: 'tote' as BagStyle, preview: '▣' },
] as const;

const ACCESSORIES = [
  { id: 'glasses', label: 'Occhiali', color: '#D65B88', preview: '♡' },
  { id: 'necklace', label: 'Collana', color: '#F0B53A', preview: '♢' },
  { id: 'earrings', label: 'Orecchini', color: '#69A9D2', preview: '••' },
  { id: 'hat', label: 'Cappello', color: '#A275DB', preview: '♛' },
  { id: 'headband', label: 'Cerchietto', color: '#F06D8F', preview: '🎀' },
] as const;

type AccessoryId = (typeof ACCESSORIES)[number]['id'];

type Look = {
  hairStyle: HairStyle;
  hairColor: (typeof HAIR_COLORS)[number]['id'];
  eyes: (typeof EYE_COLORS)[number]['id'];
  top: (typeof TOPS)[number]['id'];
  bottom: (typeof BOTTOMS)[number]['id'];
  dress: (typeof DRESSES)[number]['id'] | null;
  shoes: (typeof SHOES)[number]['id'];
  bag: (typeof BAGS)[number]['id'];
  accessories: AccessoryId[];
};

const INITIAL_LOOK: Look = {
  hairStyle: 'bob',
  hairColor: HAIR_COLORS[0].id,
  eyes: EYE_COLORS[2].id,
  top: TOPS[0].id,
  bottom: BOTTOMS[0].id,
  dress: null,
  shoes: SHOES[0].id,
  bag: BAGS[0].id,
  accessories: [],
};

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function Hair({ style, color }: { style: HairStyle; color: string }) {
  if (style === 'ponytail') {
    return (
      <>
        <View style={[styles.ponytailLeft, { backgroundColor: color }]} />
        <View style={[styles.ponytailRight, { backgroundColor: color }]} />
        <View style={[styles.hairCap, { backgroundColor: color }]} />
        <View style={[styles.hairFringeLeft, { backgroundColor: color }]} />
        <View style={[styles.hairFringeRight, { backgroundColor: color }]} />
      </>
    );
  }

  if (style === 'curls') {
    return (
      <>
        <View style={[styles.curlBack, { backgroundColor: color }]} />
        <View style={[styles.curl, styles.curlOne, { backgroundColor: color }]} />
        <View style={[styles.curl, styles.curlTwo, { backgroundColor: color }]} />
        <View style={[styles.curl, styles.curlThree, { backgroundColor: color }]} />
        <View style={[styles.curl, styles.curlFour, { backgroundColor: color }]} />
        <View style={[styles.hairCap, { backgroundColor: color }]} />
      </>
    );
  }

  return (
    <>
      <View style={[styles.bobBack, { backgroundColor: color }]} />
      <View style={[styles.hairCap, { backgroundColor: color }]} />
      <View style={[styles.hairFringeLeft, { backgroundColor: color }]} />
      <View style={[styles.hairFringeRight, { backgroundColor: color }]} />
    </>
  );
}

function Shoe({ kind, color, accent, side }: {
  kind: ShoeStyle;
  color: string;
  accent: string;
  side: 'left' | 'right';
}) {
  return (
    <View style={[styles.shoeSlot, side === 'left' ? styles.shoeSlotLeft : styles.shoeSlotRight]}>
      {kind === 'flats' && (
        <>
          <View style={[styles.flatFoot, { backgroundColor: color }]} />
          <View style={[styles.shoeBowLeft, { backgroundColor: accent }]} />
          <View style={[styles.shoeBowRight, { backgroundColor: accent }]} />
        </>
      )}
      {kind === 'sneakers' && (
        <>
          <View style={[styles.sneakerFoot, { backgroundColor: color }]} />
          <View style={[styles.sneakerSole, { backgroundColor: accent }]} />
          <Text style={[styles.sneakerLaces, { color: accent }]}>≡</Text>
        </>
      )}
      {kind === 'boots' && (
        <>
          <View style={[styles.bootShaft, { backgroundColor: color }]} />
          <View style={[styles.bootCuff, { backgroundColor: accent }]} />
          <View style={[styles.bootFoot, { backgroundColor: color }]} />
        </>
      )}
      {kind === 'sandals' && (
        <>
          <View style={[styles.sandalSole, { backgroundColor: color }]} />
          <View style={[styles.sandalStrap, { borderColor: color }]} />
          <View style={[styles.sandalFlower, { backgroundColor: accent }]} />
        </>
      )}
    </View>
  );
}

function SkirtShape({
  kind,
  color,
  accent = '#FFFFFF',
}: {
  kind: 'skirt' | 'tulle' | 'pleated' | 'dress';
  color: string;
  accent?: string;
}) {
  if (kind === 'tulle') {
    return (
      <View style={styles.skirtSvg}>
        <Svg width="160" height="105" viewBox="0 0 160 105">
          <Path d="M42 10 Q80 18 118 10 L148 83 Q120 100 80 96 Q40 100 12 83 Z" fill={color} opacity={0.28} />
          <Path d="M45 12 Q80 20 115 12 L134 76 Q124 90 110 82 Q96 97 80 85 Q64 97 50 82 Q36 90 26 76 Z" fill={color} opacity={0.78} />
          <Path d="M43 9 Q80 16 117 9 L116 23 Q80 29 44 23 Z" fill={accent} opacity={0.65} />
          <Circle cx="54" cy="48" r="3" fill={accent} opacity={0.9} />
          <Circle cx="82" cy="62" r="2.5" fill={accent} opacity={0.8} />
          <Circle cx="107" cy="43" r="3" fill={accent} opacity={0.9} />
        </Svg>
      </View>
    );
  }

  if (kind === 'pleated') {
    return (
      <View style={styles.skirtSvg}>
        <Svg width="160" height="105" viewBox="0 0 160 105">
          <Path d="M43 10 Q80 16 117 10 L140 89 Q112 99 80 95 Q48 99 20 89 Z" fill={color} />
          <Path d="M43 9 Q80 15 117 9 L116 22 Q80 27 44 22 Z" fill={accent} opacity={0.45} />
          <Path d="M56 23 L47 90 M70 25 L67 95 M90 25 L93 95 M104 23 L113 90" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity={0.42} />
        </Svg>
      </View>
    );
  }

  if (kind === 'dress') {
    return (
      <View style={styles.dressSkirtSvg}>
        <Svg width="166" height="110" viewBox="0 0 166 110">
          <Path d="M42 8 Q83 18 124 8 C130 38 143 64 154 91 Q130 106 104 98 Q83 110 62 98 Q36 106 12 91 C23 64 36 38 42 8 Z" fill={color} />
          <Path d="M42 8 Q83 17 124 8 L122 22 Q83 30 44 22 Z" fill={accent} />
          <Path d="M50 28 Q43 63 35 94 M116 28 Q123 63 131 94" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity={0.25} />
          <Circle cx="83" cy="55" r="3" fill={accent} opacity={0.75} />
        </Svg>
      </View>
    );
  }

  return (
    <View style={styles.skirtSvg}>
      <Svg width="160" height="105" viewBox="0 0 160 105">
        <Path d="M44 9 Q80 17 116 9 C120 34 128 59 138 86 Q112 101 80 95 Q48 101 22 86 C32 59 40 34 44 9 Z" fill={color} />
        <Path d="M43 8 Q80 15 117 8 L116 22 Q80 28 44 22 Z" fill={accent} opacity={0.38} />
        <Line x1="56" y1="27" x2="48" y2="88" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity={0.24} />
        <Line x1="104" y1="27" x2="112" y2="88" stroke={accent} strokeWidth="3" strokeLinecap="round" opacity={0.24} />
        <Rect x="75" y="18" width="10" height="5" rx="2.5" fill={accent} opacity={0.55} />
      </Svg>
    </View>
  );
}

function TopGarment({ item }: { item: (typeof TOPS)[number] }) {
  if (item.style === 'tank') {
    return (
      <>
        <View style={[styles.tankBody, { backgroundColor: item.color }]}>
          <Text style={styles.topDecoration}>{item.decoration}</Text>
        </View>
        <View style={[styles.tankStrapLeft, { backgroundColor: item.color }]} />
        <View style={[styles.tankStrapRight, { backgroundColor: item.color }]} />
        <View style={[styles.tankNeckline, { borderBottomColor: item.accent }]} />
      </>
    );
  }

  if (item.style === 'puff') {
    return (
      <>
        <View style={[styles.puffSleeve, styles.puffSleeveLeft, { backgroundColor: item.color }]} />
        <View style={[styles.puffSleeve, styles.puffSleeveRight, { backgroundColor: item.color }]} />
        <View style={[styles.top, { backgroundColor: item.color }]}>
          <View style={[styles.topCollar, { borderBottomColor: item.accent }]} />
          <Text style={styles.topDecoration}>{item.decoration}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={[styles.teeSleeve, styles.teeSleeveLeft, { backgroundColor: item.color }]} />
      <View style={[styles.teeSleeve, styles.teeSleeveRight, { backgroundColor: item.color }]} />
      <View style={[styles.top, { backgroundColor: item.color }]}>
        <View style={[styles.topCollar, { borderBottomColor: item.accent }]} />
        <Text style={styles.topDecoration}>{item.decoration}</Text>
      </View>
    </>
  );
}

function Bag({ item }: { item: (typeof BAGS)[number] }) {
  if (item.style === 'none') return null;

  if (item.style === 'crossbody') {
    return (
      <>
        <View style={[styles.crossbodyStrap, { backgroundColor: item.accent }]} />
        <View style={[styles.crossbodyBag, { backgroundColor: item.color }]}>
          <View style={[styles.bagClasp, { backgroundColor: item.accent }]} />
        </View>
      </>
    );
  }

  if (item.style === 'heart') {
    return (
      <>
        <View style={[styles.heartBagStrap, { borderColor: item.accent }]} />
        <View style={[styles.heartBag, { backgroundColor: item.color }]}>
          <Text style={[styles.heartBagSymbol, { color: item.accent }]}>♥</Text>
        </View>
      </>
    );
  }

  return (
    <View style={[styles.toteBag, { backgroundColor: item.color }]}>
      <View style={[styles.toteHandle, { borderColor: item.accent }]} />
      <Text style={[styles.toteDecoration, { color: item.accent }]}>✦</Text>
    </View>
  );
}

function Accessories({ selected }: { selected: AccessoryId[] }) {
  return (
    <>
      {selected.includes('glasses') && (
        <>
          <View style={[styles.glassesLens, styles.glassesLeft]} />
          <View style={[styles.glassesLens, styles.glassesRight]} />
          <View style={styles.glassesBridge} />
        </>
      )}
      {selected.includes('necklace') && (
        <>
          <View style={styles.necklaceChain} />
          <View style={styles.necklacePendant}><Text style={styles.necklaceGem}>♦</Text></View>
        </>
      )}
      {selected.includes('earrings') && (
        <>
          <View style={[styles.earring, styles.earringLeft]} />
          <View style={[styles.earring, styles.earringRight]} />
        </>
      )}
      {selected.includes('hat') && (
        <>
          <View style={styles.hatCrown} />
          <View style={styles.hatRibbon} />
          <View style={styles.hatBrim} />
        </>
      )}
      {selected.includes('headband') && (
        <>
          <View style={styles.headband} />
          <View style={[styles.headbandBow, styles.headbandBowLeft]} />
          <View style={[styles.headbandBow, styles.headbandBowRight]} />
        </>
      )}
    </>
  );
}

function Doll({
  hairStyle,
  hairColor,
  eyeColor,
  top,
  bottomStyle,
  bottomColor,
  dress,
  shoes,
  bag,
  accessories,
}: {
  hairStyle: HairStyle;
  hairColor: string;
  eyeColor: string;
  top: (typeof TOPS)[number];
  bottomStyle: BottomStyle;
  bottomColor: string;
  dress: (typeof DRESSES)[number] | null;
  shoes: (typeof SHOES)[number];
  bag: (typeof BAGS)[number];
  accessories: AccessoryId[];
}) {
  return (
    <View style={styles.dollCanvas} accessibilityLabel="La tua bambola vestita">
      <View style={styles.sparkleOne}><Text style={styles.sparkleText}>✦</Text></View>
      <View style={styles.sparkleTwo}><Text style={styles.sparkleText}>✦</Text></View>

      <Hair style={hairStyle} color={hairColor} />
      <View style={styles.earLeft} />
      <View style={styles.earRight} />
      <View style={styles.face}>
        <View style={styles.eyesRow}>
          <View style={styles.eyeWhite}><View style={[styles.iris, { backgroundColor: eyeColor }]} /></View>
          <View style={styles.eyeWhite}><View style={[styles.iris, { backgroundColor: eyeColor }]} /></View>
        </View>
        <View style={styles.nose} />
        <View style={styles.smile} />
        <View style={[styles.cheek, styles.cheekLeft]} />
        <View style={[styles.cheek, styles.cheekRight]} />
      </View>

      <View style={styles.neck} />
      <View style={[styles.arm, styles.armLeft]} />
      <View style={[styles.arm, styles.armRight]} />
      {!dress && <TopGarment item={top} />}

      {dress && (
        <>
          <View style={[styles.dressBodice, { backgroundColor: dress.color }]}>
            <View style={[styles.dressCollar, { backgroundColor: dress.accent }]} />
            <Text style={styles.dressDecoration}>{dress.decoration}</Text>
          </View>
          <SkirtShape kind="dress" color={dress.color} accent={dress.accent} />
        </>
      )}

      {!dress && bottomStyle === 'skirt' && <SkirtShape kind="skirt" color={bottomColor} />}
      {!dress && bottomStyle === 'tulle' && <SkirtShape kind="tulle" color={bottomColor} />}
      {!dress && bottomStyle === 'pleated' && <SkirtShape kind="pleated" color={bottomColor} />}
      {!dress && bottomStyle === 'shorts' && (
        <View style={styles.bottomArea}>
          <View style={[styles.shortLeg, { backgroundColor: bottomColor }]} />
          <View style={[styles.shortLeg, { backgroundColor: bottomColor }]} />
        </View>
      )}
      {!dress && bottomStyle === 'jeans' && (
        <View style={styles.jeansArea}>
          <View style={[styles.jeanLeg, { backgroundColor: bottomColor }]} />
          <View style={[styles.jeanLeg, { backgroundColor: bottomColor }]} />
        </View>
      )}

      <View style={[styles.leg, styles.legLeft, !dress && bottomStyle === 'jeans' && styles.hiddenLeg]} />
      <View style={[styles.leg, styles.legRight, !dress && bottomStyle === 'jeans' && styles.hiddenLeg]} />
      <Shoe kind={shoes.style} color={shoes.color} accent={shoes.accent} side="left" />
      <Shoe kind={shoes.style} color={shoes.color} accent={shoes.accent} side="right" />
      <Bag item={bag} />
      <Accessories selected={accessories} />
      <View style={styles.groundShadow} />
    </View>
  );
}

function ChoiceCard({
  label,
  selected,
  color,
  preview,
  onPress,
}: {
  label: string;
  selected: boolean;
  color?: string;
  preview?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Scegli ${label}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceCard,
        selected && styles.choiceCardSelected,
        pressed && styles.pressed,
      ]}
    >
      {color ? (
        <View style={[styles.colorPreview, { backgroundColor: color }]}>
          {preview ? <Text style={styles.itemPreview}>{preview}</Text> : selected && <Text style={styles.checkMark}>✓</Text>}
        </View>
      ) : (
        <Text style={styles.stylePreview}>{preview}</Text>
      )}
      <Text style={[styles.choiceLabel, selected && styles.choiceLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

export default function App() {
  const [category, setCategory] = useState<Category>('hairStyle');
  const [look, setLook] = useState<Look>(INITIAL_LOOK);

  const currentColors = useMemo(() => ({
    hair: HAIR_COLORS.find((item) => item.id === look.hairColor)?.color ?? HAIR_COLORS[0].color,
    eyes: EYE_COLORS.find((item) => item.id === look.eyes)?.color ?? EYE_COLORS[0].color,
    top: TOPS.find((item) => item.id === look.top) ?? TOPS[0],
    bottom: BOTTOMS.find((item) => item.id === look.bottom) ?? BOTTOMS[0],
    dress: DRESSES.find((item) => item.id === look.dress) ?? null,
    shoes: SHOES.find((item) => item.id === look.shoes) ?? SHOES[0],
    bag: BAGS.find((item) => item.id === look.bag) ?? BAGS[0],
  }), [look]);

  const surpriseMe = () => {
    const useDress = Math.random() > 0.55;
    const randomAccessories: AccessoryId[] = ACCESSORIES
      .filter(() => Math.random() > 0.68)
      .map((item) => item.id)
      .filter((id) => !(id === 'headband' && Math.random() > 0.5));
    setLook({
      hairStyle: pickRandom(HAIR_STYLES).id,
      hairColor: pickRandom(HAIR_COLORS).id,
      eyes: pickRandom(EYE_COLORS).id,
      top: pickRandom(TOPS).id,
      bottom: pickRandom(BOTTOMS).id,
      dress: useDress ? pickRandom(DRESSES).id : null,
      shoes: pickRandom(SHOES).id,
      bag: pickRandom(BAGS).id,
      accessories: randomAccessories.includes('hat')
        ? randomAccessories.filter((id) => id !== 'headband')
        : randomAccessories,
    });
  };

  const toggleAccessory = (id: AccessoryId) => {
    setLook((value) => {
      if (value.accessories.includes(id)) {
        return { ...value, accessories: value.accessories.filter((item) => item !== id) };
      }
      const withoutOtherHeadwear = id === 'hat'
        ? value.accessories.filter((item) => item !== 'headband')
        : id === 'headband'
          ? value.accessories.filter((item) => item !== 'hat')
          : value.accessories;
      return { ...value, accessories: [...withoutOtherHeadwear, id] };
    });
  };

  const renderChoices = () => {
    if (category === 'hairStyle') {
      const previews: Record<HairStyle, string> = { bob: '◒', ponytail: '୨୧', curls: '●●' };
      return HAIR_STYLES.map((item) => (
        <ChoiceCard key={item.id} label={item.label} preview={previews[item.id]}
          selected={look.hairStyle === item.id}
          onPress={() => setLook((value) => ({ ...value, hairStyle: item.id }))} />
      ));
    }
    if (category === 'hairColor') {
      return HAIR_COLORS.map((item) => (
        <ChoiceCard key={item.id} label={item.label} color={item.color}
          selected={look.hairColor === item.id}
          onPress={() => setLook((value) => ({ ...value, hairColor: item.id }))} />
      ));
    }
    if (category === 'eyes') {
      return EYE_COLORS.map((item) => (
        <ChoiceCard key={item.id} label={item.label} color={item.color}
          selected={look.eyes === item.id}
          onPress={() => setLook((value) => ({ ...value, eyes: item.id }))} />
      ));
    }
    if (category === 'tops') {
      return TOPS.map((item) => (
        <ChoiceCard key={item.id} label={item.label} color={item.color} preview={item.preview}
          selected={look.top === item.id && look.dress === null}
          onPress={() => setLook((value) => ({ ...value, top: item.id, dress: null }))} />
      ));
    }
    if (category === 'bottoms') {
      return BOTTOMS.map((item) => (
        <ChoiceCard key={item.id} label={item.label} color={item.color} preview={item.preview}
          selected={look.bottom === item.id && look.dress === null}
          onPress={() => setLook((value) => ({ ...value, bottom: item.id, dress: null }))} />
      ));
    }
    if (category === 'dresses') {
      return DRESSES.map((item) => (
        <ChoiceCard key={item.id} label={item.label} color={item.color} preview={item.decoration}
          selected={look.dress === item.id}
          onPress={() => setLook((value) => ({ ...value, dress: item.id }))} />
      ));
    }
    if (category === 'shoes') {
      return SHOES.map((item) => (
        <ChoiceCard key={item.id} label={item.label} color={item.color} preview={item.preview}
          selected={look.shoes === item.id}
          onPress={() => setLook((value) => ({ ...value, shoes: item.id }))} />
      ));
    }
    if (category === 'bags') {
      return BAGS.map((item) => (
        <ChoiceCard key={item.id} label={item.label} color={item.color} preview={item.preview}
          selected={look.bag === item.id}
          onPress={() => setLook((value) => ({ ...value, bag: item.id }))} />
      ));
    }
    return ACCESSORIES.map((item) => (
      <ChoiceCard key={item.id} label={item.label} color={item.color} preview={item.preview}
        selected={look.accessories.includes(item.id)}
        onPress={() => toggleAccessory(item.id)} />
    ));
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>IL MIO ARMADIO</Text>
          <Text style={styles.title}>Crea il tuo look!</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Crea un look casuale"
          onPress={surpriseMe}
          style={({ pressed }) => [styles.surpriseButton, pressed && styles.pressed]}
        >
          <Text style={styles.surpriseIcon}>✨</Text>
          <Text style={styles.surpriseText}>Sorprendimi</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator={false}>
        <View style={styles.stageCard}>
          <View style={styles.blobOne} />
          <View style={styles.blobTwo} />
          <Doll
            hairStyle={look.hairStyle}
            hairColor={currentColors.hair}
            eyeColor={currentColors.eyes}
            top={currentColors.top}
            bottomStyle={currentColors.bottom.style}
            bottomColor={currentColors.bottom.color}
            dress={currentColors.dress}
            shoes={currentColors.shoes}
            bag={currentColors.bag}
            accessories={look.accessories}
          />
        </View>

        <View style={styles.wardrobe}>
          <View style={styles.wardrobeHeader}>
            <View>
              <Text style={styles.wardrobeTitle}>Scegli e combina</Text>
              <Text style={styles.wardrobeSubtitle}>Tocca quello che ti piace</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ricomincia dal look iniziale"
              onPress={() => setLook(INITIAL_LOOK)}
              style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
            >
              <Text style={styles.resetText}>↻ Ricomincia</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {CATEGORIES.map((item) => {
              const active = category === item.id;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  onPress={() => setCategory(item.id)}
                  style={({ pressed }) => [styles.categoryButton, active && styles.categoryButtonActive, pressed && styles.pressed]}
                >
                  <Text style={styles.categoryIcon}>{item.icon}</Text>
                  <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choicesRow}>
            {renderChoices()}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETTE.cream, paddingTop: NativeStatusBar.currentHeight ?? 16 },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: PALETTE.pink, fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: PALETTE.ink, fontSize: 25, fontWeight: '900', marginTop: 2 },
  surpriseButton: { backgroundColor: PALETTE.white, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#F0E8DA' },
  surpriseIcon: { fontSize: 17, marginRight: 5 },
  surpriseText: { color: PALETTE.ink, fontWeight: '800', fontSize: 12 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  pageContent: { paddingHorizontal: 16, paddingBottom: 28 },
  stageCard: { height: 410, borderRadius: 32, backgroundColor: '#EDE8FF', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: PALETTE.white },
  blobOne: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: '#D9D0FF', top: -70, right: -55 },
  blobTwo: { position: 'absolute', width: 170, height: 170, borderRadius: 85, backgroundColor: '#FFF0B8', bottom: -75, left: -45 },
  dollCanvas: { width: 280, height: 390, position: 'relative' },
  sparkleOne: { position: 'absolute', left: 24, top: 82 },
  sparkleTwo: { position: 'absolute', right: 18, top: 155 },
  sparkleText: { color: '#B090E7', fontSize: 25 },
  face: { position: 'absolute', width: 112, height: 122, borderRadius: 58, backgroundColor: '#F3C7A7', top: 68, left: 84, zIndex: 4, alignItems: 'center' },
  earLeft: { position: 'absolute', width: 22, height: 31, borderRadius: 12, backgroundColor: '#EDBE9D', top: 111, left: 75, zIndex: 2 },
  earRight: { position: 'absolute', width: 22, height: 31, borderRadius: 12, backgroundColor: '#EDBE9D', top: 111, right: 75, zIndex: 2 },
  eyesRow: { flexDirection: 'row', gap: 25, marginTop: 45 },
  eyeWhite: { width: 21, height: 15, borderRadius: 11, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  iris: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: '#2E2942' },
  nose: { width: 5, height: 7, borderRadius: 3, backgroundColor: '#D99B83', marginTop: 8 },
  smile: { width: 25, height: 12, borderBottomWidth: 3, borderBottomColor: '#A95365', borderRadius: 14, marginTop: 4 },
  cheek: { position: 'absolute', width: 18, height: 8, borderRadius: 9, backgroundColor: '#ECA3A0', opacity: 0.55, top: 80 },
  cheekLeft: { left: 14 },
  cheekRight: { right: 14 },
  bobBack: { position: 'absolute', width: 142, height: 156, borderRadius: 65, top: 47, left: 69, zIndex: 1 },
  hairCap: { position: 'absolute', width: 118, height: 74, borderTopLeftRadius: 62, borderTopRightRadius: 62, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, top: 45, left: 81, zIndex: 5 },
  hairFringeLeft: { position: 'absolute', width: 55, height: 48, borderBottomRightRadius: 45, top: 76, left: 86, zIndex: 6, transform: [{ rotate: '-8deg' }] },
  hairFringeRight: { position: 'absolute', width: 42, height: 39, borderBottomLeftRadius: 38, top: 77, right: 88, zIndex: 6, transform: [{ rotate: '11deg' }] },
  ponytailLeft: { position: 'absolute', width: 48, height: 88, borderRadius: 28, top: 70, left: 51, zIndex: 1, transform: [{ rotate: '18deg' }] },
  ponytailRight: { position: 'absolute', width: 48, height: 88, borderRadius: 28, top: 70, right: 51, zIndex: 1, transform: [{ rotate: '-18deg' }] },
  curlBack: { position: 'absolute', width: 150, height: 166, borderRadius: 70, top: 42, left: 65, zIndex: 1 },
  curl: { position: 'absolute', width: 54, height: 54, borderRadius: 27, zIndex: 2 },
  curlOne: { left: 57, top: 75 },
  curlTwo: { left: 55, top: 119 },
  curlThree: { right: 57, top: 75 },
  curlFour: { right: 55, top: 119 },
  neck: { position: 'absolute', width: 34, height: 32, backgroundColor: '#E9B895', top: 178, left: 123, zIndex: 2 },
  arm: { position: 'absolute', width: 29, height: 122, borderRadius: 16, backgroundColor: '#F3C7A7', top: 212, zIndex: 1 },
  armLeft: { left: 66, transform: [{ rotate: '7deg' }] },
  armRight: { right: 66, transform: [{ rotate: '-7deg' }] },
  top: { position: 'absolute', width: 106, height: 112, borderTopLeftRadius: 27, borderTopRightRadius: 27, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, top: 198, left: 87, zIndex: 3, alignItems: 'center' },
  topCollar: { width: 48, height: 22, borderLeftWidth: 24, borderRightWidth: 24, borderBottomWidth: 17, borderLeftColor: 'transparent', borderRightColor: 'transparent' },
  topDecoration: { color: '#FFF8D7', fontSize: 24, marginTop: 19 },
  teeSleeve: { position: 'absolute', width: 36, height: 48, top: 202, zIndex: 3, borderRadius: 15 },
  teeSleeveLeft: { left: 70, transform: [{ rotate: '13deg' }] },
  teeSleeveRight: { right: 70, transform: [{ rotate: '-13deg' }] },
  puffSleeve: { position: 'absolute', width: 43, height: 47, top: 198, zIndex: 3, borderRadius: 23 },
  puffSleeveLeft: { left: 66 },
  puffSleeveRight: { right: 66 },
  tankBody: { position: 'absolute', width: 88, height: 110, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, top: 200, left: 96, zIndex: 3, alignItems: 'center' },
  tankStrapLeft: { position: 'absolute', width: 15, height: 31, borderRadius: 8, top: 190, left: 105, zIndex: 4 },
  tankStrapRight: { position: 'absolute', width: 15, height: 31, borderRadius: 8, top: 190, right: 105, zIndex: 4 },
  tankNeckline: { position: 'absolute', width: 45, height: 24, borderLeftWidth: 22, borderRightWidth: 22, borderBottomWidth: 15, borderLeftColor: 'transparent', borderRightColor: 'transparent', top: 199, left: 118, zIndex: 5 },
  dressBodice: { position: 'absolute', width: 108, height: 105, borderTopLeftRadius: 28, borderTopRightRadius: 28, top: 198, left: 86, zIndex: 4, alignItems: 'center' },
  dressCollar: { width: 50, height: 17, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  dressDecoration: { color: '#FFF8D7', fontSize: 24, marginTop: 19, fontWeight: '900' },
  skirtSvg: { position: 'absolute', width: 160, height: 105, top: 289, left: 60, zIndex: 4 },
  dressSkirtSvg: { position: 'absolute', width: 166, height: 110, top: 285, left: 57, zIndex: 4 },
  bottomArea: { position: 'absolute', top: 298, left: 86, width: 108, height: 70, flexDirection: 'row', gap: 6, zIndex: 4 },
  shortLeg: { flex: 1, height: 64, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  jeansArea: { position: 'absolute', top: 298, left: 88, width: 104, height: 83, flexDirection: 'row', gap: 7, zIndex: 5 },
  jeanLeg: { flex: 1, height: 83, borderBottomLeftRadius: 9, borderBottomRightRadius: 9 },
  leg: { position: 'absolute', width: 30, height: 73, borderRadius: 15, backgroundColor: '#F3C7A7', top: 315, zIndex: 2 },
  legLeft: { left: 100 },
  legRight: { right: 100 },
  hiddenLeg: { opacity: 0 },
  shoeSlot: { position: 'absolute', width: 54, height: 62, top: 328, zIndex: 6 },
  shoeSlotLeft: { left: 82 },
  shoeSlotRight: { right: 82, transform: [{ scaleX: -1 }] },
  flatFoot: { position: 'absolute', width: 49, height: 23, borderTopLeftRadius: 19, borderTopRightRadius: 19, borderBottomLeftRadius: 8, borderBottomRightRadius: 13, bottom: 0, left: 1, borderBottomWidth: 4, borderBottomColor: '#FFF' },
  shoeBowLeft: { position: 'absolute', width: 12, height: 9, borderRadius: 6, bottom: 17, left: 17, transform: [{ rotate: '24deg' }] },
  shoeBowRight: { position: 'absolute', width: 12, height: 9, borderRadius: 6, bottom: 17, left: 25, transform: [{ rotate: '-24deg' }] },
  sneakerFoot: { position: 'absolute', width: 51, height: 27, borderTopLeftRadius: 13, borderTopRightRadius: 19, borderBottomLeftRadius: 7, borderBottomRightRadius: 9, bottom: 0, left: 0 },
  sneakerSole: { position: 'absolute', width: 52, height: 6, borderRadius: 3, bottom: 0, left: 0 },
  sneakerLaces: { position: 'absolute', fontSize: 16, fontWeight: '900', bottom: 7, left: 17, transform: [{ rotate: '-8deg' }] },
  bootShaft: { position: 'absolute', width: 31, height: 45, borderTopLeftRadius: 9, borderTopRightRadius: 9, bottom: 10, left: 9 },
  bootCuff: { position: 'absolute', width: 35, height: 9, borderRadius: 5, bottom: 47, left: 7, zIndex: 2 },
  bootFoot: { position: 'absolute', width: 49, height: 20, borderTopRightRadius: 15, borderBottomLeftRadius: 7, borderBottomRightRadius: 10, bottom: 0, left: 8, borderBottomWidth: 4, borderBottomColor: '#4D417F' },
  sandalSole: { position: 'absolute', width: 49, height: 9, borderRadius: 5, bottom: 0, left: 1 },
  sandalStrap: { position: 'absolute', width: 34, height: 22, borderWidth: 6, borderBottomWidth: 0, borderTopLeftRadius: 18, borderTopRightRadius: 18, bottom: 6, left: 8 },
  sandalFlower: { position: 'absolute', width: 10, height: 10, borderRadius: 5, bottom: 20, left: 20 },
  crossbodyStrap: { position: 'absolute', width: 5, height: 178, borderRadius: 3, top: 190, left: 153, zIndex: 7, transform: [{ rotate: '-29deg' }] },
  crossbodyBag: { position: 'absolute', width: 52, height: 45, borderRadius: 15, top: 297, right: 47, zIndex: 8, borderBottomWidth: 5, borderBottomColor: 'rgba(0,0,0,0.08)', alignItems: 'center' },
  bagClasp: { width: 14, height: 8, borderRadius: 4, marginTop: 8 },
  heartBagStrap: { position: 'absolute', width: 91, height: 120, borderWidth: 4, borderBottomWidth: 0, borderRadius: 48, top: 214, right: 32, zIndex: 2, transform: [{ rotate: '-7deg' }] },
  heartBag: { position: 'absolute', width: 52, height: 48, borderRadius: 20, top: 300, right: 39, zIndex: 8, alignItems: 'center', justifyContent: 'center' },
  heartBagSymbol: { fontSize: 24, fontWeight: '900' },
  toteBag: { position: 'absolute', width: 57, height: 54, borderRadius: 12, top: 286, left: 34, zIndex: 8, alignItems: 'center', justifyContent: 'center' },
  toteHandle: { position: 'absolute', width: 34, height: 27, borderWidth: 5, borderBottomWidth: 0, borderTopLeftRadius: 18, borderTopRightRadius: 18, top: -20, left: 11 },
  toteDecoration: { fontSize: 22, fontWeight: '900' },
  glassesLens: { position: 'absolute', width: 34, height: 27, borderRadius: 13, borderWidth: 4, borderColor: '#D65B88', top: 108, zIndex: 10, backgroundColor: 'rgba(255,210,225,0.16)' },
  glassesLeft: { left: 97 },
  glassesRight: { right: 97 },
  glassesBridge: { position: 'absolute', width: 15, height: 4, borderRadius: 2, backgroundColor: '#D65B88', top: 119, left: 133, zIndex: 10 },
  necklaceChain: { position: 'absolute', width: 54, height: 34, borderWidth: 3, borderTopWidth: 0, borderColor: '#F0B53A', borderBottomLeftRadius: 28, borderBottomRightRadius: 28, top: 184, left: 113, zIndex: 9 },
  necklacePendant: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFF3BE', top: 208, left: 131, zIndex: 10, alignItems: 'center', justifyContent: 'center' },
  necklaceGem: { color: '#E5A52D', fontSize: 11, fontWeight: '900' },
  earring: { position: 'absolute', width: 11, height: 15, borderRadius: 6, backgroundColor: '#69A9D2', top: 137, zIndex: 10, borderBottomWidth: 4, borderBottomColor: '#D5F1FF' },
  earringLeft: { left: 79 },
  earringRight: { right: 79 },
  hatCrown: { position: 'absolute', width: 112, height: 54, borderTopLeftRadius: 56, borderTopRightRadius: 56, backgroundColor: '#A275DB', top: 14, left: 84, zIndex: 11 },
  hatRibbon: { position: 'absolute', width: 115, height: 12, borderRadius: 6, backgroundColor: '#F3D7FF', top: 56, left: 82, zIndex: 12 },
  hatBrim: { position: 'absolute', width: 156, height: 18, borderRadius: 10, backgroundColor: '#8A5FC8', top: 63, left: 62, zIndex: 11 },
  headband: { position: 'absolute', width: 102, height: 60, borderWidth: 7, borderBottomWidth: 0, borderColor: '#F06D8F', borderTopLeftRadius: 52, borderTopRightRadius: 52, top: 47, left: 89, zIndex: 10 },
  headbandBow: { position: 'absolute', width: 24, height: 18, borderRadius: 10, backgroundColor: '#FF9DB5', top: 53, zIndex: 12 },
  headbandBowLeft: { left: 91, transform: [{ rotate: '20deg' }] },
  headbandBowRight: { left: 107, transform: [{ rotate: '-20deg' }] },
  groundShadow: { position: 'absolute', width: 162, height: 18, borderRadius: 80, backgroundColor: '#B9ADD8', opacity: 0.35, bottom: -7, left: 59, zIndex: 0 },
  wardrobe: { marginTop: 14, backgroundColor: PALETTE.white, borderRadius: 28, paddingVertical: 18, borderWidth: 2, borderColor: '#F3EBDD' },
  wardrobeHeader: { paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wardrobeTitle: { color: PALETTE.ink, fontSize: 20, fontWeight: '900' },
  wardrobeSubtitle: { color: PALETTE.muted, fontSize: 12, marginTop: 2 },
  resetButton: { paddingHorizontal: 11, paddingVertical: 8, backgroundColor: '#F7F3FF', borderRadius: 13 },
  resetText: { color: PALETTE.lavender, fontSize: 12, fontWeight: '800' },
  categoryRow: { paddingHorizontal: 14, paddingVertical: 14, gap: 8 },
  categoryButton: { minWidth: 69, paddingHorizontal: 11, paddingVertical: 9, borderRadius: 16, backgroundColor: '#FAF7F2', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  categoryButtonActive: { backgroundColor: '#F2EEFF', borderColor: '#9A87EA' },
  categoryIcon: { fontSize: 20 },
  categoryLabel: { color: PALETTE.muted, fontSize: 11, fontWeight: '700', marginTop: 3 },
  categoryLabelActive: { color: '#6956BE', fontWeight: '900' },
  choicesRow: { paddingHorizontal: 14, paddingBottom: 2, gap: 10 },
  choiceCard: { width: 86, height: 102, borderRadius: 20, backgroundColor: '#FAF8F4', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#F1ECE3' },
  choiceCardSelected: { backgroundColor: '#F4F0FF', borderColor: PALETTE.lavender },
  colorPreview: { width: 47, height: 47, borderRadius: 24, borderWidth: 4, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#FFF', fontWeight: '900', fontSize: 21, textShadowColor: 'rgba(0,0,0,0.18)', textShadowRadius: 3 },
  itemPreview: { color: '#FFF', fontWeight: '900', fontSize: 22, textShadowColor: 'rgba(0,0,0,0.18)', textShadowRadius: 3 },
  stylePreview: { color: PALETTE.ink, fontSize: 28, fontWeight: '900', height: 48, textAlignVertical: 'center' },
  choiceLabel: { color: PALETTE.muted, fontSize: 11, fontWeight: '700', marginTop: 7 },
  choiceLabelSelected: { color: '#6956BE', fontWeight: '900' },
});
