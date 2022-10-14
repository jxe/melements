import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { isWhat } from '../emotions';
import { BoldedList } from "./BoldedList";
import { Button } from './Button';
import { Checkbox, CheckboxLabel } from './Checkbox';
import { EmotionSingleSelect } from "./EmotionSelect";
import { IconButton } from "./IconButton";
import * as Multipane from "./Multipane";

// TODO
// - Feeler should be its own route
// - emotions colored
// - "say more" button at the bottom goes to a second page which says "What connect is far away?" and lets you enter freeform and post, or make a values card
// emotions should start at 1, not 0


function EmotionCounter({ emotion, updated }: { emotion: string, updated: (emotion: string, count: number) => void }) {
  const [count, setCount] = useState(0);
  return <button
    className='p-2 flex items-center justify-center rounded-sm border border-gray-300 active:bg-gray-100'
    onClick={() => {
      setCount(count + 1)
      updated(emotion, count + 1)
    }}
  >
    <div className='flex-auto text-left'>{emotion}</div>
    <span className='text-slate-400'>{count}</span>
  </button>
}

export function Feeler() {
  const [emotionCounts, setEmotionCounts] = useState<{ [emotion: string]: number }>({});
  const [activePane, setActivePane] = useState('feeler')
  const [feelings, setFeelings] = useState<string[]>([])
  const [elapsed, setElapsed] = useState(0)
  const onCancel = () => null
  const onPost = () => null
  function updateEmotionCount(emotion: string, count: number) {
    setEmotionCounts({ ...emotionCounts, [emotion]: count })
  }

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
  const feelingsOrdered = feelings.sort((a, b) => (emotionCounts[b] || 0) - (emotionCounts[a] || 0))

  return (
    <Multipane.Root active={activePane}>
      <Multipane.Pane id="feeler">
        <Multipane.Top
          lButton={
            <IconButton tabIndex={-1} variant="ghost" onClick={onCancel}>
              <Cross1Icon />
            </IconButton>
          }
          rButton={
            <Button tabIndex={-1} onClick={onPost}>
              Post
            </Button>
          }
        >
          {minutes} min
        </Multipane.Top>

        <Multipane.PaneBody>
          <div className='grid grid-cols-3 gap-2 flex-auto content-start items-baseline p-1'>
            {feelingsOrdered.map(f => <EmotionCounter
              key={f}
              emotion={f}
              updated={updateEmotionCount}
            />)}
            <EmotionSingleSelect onSelected={f => setFeelings([...feelings, f])}>
              <IconButton variant="ghost">
                <PlusIcon />
              </IconButton>
            </EmotionSingleSelect>
          </div>

          {
            feelings.length > 0 &&

            <div className='m-1 p-2 rounded-sm border-slate-400 border-solid border'>
              <div className='text-center'>
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
