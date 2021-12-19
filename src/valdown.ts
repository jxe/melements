export default null

// const TITLE_RX = /^([^\#]+)(\s+(((\#[\w-]+)\s*)+))?$/
// const ATTENDABLE_RX = /^\s*-\s*\[([\w, ]+)\]\s+(.*)$/

// export function parseValdown(text: string): Val {
//   if (text[0] === '[') return parseOldValdown(text)
//   const lines = text.split("\n")
//   const firstLine = lines.shift()?.match(TITLE_RX)
//   if (!firstLine) throw new Error("Unrecognized valdown: " + text)
//   // it's a new one
//   const title = firstLine[1]!
//   const tags = firstLine[3] ? firstLine[3].split(/\s+/).map(s => s.slice(1)) : []
//   const attendables: { types: string[], specifier: string }[] = []
//   lines.forEach((l, idx) => {
//     const m = l.match(ATTENDABLE_RX)
//     if (m) {
//       const [_, types, specifier] = m
//       attendables.push({ types: types!.split(/\s*,\s*/), specifier: specifier! })
//     }
//   })
//   return { title, tags, attendables }
// }

// export function parseOldValdown(text: string): Val {
//   const lines = text.split("\n")
//   const [_, noun, def] = lines.shift()!.match(/^\[(.+?)\]: (.+?)$/)!
//   const tagLines: string[] = []
//   const childLines: string[] = []
//   lines.forEach(l => {
//     if (l.match(/^-/)) childLines.push(l)
//     else if (l.match(/^#/)) tagLines.push(l)
//   })
//   const [__, parentText] = def!.match(/\[(.*?)\]/)!
//   const parents = parentText!.split(', ').map(x => pluralize(x))

//   const tags = [...tagLines.join(' ').matchAll(/#[A-Za-z-]+/g)].map(x => x[0]!.slice(1))
//   console.log('tags', tags)

//   const attendables = childLines.flatMap((line, idx) => {
//     const match = line.match(/^- \[(.*)\] (.*)$/)
//     if (!match) return []
//     const [_, attendableText, specifier] = match
//     return [{
//       types: attendableText!.split(', '),
//       specifier: specifier!,
//     }]
//   }).filter(Boolean)

//   return {
//     title: noun!,
//     tags,
//     attendables: [{
//       types: parents,
//       specifier: def!.split('] ')[1]!
//     }, ...attendables]
//   };
// }
