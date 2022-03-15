import { Cross1Icon, TriangleUpIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { styled } from "../stitches.config";
import { isWhat } from "../emotions";
import { attendables as attendablesOptions } from "../attendables"
import { wobs as wobOptions } from "../wobs"
import { Value } from "../types";
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

const Confugurator = styled("div", {
  backgroundColor: "#ddd",
})


const ConfiguratorHeader = styled("div", {
  padding: "0px 8px",
  textTransform: "uppercase",
})

const ConfiguratorGroupBody = styled("div", {
  backgroundColor: "white",
  padding: "8px",
  borderRadius: "$4",
  marginBottom: "8px",
})

function ConfiguratorGroup({ title, hint, children }: {
  title: string,
  children: ReactNode,
  hint?: string,
}) {
  return <>
    <ConfiguratorHeader>{title}</ConfiguratorHeader>
    <ConfiguratorGroupBody>
      {children}
    </ConfiguratorGroupBody>
    {hint && <Hint>{hint}</Hint>}
  </>
}

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

export function ValueFinder({ feelings, value, onValueChanged, renderRelatedValues }: {
  value?: Value,
  onValueChanged: (value?: Value) => void
  renderRelatedValues?: (prompt: ReactNode, lifeGets: string[], onPicked: (x: Value) => void) => ReactNode,
  feelings: string[]
}) {
  if (!feelings.length) return null
  const prompt = <>
    What's <BoldedList or words={isWhat(feelings)} />?
  </>
  return <>
    {value ?
      <>
        The following value of mine is <BoldedList or words={isWhat(feelings)} />.
        <div style={{ display: "flex", justifyContent: "start" }}>
          <PolicyCard size={300} policy={value} />
          <IconButton variant="ghost" onClick={() => onValueChanged(undefined)}>
            <Cross1Icon />
          </IconButton>
        </div>
      </>
      :
      <NewValueAppreciationForm
        feelings={feelings}
        onSave={onValueChanged}
        renderRelatedValues={renderRelatedValues ? (lifeGets) => renderRelatedValues(prompt, lifeGets, onValueChanged) : undefined}
      />
    }
  </>
}

function NewValueAppreciationForm({ onSave, feelings, renderRelatedValues }: {
  onSave: (result: Value) => void
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
          const value: Value = {
            name,
            type: 'exploratory',
            lookFor: Object.keys(annotations).map(tag => ({
              terms: [tag],
              qualifier: annotations[tag]
            })),
            lifeGets,
          }
          onSave(value)
        }}>
        Save
      </Button>
    </ButtonRow>
  </>
}
