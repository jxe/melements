export const whatWayOfLivingIs: Record<string, string[]> = {
  angry: ['blocked'],
  afraid: ['threatened'],
  ashamed: ['neglected'],
  confused: ['out of focus'],
  hopeless: ['out of reach'],
  sad: ['far away'],
  numb: ['impossible'],
  disgust: ['violated'],

  //
  alive: ['happening'],
  impressed: ['suprising you'],
  happy: ['secured'],
  peaceful: ['safe'],
  positive: ['in the cards'],
  warm: ['supported'],
  loving: ['worth honoring'],
}

export const feels = {
  negative: {
    sad: [
      "alienated",
      "anguished",
      "apathetic",
      "bereaved",
      "bitter",
      "cranky",
      "dejected",
      "depleted",
      "depressed",
      "despondent",
      "devastated",
      "disappointed",
      "discouraged",
      "disheartened",
      "empty",
      "exhausted",
      "forlorn",
      "fragile",
      "gloomy",
      "grief",
      "heartbroken",
      "hopeless",
      "hurt",
      "lonely",
      "longing",
      "melancholy",
      "pained",
      "regretful",
      "remorseful",
      "sad",
      "sorry",
      "weary",
      "wistful",
      "worn out",
      "yearning",
    ],
    afraid: [
      "afraid",
      "alarmed",
      "anxious",
      "apprehensive",
      "bewildered",
      "disoriented",
      "distressed",
      "dread",
      "frightened",
      "guarded",
      "helpless",
      "hesitant",
      "horrified",
      "insecure",
      "mistrustful",
      "nervous",
      "overwhelmed",
      "panicked",
      "petrified",
      "scared",
      "shaky",
      "stressed",
      "suspicious",
      "terrified",
      "unsettled",
      "wary",
      "worried",
    ],
    ashamed: [
      "appalled",
      "ashamed",
      "disgusted",
      "disgusted",
      "embarrassed",
      "envious",
      "guilty",
      "humiliated",
      "jealous",
      "regretful",
      "repulsed",
      "self-conscious",
      "sorry",
    ],
    angry: [
      "aggravated",
      "angry",
      "annoyed",
      "bitter",
      "disgusted",
      "enraged",
      "exasperated",
      "frustrated",
      "furious",
      "hate",
      "hostile",
      "impatient",
      "incensed",
      "indignant",
      "irate",
      "irked",
      "irritated",
      "outraged",
      "repulsed",
      "resentful",
    ],
    confused: [
      "ambivalent",
      "anxious",
      "baffled",
      "bewildered",
      "confused",
      "disconcerted",
      "disoriented",
      "disquiet",
      "distressed",
      "fidgety",
      "flustered",
      "frazzled",
      "helpless",
      "lost",
      "overwhelmed",
      "perplexed",
      "perturbed",
      "rattled",
      "shocked",
      "torn",
      "uneasy",
      "unnerved",
      "unsettled",
    ],
    dead: [
      "beat",
      "bored",
      "burnt out",
      "despair",
      "detached",
      "disconnected",
      "dismayed",
      "distant",
      "distracted",
      "exhausted",
      "fatigue",
      "indifferent",
      "lethargic",
      "numb",
      "tense",
      "tired",
      "uncomfortable",
      "uninterested",
      "withdrawn",
    ],
  },
  positive: {
    loving: [
      "affectionate",
      "appreciative",
      "ardent",
      "compassionate",
      "grateful",
      "loving",
      "open hearted",
      "radiant",
      "sympathetic",
      "thankful",
      "touched",
      "warm",
    ],
    strong: [
      "capable",
      "clear headed",
      "confident",
      "determined",
      "empowered",
      "moved",
      "passionate",
      "proud",
      "restored",
      "revived",
      "vibrant",
    ],
    excited: [
      "alert",
      "amazed",
      "amused",
      "animated",
      "aroused",
      "astonished",
      "awed",
      "dazzled",
      "energetic",
      "engaged",
      "engrossed",
      "enlivened",
      "excited",
      "exhilarated",
      "exuberant",
      "invigorated",
    ],
    impressed: [
      "curious",
      "eager",
      "enchanted",
      "encouraged",
      "fascinated",
      "inspired",
      "interested",
      "intrigued",
      "involved",
      "mystified",
      "surprised",
      "thrilled",
      "tickled",
      "wonder",
    ],
    happy: [
      "blissful",
      "delighted",
      "ecstatic",
      "elated",
      "enthralled",
      "enthusiastic",
      "fulfilled",
      "giddy",
      "glad",
      "happy",
      "joyful",
      "jubilant",
      "lively",
      "pleased",
      "rapturous",
      "satisfied",
      "hopeful",
      "optimistic",
    ],
    peaceful: [
      "calm",
      "centered",
      "comfortable",
      "content",
      "equanimous",
      "mellow",
      "open",
      "peaceful",
      "quiet",
      "refreshed",
      "rejuvenated",
      "relaxed",
      "relieved",
      "renewed",
      "rested",
      "safe",
      "secure",
      "serene",
      "still",
      "tranquil",
      "trusting",
    ],
  }
}

type NegParent = keyof typeof feels.negative
type PosParent = keyof typeof feels.positive
export const parentFeeling = {} as { [s: string]: string }
(Object.keys(feels.negative) as NegParent[]).forEach(
  (key: NegParent) => {
    feels.negative[key].forEach(feeling => parentFeeling[feeling] = key)
  }
);
(Object.keys(feels.positive) as PosParent[]).forEach(
  (key: PosParent) => {
    feels.positive[key].forEach(feeling => parentFeeling[feeling] = key)
  }
);

export function isWhat(feelings: string[]) {
  const questions = [] as string[]
  feelings.forEach(feeling => {
    const match: string[] = whatWayOfLivingIs[feeling] || whatWayOfLivingIs[parentFeeling[feeling]]
    // console.log("match", match)
    if (match) questions.push(...match)
  })
  return questions.filter((value, index, self) => self.indexOf(value) === index)
}

export function areNegative(feelings: string[]) {
  const parent = parentFeeling[feelings[0]]
  if (parent in feels.negative) return true
  return false
}

const colors = {
  sad: "#4338ca",

  lonely: "#155e75",
  heartbroken: "#155e75",
  bitter: "#155e75",

  regretful: "#7c2d12",

  afraid: "#d97706",
  ashamed: "#4d7c0f",
  angry: "#86198f",
  confused: "#047857",
  dead: "#292524",
  exhausted: "#404040",

  loving: "#fecdd3",
  strong: "#fdba74",
  excited: "#ffc107",
  impressed: "#ccfbf1",
  happy: "#a5f3fc",
  peaceful: "#ecfccb",
} as { [s: string]: string }

export function color(feeling: string): string {
  return colors[feeling] || colors[parentFeeling[feeling]]
}
