export interface Policy {
  name: string,
  type: 'directed' | 'exploratory',  // investigative?
  lookFor: { terms: string[], qualifier: string }[],
  lifeGets: string[],
}
export interface Value extends Policy { type: 'exploratory' }
export interface Directive extends Policy { type: 'directed' }

export interface Feeling {
  feelings: string[],
  value: Value,
}

// values are not for the purpose of getting to the good life, but for living there.
// values are adopted due to constitutive thinking, rather than instrumental thinking.
