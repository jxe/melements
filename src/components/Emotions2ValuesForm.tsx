import { TriangleUpIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { styled } from "../stitches.config";
import { feels, isWhat } from "../emotions";
import { attendables as attendablesOptions } from "../attendables"
import { wobs as wobOptions } from "../wobs"
import { Feeling, Value } from "../types";
import { Button } from "./Button";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";
import { AnnotatedTagsField, TagsField } from "./TagsFields";
import { BoldedList } from "./BoldedList";
import { VisibilityTag } from "./VisibilityTag";

const TitleInput = styled("input", {
  fontSize: "$4",
  padding: "8px 8px",
  borderRadius: "$2",
  // marginLeft: "-8px",
  // marginRight: "-8px",
  border: "none",
  // borderRadius: 0,
  "&::placeholder": {
    color: "rgb(136, 136, 136)",
  }
})

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
  padding: "16px 8px 0px",
})

const Card = styled("div", {
  // border: "solid 1px #888",
  backgroundColor: "#ddd",
  padding: "8px 8px 24px",
  borderRadius: "$4",
  display: "grid",
  gap: "8px",
  position: "relative",
  marginTop: "10px",
  marginBottom: "16px",
  maxWidth: "600px",
})

function Unit({ what, feelings, options, onChange }: {
  what: string,
  feelings: string[],
  options: string[],
  onChange: ({ lifeGets, annotations }: {
    lifeGets: string[],
    annotations: { [tag: string]: string }
  }) => void
}) {
  const [lifeGets, setLifeGets] = useState<string[]>([]);
  const [lookFor, setLookFor] = useState<string[]>([]);
  const [annotations, setAnnotations] = useState<{
    [tag: string]: string
  }>({});
  function setAnnotation(tag: string, annotation: string) {
    setAnnotations({
      ...annotations,
      [tag]: annotation,
    });
    onChange({ lifeGets, annotations })
  }

  return <>
    <Hint>
      Are you <BoldedList words={feelings} /> because a kind of <b>{what}</b> is <BoldedList conjunction="or" words={isWhat(feelings)} />?
    </Hint>

    <TabbedDrawerMultiselect
      options={{ all: options }}
      selected={lifeGets}
      setSelected={x => { setLifeGets(x); onChange({ lifeGets, annotations }) }}
    >
      <TagsField
        tagVariant='lifeGets'
        placeholder="Which kind?"
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

    </> : null}
  </>
}

export function Emotions2ValuesForm({ onSave, onClickInside }: {
  onSave: (feeling: Feeling) => void,
  onClickInside?: () => void,
}) {
  const [name, setName] = useState("");
  const [feelings, setFeelings] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'onlyme' | 'public'>('onlyme');
  const [counter, setCounter] = useState(0);
  const [draft, setDraft] = useState<{
    [what: string]: {
      lifeGets: string[],
      annotations: { [tag: string]: string }
    }
  }>({})
  function reset() {
    setCounter(counter + 1);
    setName("");
    setFeelings([]);
    setDraft({})
    setVisibility('public');
  }

  const annotations = Object.values(draft).reduce((prev, curr) => ({
    ...prev,
    ...curr.annotations,
  }), {} as { [tag: string]: string })

  const lifeGets = Object.values(draft).reduce((prev, curr) => prev.concat(curr.lifeGets), [] as string[])

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

    {(feelings.length > 0) ? (
      <>
        <Card>
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

          <Unit
            what="connection"
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
            feelings={feelings}
            options={wobOptions.strong}
            onChange={({ lifeGets, annotations }) => {
              setDraft({
                ...draft,
                strength: { lifeGets, annotations },
              })
            }}
          />

          <Hint>Give that way of living a name.</Hint>
          <TitleInput
            placeholder=""
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Card>
        <ButtonRow>
          <VisibilityTag visibility={visibility} setVisibility={setVisibility} />
          <Button
            disabled={!name || !feelings.length}
            onClick={() => {
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
              onSave({ date, value, feelings, visibility })
              reset()
            }}>
            Save
          </Button>
        </ButtonRow>
      </>
    ) : null}
  </>
}
