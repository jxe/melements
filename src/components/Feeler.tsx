import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { isWhat } from '../emotions';
import { BoldedList } from "./BoldedList";
import { Button } from './Button';
import { Checkbox, CheckboxLabel } from './Checkbox';
import { EmotionSelect } from "./EmotionSelect";
import { IconButton } from "./IconButton";
import * as Multipane from "./Multipane";

// TODO
// - put the question words at the bottom
// - make onCancel work
// - sort questio words by emotion counts
// - checkboxes for connection, exploration, strength


function EmotionCounter({ emotion }: { emotion: string }) {
  const [count, setCount] = useState(0);
  return <div
    className='p-2'
    onClick={() => setCount(count + 1)}
  >
    {emotion} <span className='text-gray-500'>{count}</span>
  </div>
}

export function Feeler() {
  const [activePane, setActivePane] = useState('feeler')
  const [feelings, setFeelings] = useState<string[]>([])
  const [elapsed, setElapsed] = useState(0)
  const onCancel = () => null
  const onPost = () => null

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(elapsed => elapsed + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const roughMinutes = elapsed / 60
  const minutes = Math.round(roughMinutes * 10) / 10

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
          <EmotionSelect
            variant='inset'
            feelings={feelings}
            onFeelingsChanged={setFeelings}
          />
          <div className='grid grid-cols-3 gap-2 flex-auto content-start'>
            {feelings.map(f => <EmotionCounter emotion={f} />)}
          </div>
          <div className='text-center'>
            <BoldedList or words={isWhat(feelings)} />
          </div>
        </Multipane.PaneBody>
        <div className='grid grid-cols-3 gap-2'>
          {['strength', 'connection', 'exploration'].map(x => (
            <CheckboxLabel key={x} htmlFor={x}>
              <Checkbox id={x} />
              {x}
            </CheckboxLabel>
          ))}
        </div>
      </Multipane.Pane>
    </Multipane.Root>
  )
}
