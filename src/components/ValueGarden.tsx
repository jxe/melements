import { ReactNode, useEffect, useState } from "react";
import { styled } from "../stitches.config";
import { isWhat } from "../emotions";
import { attendables as attendablesOptions } from "../attendables"
import { wobs as wobOptions } from "../wobs"
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";
import { AnnotatedTagsField, TagsField } from "./TagsFields";
import { BoldedList } from "./BoldedList";
import { Checkbox, CheckboxLabel } from "./Checkbox";
import { PaneBody } from "./Multipane";
import { Value } from "../types";
import { PolicyCard } from "./PolicyCard";

const Hint = styled("div", {
  fontSize: "$3",
  color: "$gray11",
  padding: "8px 16px 0px",
})

const PageHeading = styled("div", {
  textAlign: "center",
  padding: "16px 8px",
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

//
/// VALUE GARDENS
//

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

export function AttendablesConfigurator({ lifeGets, annotations, setAnnotations, relatedValues, feelings, onRelatedValuePicked }: {
  lifeGets: string[],
  annotations: {
    [tag: string]: string
  },
  setAnnotations: (annotations: {
    [tag: string]: string
  }) => void,
  relatedValues: Value[],
  onRelatedValuePicked: (value: Value) => void,
  feelings: string[],
}) {
  function setAnnotation(tag: string, annotation: string) {
    setAnnotations({
      ...annotations,
      [tag]: annotation,
    });
  }
  const [lookFor, setLookFor] = useState<string[]>([]);

  return <PaneBody>
    <PageHeading>
      Imagine you were able to be <BoldedList words={lifeGets} /> in this way—what would you be paying attention to?
    </PageHeading>
    <Confugurator css={{ flex: "auto" }}>
      <ConfiguratorGroup title="Attention">
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
            annotationPlaceholder="What kind?"
          />
        </TabbedDrawerMultiselect>
      </ConfiguratorGroup>
    </Confugurator>
    {relatedValues.length > 0 && <>
      Or choose a related value. What's <BoldedList or words={isWhat(feelings)} />?
      {relatedValues.map(value => (
        <PolicyCard policy={value} onClick={() => { onRelatedValuePicked(value) }} />
      ))}
    </>}
  </PaneBody>
}

export function WobConfigurator({ draft, setDraft, feelings }: {
  draft: { [what: string]: { lifeGets: string[] } },
  setDraft: (draft: { [what: string]: { lifeGets: string[] } }) => void,
  feelings: string[]
}) {
  return <PaneBody>
    <PageHeading>
      What's your <BoldedList words={feelings} /> feeling telling you?
    </PageHeading>
    <Confugurator css={{ flex: "auto" }}>
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
  </PaneBody>
}
