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
import { Checkbox } from "./Checkbox";
import { BoldedList } from "./BoldedList";

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

const CardHeading = styled("span", {
  textTransform: "uppercase",
  fontSize: "$2",
  fontWeight: "500",
  marginRight: "8px",
  color: "$gray12",
})

const Hint = styled("div", {
  fontSize: "$3",
  color: "$gray11",
  padding: "0px 8px 0px",
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

export function Emotions2ValuesForm({ collapse, onSave, onClickInside }: {
  onSave: (feeling: Feeling) => void,
  collapse?: boolean,
  onClickInside?: () => void,
}) {
  const [name, setName] = useState("");
  const [feelings, setFeelings] = useState<string[]>([]);
  const [lifeGets, setLifeGets] = useState<string[]>([]);
  const [lookFor, setLookFor] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(!collapse);
  const [visibility, setVisibility] = useState<'onlyme' | 'public'>('public');
  const [annotations, setAnnotations] = useState<{
    [tag: string]: string
  }>({});
  function reset() {
    setName("");
    setFeelings([]);
    setLifeGets([]);
    setLookFor([]);
    setAnnotations({});
    setVisibility('public');
  }
  function setAnnotation(tag: string, annotation: string) {
    setAnnotations({
      ...annotations,
      [tag]: annotation,
    });
  }

  const livingIs = feelings.length ? <>that's <BoldedList conjunction="or" words={isWhat(feelings)} /></> : 'that needs attention'
  const lifeGetsPlaceholder = feelings.length ? <>What's <BoldedList conjunction="or" words={isWhat(feelings)} />?</> : 'How do you want to live?'

  return (
    <>
      <TabbedDrawerMultiselect
        options={{ ...feels.negative, ...feels.positive }}
        selected={feelings}
        setSelected={setFeelings}
      >
        <TagsField
          onClick={() => { onClickInside && onClickInside(); setIsOpen(true) }}
          variant="inset"
          placeholder="What are you feeling right now?"
          tags={feelings}
        />
      </TabbedDrawerMultiselect>

      {!collapse || isOpen || (feelings.length > 0) ? (
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
            <Hint>
              <CardHeading>Way of Living</CardHeading>
              These feelings are gifts. They bring your attention to a way of living {livingIs}.<br /><br /> {lifeGetsPlaceholder}
            </Hint>

            <TabbedDrawerMultiselect
              options={wobOptions}
              selected={lifeGets}
              setSelected={setLifeGets}
            >
              <TagsField
                tagVariant='lifeGets'
                placeholder=""
                tags={lifeGets}
              />
            </TabbedDrawerMultiselect>

            <div style={{ marginTop: "8px" }} />
            <Hint>What exactly would you be paying attention to, if you were living that way? {lookFor.length ? `(Please specify.)` : null}</Hint>
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

            <div style={{ marginTop: "8px" }} />
            <Hint>Give that way of living a name.</Hint>
            <TitleInput
              placeholder=""
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Card>
          <ButtonRow>
            <label htmlFor="visibility">
              <Checkbox id="visibility" checked={visibility === 'public'} onCheckedChange={(b) => {
                setVisibility(b ? 'public' : 'onlyme')
              }} />
              Public
            </label>
            <Button
              disabled={!name || !feelings.length || !lifeGets.length || !lookFor.length}
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
  )
}
