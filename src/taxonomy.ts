export const whatWayOfLivingIs: Record<string, string[]> = {
  angry: ['blocked'],
  afraid: ['threatened'],
  ashamed: ['neglected'],
  confused: ['out of touch'],
  hopeless: ['out of reach'],
  sad: ['far away'],
  numb: ['impossible'],
  alive: ['happening'],
  impressed: ['suprising you'],
  happy: ['secured'],
  peaceful: ['safe'],
  positive: ['in the cards'],
  warm: ['supported']
}

export const feels = {
  negative: {
    angry: [
      "aggravated",
      "angry",
      "annoyed",
      "bitter",
      // "contempt",
      // "disgruntled",
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
      // "upset",
    ],
    afraid: [
      "afraid",
      // "agitated",
      "alarmed",
      "apprehensive",
      // "disturbed",
      "dread",
      // "foreboding",
      "frightened",
      "guarded",
      "hesitant",
      "horrified",
      "insecure",
      // "leery",
      "mistrustful",
      // "mortified",
      "nervous",
      "panicked",
      "petrified",
      "scared",
      "shaky",
      "suspicious",
      "terrified",
      // "troubled",
      "wary",
      "worried",
    ],
    ashamed: [
      "appalled",
      "ashamed",
      "embarrassed",
      "envious",
      "guilty",
      "jealous",
      "self-conscious",
    ],
    confused: [
      "ambivalent",
      "anxious",
      "baffled",
      "bewildered",
      "confused",
      // "discombobulated",
      "disconcerted",
      "distressed",
      "disquiet",
      "flustered",
      "frazzled",
      "helpless",
      "overwhelmed",
      "perplexed",
      "perturbed",
      "rattled",
      "torn",
      "unnerved",
      "unsettled",
    ],
    hopeless: [
      "alienated",
      "despair",
      "despondent",
      "devastated",
      "discouraged",
      "disheartened",
      "dismayed",
      "hopeless",
    ],
    sad: [
      "anguished",
      "bereaved",
      "bitter",
      "dejected",
      "disappointed",
      "forlorn",
      "fragile",
      "grief",
      "gloomy",
      "heartbroken",
      // "heavy hearted",
      "hurt",
      "lonely",
      "longing",
      "melancholy",
      "pained",
      // "pining",
      "regretful",
      "remorseful",
      "sad",
      "wistful",
      // "wretched",
      "yearning"
    ],
    numb: [
      "apathetic",
      "beat",
      "bored",
      "burnt out",
      "cranky",
      "depleted",
      "depressed",
      "detached",
      "disconnected",
      "distant",
      "distracted",
      "exhausted",
      "fatigue",
      "fidgety",
      "indifferent",
      "lethargic",
      // "listless",
      "lost",
      "numb",
      "shocked",
      "stressed",
      "tense",
      "tired",
      "uncomfortable",
      "uneasy",
      "uninterested",
      "weary",
      "withdrawn",
      "worn out",
    ],
  },
  positive: {
    alive: [
      "alert",
      "aroused",
      "animated",
      "confident",
      "curious",
      "eager",
      "energetic",
      "engaged",
      "engrossed",
      "enlivened",
      "excited",
      "exhilarated",
      "exuberant",
      "inspired",
      "interested",
      "intrigued",
      "invigorated",
      "involved",
      "moved",
      "passionate",
      "radiant",
      "restored",
      "revived",
      "vibrant",
    ],
    impressed: [
      "amazed",
      "amused",
      "astonished",
      "awed",
      "dazzled",
      "enchanted",
      "encouraged",
      "fascinated",
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
    positive: [
      "clear headed",
      "capable",
      "empowered",
      "hopeful",
      "optimistic",
      "proud",
    ],
    warm: [
      "affectionate",
      "appreciative",
      "ardent",
      "compassionate",
      "grateful",
      "loving",
      "open hearted",
      "sympathetic",
      "thankful",
      "touched",
      "warm",
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
    questions.push(...match)
  })
  return questions.filter((value, index, self) => self.indexOf(value) === index)
}

export const attendables = {
  internal: [
    'curiosities',
    'cravings',
    'desires',
    'emotions',
    'fears',
    'feelings',
    'frustrations',
    'hopes',
    'ideas',
    'intuitions',
    'needs',
    'observations',
    'reactions',
    'sensations',
    'thoughts',
    'wishes',
  ],
  external: [
    "colleagues",
    "companions",
    "friends",
    "ongoing relationships",
    "partners",
    "people",
    "places",
    "social events",
    "social situations",
    "workplaces",
  ],
  actions: [
    "artistic moves",
    "day plans",
    "experiences",
    "fantasies",
    "goals",
    "habits",
    "meeting frames",
    "personas",
    "plans",
    "possibilities",
    "projects",
    "reactions",
    "routines",
    "social interactions",
    "work plans",
    "work routines",
  ]
}
// "moments",
// "knowledge",


export const wobs = {
  social: [
    'caring',
    'compassionate',
    'connected',
    'diplomatic',
    'empathetic',
    'generous',
    'honest',
    'humble',
    'kind',
    'loving',
    'open',
    'responsible',
    'sincere',
    'sociable',
    'vulnerable',
    'warm',
  ],
  physical: [
    'active',
    'agile',
    'alert',
    'athletic',
    'awake',
    'calm',
    'comfortable',
    'confident',
    'energetic',
    'focused',
    'healthy',
    'sensitive'
  ],
  outward: [
    'adaptable',
    'ambitious',
    'attentive',
    'bold',
    'brave',
    'confident',
    'courageous',
    'creative',
    'curious',
    'daring',
    'decisive',
    'dynamic',
    'enthusiastic',
    'focused',
    'imaginative',
    'inspired',
    'inventive',
    'optimistic',
    'practical',
    'pro-active',
    'resourceful',
    'self-directed',
    'unpredictable',
  ],
  inward: [
    'balanced',
    'clear headed',
    'confident',
    'grateful',
    'grounded',
    'hopeful',
    'insightful',
    'intuitive',
    'open',
    'patient',
    'perceptive',
    'serious',
    'stable',
    'strong',
    'thoughtful',
    'wise',
  ]
}
