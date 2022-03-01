export interface Policy {
  name: string,
  type: 'directed' | 'exploratory',  // investigative?
  lookFor: { terms: string[], qualifier: string }[],
  lifeGets: string[],
}
export interface Value extends Policy { type: 'exploratory' }
export interface Directive extends Policy { type: 'directed' }

export interface Feeling {
  date: string,
  feelings: string[],
  value: Value,
  visibility: 'public' | 'onlyme'
}

interface User {
  name: string
  img: string
}

interface NewsEvent {
  eventType: string
  users: User[],
  date: string,
  visibility: 'public' | 'onlyme'
}

export interface FeelingNewsEvent extends NewsEvent {
  eventType: 'feeling',
  feelings: string[],
}

export interface NewsItem {
  policy: Policy,
  events: NewsEvent[]
}

// values are not for the purpose of getting to the good life, but for living there.
// values are adopted due to constitutive thinking, rather than instrumental thinking.
