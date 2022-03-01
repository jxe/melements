export function BoldedList({ conjunction = "and", words }: { conjunction?: string, words: string[] }) {
  const bolded = words.map(x => <b key={x}>{x}</b>)
  if (words.length < 2) return bolded[0]!
  const tail = bolded.pop()
  return <>{bolded.reduce((prev, curr) => <>{prev}, {curr}</>)}, {conjunction} {tail}</>
}
