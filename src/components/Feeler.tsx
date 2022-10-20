import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { isWhat } from '../emotions';
import { BoldedList } from "./BoldedList";
import { Checkbox, CheckboxLabel } from './Checkbox';
import { EmotionSingleSelect } from "./EmotionSelect";
import { IconButton } from "./IconButton";
import * as Multipane from "./Multipane";
import { useAutoAnimate } from '@formkit/auto-animate/react'

// TODO
// - "say more" button at the bottom goes to a second page which says "What connect is far away?" and lets you enter freeform and post, or make a values card
// - start with scrollable box of basic feelings
// - long-tap or force-touch to pick a more specific feeling

// LATER
// - Feeler should be its own route
// - emotions colored

// function AnimatedList() {
//   const [items, setItems] = useState(['a', 'b', 'c'])
//   const [parent] = useAutoAnimate<HTMLDivElement>()
//   return <div ref={parent} className='grid grid-cols-3 gap-2 flex-auto content-start items-baseline p-1'>
//     {items.map((item, i) => <button
//       key={item}
//       className='p-2 flex items-center justify-center rounded-sm bg-gray-100 active:bg-gray-200'
//     >{item}</button>)}
//     <button onClick={() => setItems([...items, 'd'])}>Add</button>
//   </div>
// }

function FeelBox({ emotionCounts, add, incr }: {
  emotionCounts: { [emotion: string]: number },
  add: (emotion: string) => void,
  incr: MouseEventHandler<HTMLButtonElement>,
}) {
  const [parent] = useAutoAnimate<HTMLDivElement>()
  const feelings = Object.keys(emotionCounts).sort((a, b) => (emotionCounts[b] || 0) - (emotionCounts[a] || 0))
  return <div ref={parent} className='grid grid-cols-3 gap-2 flex-auto content-start items-baseline p-1'>
    {feelings.map(f => (
      <button
        key={f}
        id={f}
        className='p-2 flex items-center justify-center rounded-sm bg-gray-100 active:bg-gray-200'
        onClick={incr}
      >
        <span className='flex-auto text-left'>{f}</span>
        <span className='text-blue-400'>{emotionCounts[f]}</span>
      </button>
    ))}
    <EmotionSingleSelect key="last" onSelected={add}>
      <IconButton variant="ghost" className='justify-self-center'>
        <PlusIcon />
      </IconButton>
    </EmotionSingleSelect>
  </div>
}

export function Feeler() {
  const [emotionCounts, setEmotionCounts] = useState<{ [emotion: string]: number }>({});
  const [activePane, setActivePane] = useState('feeler')
  const [elapsed, setElapsed] = useState(0)

  const feelings = Object.keys(emotionCounts).sort((a, b) => (emotionCounts[b] || 0) - (emotionCounts[a] || 0))
  const incr: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    const emotion = event.currentTarget.id;
    setEmotionCounts(emotionCounts => ({ ...emotionCounts, [emotion]: (emotionCounts[emotion] || 0) + 1 }))
  }, [])
  const add = useCallback((f: string) => {
    setEmotionCounts(counts => ({ ...counts, [f]: 1 }))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(elapsed => elapsed + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const roughMinutes = elapsed / 60
  const minutes = Math.round(roughMinutes * 10) / 10

  const isWhatWords: { [word: string]: number } = {}
  for (const feeling of feelings) {
    for (const word of isWhat([feeling])) {
      if (!isWhatWords[word]) {
        isWhatWords[word] = 0
      }
      isWhatWords[word] += emotionCounts[feeling] || 0
    }
  }
  const isWhatWordsOrdered = Object.keys(isWhatWords).sort((a, b) => isWhatWords[b] - isWhatWords[a])

  return (
    <Multipane.Root active={activePane}>
      <Multipane.Pane id="feeler">
        <Multipane.Top>
          {minutes} min
        </Multipane.Top>

        <Multipane.PaneBody>
          {/* <AnimatedList /> */}

          <FeelBox emotionCounts={emotionCounts} add={add} incr={incr} />
          {
            feelings.length > 0 &&

            <div className='m-2 p-2 py-4 rounded-sm bg-slate-100'>
              <div className='text-center mb-3'>
                What is <BoldedList or words={isWhatWordsOrdered.slice(0, 3)} />?
              </div>
              <div className='grid grid-cols-3 gap-2'>
                {['strength', 'connection', 'exploration'].map(x => (
                  <CheckboxLabel key={x} htmlFor={x}>
                    <Checkbox id={x} />
                    {x}
                  </CheckboxLabel>
                ))}
              </div>
            </div>
          }
        </Multipane.PaneBody>
      </Multipane.Pane>
    </Multipane.Root>
  )
}
