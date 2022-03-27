import { ChevronRightIcon, Cross1Icon, TriangleUpIcon } from "@radix-ui/react-icons";
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
import { EditableTitleCard, OnlyLifeGetsCard, PolicyCard } from "./PolicyCard";
import { IconButton } from "./IconButton";

const ButtonRow = styled("div", {
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
})


const Hint = styled("div", {
  fontSize: "$3",
  color: "$gray11",
  padding: "8px 16px 0px",
})

const Confugurator = styled("div", {
  backgroundColor: "#ddd",
})


const ConfiguratorHeader = styled("div", {
  padding: "4px 16px",
  textTransform: "uppercase",
  color: "$gray11",
  fontSize: "$2",
})

const ConfiguratorGroupBody = styled("div", {
  backgroundColor: "white",
  padding: "8px",
  borderRadius: "$4",
  margin: "0px 8px",
  display: "grid",
  gap: "0.5px",
  "& > :not(:last-child)": {
    borderBottom: "0.5px solid $gray11",
  }
})

function CellButton({ children, onClick }: { children: ReactNode, onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      {children}
      <ChevronRightIcon />
    </Button>
  )
}

//
/// VALUE GARDENS
//

export function EmptyValueGarden({ onClick }: { onClick: () => void }) {
  return <CellButton onClick={onClick}>
    Add a value
  </CellButton>
}

export function NeedsLookForsValueGarden({ lifeGets, onClick }: { lifeGets: string[], onClick: () => void }) {
  return <>
    <OnlyLifeGetsCard lifeGets={lifeGets} />
    <CellButton onClick={onClick}>
      Specify attention
    </CellButton>
    <Hint>
      Complete this by describing the value in terms of what you attend to when you live by it.
    </Hint>
  </>
}

export function PickedValueGarden({ value, onDelete, feelings }: {
  value: Value,
  onDelete: () => void,
  feelings: string[],
}) {
  return <>
    The following value of mine is <BoldedList or words={isWhat(feelings)} />.
    <div style={{ display: "flex", justifyContent: "start" }}>
      <PolicyCard size={300} policy={value} />
      <IconButton variant="ghost" onClick={onDelete}>
        <Cross1Icon />
      </IconButton>
    </div>
  </>
}

function ConfiguratorGroup({ title, hint, children }: {
  title: string,
  children: ReactNode,
  hint?: ReactNode,
}) {
  return <ConfiguratorGroupDiv>
    <ConfiguratorHeader>{title}</ConfiguratorHeader>
    <ConfiguratorGroupBody>
      {children}
    </ConfiguratorGroupBody>
    {hint && <Hint>{hint}</Hint>}
  </ConfiguratorGroupDiv>
}

const ConfiguratorGroupDiv = styled('div', {
  paddingTop: "16px",
})

function Unit({ what, feelings, options, onChange }: {
  what: string,
  feelings: string[],
  options: string[],
  onChange: ({ lifeGets }: {
    lifeGets: string[],
  }) => void
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [lifeGets, setLifeGets] = useState<string[]>([]);
  const gets = {
    "strength": "strong",
    "connection": "connected",
    "exploration": "exploratory",
  }[what]!
  const allGets = [gets, ...lifeGets]
  function openUp() {
    setOpen(true)
    onChange({ lifeGets: allGets })
  }
  function close() {
    setOpen(false)
    onChange({ lifeGets: [] })
  }

  return <ConfiguratorGroup title={what}>
    <CheckboxLabel flush htmlFor={what}>
      <Checkbox id={what} checked={open} onCheckedChange={(b) => b ? openUp() : close()} />
      <div>
        {/* I am <BoldedList words={feelings} /> because a */}
        A kind of <b>{what}</b> is <BoldedList or words={isWhat(feelings)} />.
      </div>
    </CheckboxLabel>

    {open && <div>
      <TabbedDrawerMultiselect
        options={{ all: options }}
        selected={lifeGets}
        setSelected={x => { setLifeGets(x); onChange({ lifeGets: [gets, ...x] }) }}
      >
        <TagsField
          tagVariant='lifeGets'
          placeholder="Which kind?"
          tags={lifeGets}
        />
      </TabbedDrawerMultiselect>
    </div>}
  </ConfiguratorGroup>
}

//
// VALUE CONFIGURATORS
//

export function AttendablesConfigurator({ lifeGets, annotations, setAnnotations, onDone, renderRelatedValues }: {
  lifeGets: string[],
  annotations: {
    [tag: string]: string
  },
  setAnnotations: (annotations: {
    [tag: string]: string
  }) => void,
  onDone: () => void,
  renderRelatedValues?: (lifeGets: string[]) => ReactNode,
}) {
  function setAnnotation(tag: string, annotation: string) {
    setAnnotations({
      ...annotations,
      [tag]: annotation,
    });
  }
  const [lookFor, setLookFor] = useState<string[]>([]);

  return <>
    Imagine you were able to be <BoldedList words={lifeGets} /> in this way—what would you be paying attention to?

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
    {lifeGets.length > 0 && renderRelatedValues && renderRelatedValues(lifeGets) || null}
    <ButtonRow>
      <Button
        // disabled={!feelings.length || !lifeGets.length || !Object.keys(draft).length}
        onClick={onDone}>
        Save
      </Button>
    </ButtonRow>
  </>

}

export function WobConfigurator({ draft, setDraft, feelings }: {
  draft: { [what: string]: { lifeGets: string[] } },
  setDraft: (draft: { [what: string]: { lifeGets: string[] } }) => void,
  feelings: string[]
}) {


  return <>
    <Confugurator>
      <Unit
        what="connection"
        feelings={feelings}
        options={wobOptions.connected}
        onChange={(connection) => setDraft({ ...draft, connection })}
      />

      <Unit
        what="exploration"
        feelings={feelings}
        options={wobOptions.exploring}
        onChange={(exploration) => setDraft({ ...draft, exploration })}
      />

      <Unit
        what="strength"
        feelings={feelings}
        options={wobOptions.strong}
        onChange={(strength) => setDraft({ ...draft, strength })}
      />
    </Confugurator>
  </>
}
