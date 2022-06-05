import { TagsField } from "./TagsFields";
import { SheetedField } from './SheetedField';
import { CheckboxTree } from "./Checkbox";
import { isWhat } from "../emotions";
import { BoldedList } from "./BoldedList";
import { wobs as wobOptions } from "../wobs";
import type { Topic } from "./DraftPolicyCard";

function WobPrompt({ topic }: { topic: Topic }) {
  if (topic.type === 'emotions') return <>
    is <BoldedList or words={isWhat(topic.feelings)} />
  </>
  else return <>
    is present
  </>
}

export function QualitiesSelect({ topic, lifeGets, setLifeGets }: {
  topic: Topic,
  lifeGets: string[],
  setLifeGets: (x: string[]) => void
}) {
  return (
    <SheetedField
      sheetContent={
        <CheckboxTree
          options={wobOptions}
          value={lifeGets}
          rootLabels={{
            "connected": <span>A kind of <b>connection</b> <WobPrompt topic={topic} /></span>,
            "exploring": <span>A kind of <b>exploration</b> <WobPrompt topic={topic} /></span>,
            "strong": <span>A kind of <b>strength</b> <WobPrompt topic={topic} /></span>
          }}
          onChange={setLifeGets}
        />
      }
    >
      <TagsField
        tagVariant='lifeGets'
        placeholder='Add qualities'
        tags={lifeGets}
      />
    </SheetedField>
  )
}