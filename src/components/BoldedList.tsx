export function BoldedList({ or = false, words }: { or?: boolean, words: string[] }) {
  const conjunction = or ? "or" : "and"
  const bolded = words.map(x => <b key={x}>{x}</b>)
  if (words.length < 2) return bolded[0]!
  const tail = bolded.pop()
  if (words.length === 2) return <>{bolded[0]} {conjunction} {tail}</>
  else return <>{bolded.reduce((prev, curr) => <>{prev}, {curr}</>)}, {conjunction} {tail}</>
}
