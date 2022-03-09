import { Cross1Icon, TriangleUpIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { styled } from "../stitches.config";
import { feels, isWhat } from "../emotions";
import { attendables as attendablesOptions } from "../attendables"
import { wobs as wobOptions } from "../wobs"
import { Feeling, Value } from "../types";
import { Button } from "./Button";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";
import { AnnotatedTagsField, TagsField } from "./TagsFields";
import { BoldedList } from "./BoldedList";
import { Checkbox, CheckboxLabel } from "./Checkbox";
import { PolicyCard } from "./PolicyCard";
import { IconButton } from "./IconButton";

const ButtonRow = styled("div", {
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
})

const CardHeading = styled("div", {
  textTransform: "uppercase",
  fontSize: "$2",
  fontWeight: "500",
  // marginRight: "8px",
  color: "$gray11",
  textAlign: "center"
})

const Hint = styled("div", {
  fontSize: "$3",
  color: "$gray11",
  padding: "8px 8px 0px",
})

const Card = styled("div", {
  // border: "solid 1px #888",
  backgroundColor: "#ddd",
  padding: "0px 8px 8px",
  borderRadius: "$4",
  display: "grid",
  gap: "8px",
  position: "relative",
  // marginTop: "10px",
  marginBottom: "16px",
  maxWidth: "600px",
})

function Unit({ what, feelings, options, onChange, renderRelatedValues }: {
  what: string,
  feelings: string[],
  options: string[],
  onChange: ({ lifeGets, annotations }: {
    lifeGets: string[],
    annotations: { [tag: string]: string }
  }) => void
  renderRelatedValues?: (lifeGets: string[]) => ReactNode
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [lifeGets, setLifeGets] = useState<string[]>([]);
  const [lookFor, setLookFor] = useState<string[]>([]);
  const [annotations, setAnnotations] = useState<{
    [tag: string]: string
  }>({});
  const gets = {
    "strength": "strong",
    "connection": "connected",
    "exploration": "exploratory",
  }[what]!
  function setAnnotation(tag: string, annotation: string) {
    setAnnotations({
      ...annotations,
      [tag]: annotation,
    });
    onChange({ lifeGets: [gets, ...lifeGets], annotations })
  }
  function openUp() {
    setOpen(true)
    onChange({ lifeGets: [gets, ...lifeGets], annotations })
  }
  function close() {
    setOpen(false)
    onChange({ lifeGets: [], annotations: {} })
  }

  return <>
    <CheckboxLabel flush htmlFor={what}>
      <Checkbox id={what} checked={open} onCheckedChange={(b) => b ? openUp() : close()} />
      <div>
        {/* I am <BoldedList words={feelings} /> because a */}
        A kind of <b>{what}</b> is <BoldedList or words={isWhat(feelings)} />.
      </div>
    </CheckboxLabel>

    {open && <Card css={{ marginLeft: "16px", marginBottom: "16px" }}>
      <Hint>Which kind?</Hint>
      <TabbedDrawerMultiselect
        options={{ all: options }}
        selected={lifeGets}
        setSelected={x => { setLifeGets(x); onChange({ lifeGets, annotations }) }}
      >
        <TagsField
          tagVariant='lifeGets'
          placeholder=""
          tags={lifeGets}
        />
      </TabbedDrawerMultiselect>

      {lifeGets.length ? <>

        <Hint>Imagine you were able to be <BoldedList words={lifeGets} /> in this way—what would you be paying attention to?</Hint>

        <TabbedDrawerMultiselect
          options={attendablesOptions}
          selected={lookFor}
          setSelected={setLookFor}
        >
          <AnnotatedTagsField
            tagVariant='lookFor'
            placeholder=""
            tags={lookFor}
            annotations={annotations}
            setAnnotation={setAnnotation}
          />
        </TabbedDrawerMultiselect>

        {renderRelatedValues && renderRelatedValues(lifeGets) || null}
      </> : null}
    </Card>}
  </>
}

type AppreciationResult = Feeling | { feelings: string[], valueUuid: string }

export function AppreciationForm({ onSave, onClickInside, renderRelatedValues }: {
  onSave: (result: AppreciationResult) => void
  onClickInside?: () => void,
  renderRelatedValues?: (prompt: ReactNode, lifeGets: string[], onPicked: (x: Value) => void) => ReactNode
}) {
  const [pinnedValue, setPinnedValue] = useState<Value>()
  const [feelings, setFeelings] = useState<string[]>([]);
  const prompt = <>
    What's <BoldedList or words={isWhat(feelings)} />?
  </>
  return <>
    <TabbedDrawerMultiselect
      options={{ ...feels.negative, ...feels.positive }}
      selected={feelings}
      setSelected={setFeelings}
    >
      <TagsField
        onClick={() => { onClickInside && onClickInside() }}
        variant="inset"
        placeholder="What are you feeling right now?"
        tags={feelings}
      />
    </TabbedDrawerMultiselect>
    {feelings.length ?
      <Card css={{ marginTop: "10px", paddingTop: "8px" }}>
        <TriangleUpIcon style={{
          color: "#ddd",
          position: "absolute",
          left: "24px",
          top: "-23px",
          width: "40px",
          height: "40px",
        }} />

        <CardHeading>
          What's your <BoldedList words={feelings} /> feeling telling you?
        </CardHeading>
      </Card>
      : null
    }
    {feelings.length ?
      pinnedValue ?
        <PinnedValueAppreciationForm
          feelings={feelings}
          value={pinnedValue}
          onSave={() => onSave({
            feelings,
            valueUuid: pinnedValue.uuid!,
          })}
          onUnpin={() => setPinnedValue(undefined)}
        /> :
        <NewValueAppreciationForm
          onSave={onSave}
          feelings={feelings}
          renderRelatedValues={renderRelatedValues ? (lifeGets) => renderRelatedValues(prompt, lifeGets, setPinnedValue) : undefined}
        />
      : null}
  </>
}

function NewValueAppreciationForm({ onSave, feelings, renderRelatedValues }: {
  onSave: (result: Feeling) => void
  renderRelatedValues?: (lifeGets: string[]) => ReactNode
  feelings: string[]
}) {
  const [draft, setDraft] = useState<{
    [what: string]: {
      lifeGets: string[],
      annotations: { [tag: string]: string }
    }
  }>({})
  const annotations = Object.values(draft).reduce((prev, curr) => ({
    ...prev,
    ...curr.annotations,
  }), {} as { [tag: string]: string })

  const lifeGets = Object.values(draft).reduce((prev, curr) => prev.concat(curr.lifeGets), [] as string[])

  return <>
    <Unit
      what="connection"
      renderRelatedValues={renderRelatedValues}
      feelings={feelings}
      options={wobOptions.connected}
      onChange={({ lifeGets, annotations }) => {
        setDraft({
          ...draft,
          connection: { lifeGets, annotations },
        })
      }}
    />

    <Unit
      what="exploration"
      renderRelatedValues={renderRelatedValues}
      feelings={feelings}
      options={wobOptions.exploring}
      onChange={({ lifeGets, annotations }) => {
        setDraft({
          ...draft,
          exploration: { lifeGets, annotations },
        })
      }}
    />

    <Unit
      what="strength"
      renderRelatedValues={renderRelatedValues}
      feelings={feelings}
      options={wobOptions.strong}
      onChange={({ lifeGets, annotations }) => {
        setDraft({
          ...draft,
          strength: { lifeGets, annotations },
        })
      }}
    />
    <ButtonRow>
      <Button
        disabled={!feelings.length || !lifeGets.length || !Object.keys(draft).length}
        onClick={() => {
          const name = prompt("What would you call this way of living?")
          if (!name) return
          const date = new Date().toISOString()
          const value: Value = {
            name,
            type: 'exploratory',
            lookFor: Object.keys(annotations).map(tag => ({
              terms: [tag],
              qualifier: annotations[tag]
            })),
            lifeGets,
          }
          onSave({ date, value, feelings })
        }}>
        Save
      </Button>
    </ButtonRow>
  </>
}

function PinnedValueAppreciationForm({ feelings, value, onSave, onUnpin }: {
  feelings: string[]
  value: Value
  onSave: () => void
  onUnpin: () => void
}) {
  return <>
    The following value of mine is <BoldedList or words={isWhat(feelings)} />.
    <div style={{ display: "flex", justifyContent: "start" }}>
      <PolicyCard size={300} policy={value} />
      <IconButton variant="ghost" onClick={onUnpin}>
        <Cross1Icon />
      </IconButton>
    </div>
    <ButtonRow>
      <Button
        onClick={() => onSave()}>
        Save
      </Button>
    </ButtonRow>
  </>
}
