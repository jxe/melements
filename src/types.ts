export interface Policy {
  name: string,
  uuid?: string,
  type: 'directed' | 'exploratory',  // investigative?
  lookFor: { terms: string[], qualifier: string }[],
  lifeGets: string[],
}
export interface Value extends Policy { type: 'exploratory' }
export interface Directive extends Policy { type: 'directed' }

export interface Annotations {
  [tag: string]: string
}

export interface ValueDraft {
  name: string,
  annotations: Annotations,
  lifeGets: string[],
}

export function valueDraftToPolicy(valueDraft: ValueDraft): Value {
  return {
    name: valueDraft.name,
    type: 'exploratory',
    lookFor: Object.keys(valueDraft.annotations).map(tag => ({
      terms: [tag],
      qualifier: valueDraft.annotations[tag]
    })),
    lifeGets: valueDraft.lifeGets,
  }
}

export interface Location {
  accuracy: number;
  heading: number | null;
  latitude: number;
  longitude: number;
}

export type Setter<X> = (cb: (x: X) => X) => void

export interface Appreciation {
  feelings: string[],
  value: Value,
  location?: Location,
  imageUrl?: string,
}

export interface User {
  name: string
  img?: string
}

interface NewsEvent {
  users: User[],
  date: Date,
  visibility: 'public' | 'onlyme'
  imageUrl?: string
  location?: Location
}

export interface FeelingNewsEvent extends NewsEvent {
  eventType: 'feeling',
  feelings: string[],
}

export interface NewsItem {
  policy: Policy,
  events: (FeelingNewsEvent)[]
}

export interface List {
  uuid: string,
  name: string,
  _count: {
    values: number
  }
}

export type Filter = { listUuid: string } | { feelings: 'all' | 'mine' }


// values are not for the purpose of getting to the good life, but for living there.
// values are adopted due to constitutive thinking, rather than instrumental thinking.
