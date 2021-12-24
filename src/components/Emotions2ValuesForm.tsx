import { useState } from "react";
import { styled } from "../stitches.config";
import { feels, attendables as attendablesOptions, wobs as wobOptions, isWhat } from "../taxonomy";
import { Feeling, Value } from "../types";
import { Button } from "./Button";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";
import { AnnotatedTagsField, TagsField } from "./TagsFields";

const TitleInput = styled("input", {
  fontSize: "$4",
  padding: "10px 16px",
  marginLeft: "-8px",
  marginRight: "-8px",
  border: "none",
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
  // fontWeight: "bold",
  padding: "16px 8px 0px",
  color: "$gray12",
  "&:first-child": {
    paddingTop: 0,
  }
})

const Hint = styled("div", {
  fontSize: "$3",
  color: "$gray10",
  padding: "0px 8px 0px",
})

const Card = styled("div", {
  // border: "solid 1px #888",
  backgroundColor: "#eee",
  padding: "8px 8px 16px",
  borderRadius: "$4",
  display: "grid",
  gap: "8px"
})

export function Emotions2ValuesForm({ onSave }: { onSave: (feeling: Feeling) => void }) {
  const [name, setName] = useState("");
  const [feelings, setFeelings] = useState<string[]>([]);
  const [lifeGets, setLifeGets] = useState<string[]>([]);
  const [lookFor, setLookFor] = useState<string[]>([]);
  const [annotations, setAnnotations] = useState<{
    [tag: string]: string
  }>({});
  function reset() {
    setName("");
    setFeelings([]);
    setLifeGets([]);
    setLookFor([]);
    setAnnotations({});
  }
  function setAnnotation(tag: string, annotation: string) {
    setAnnotations({
      ...annotations,
      [tag]: annotation,
    });
  }
  return (
    <>
      <TabbedDrawerMultiselect
        options={{ ...feels.negative, ...feels.positive }}
        selected={feelings}
        setSelected={setFeelings}
      >
        <TagsField
          variant="inset"
          placeholder="Your feelings"
          tags={feelings}
        />
      </TabbedDrawerMultiselect>

      <Card>
        <CardHeading>Way of Living</CardHeading>
        <Hint>
          These feelings are gifts. They tell you an important way of living is {isWhat(feelings).join(', ')}...
        </Hint>

        <TabbedDrawerMultiselect
          options={wobOptions}
          selected={lifeGets}
          setSelected={setLifeGets}
        >
          <TagsField
            tagVariant='lifeGets'
            placeholder="A way of being..."
            tags={lifeGets}
          />
        </TabbedDrawerMultiselect>

        <CardHeading>Summary</CardHeading>
        <TitleInput
          placeholder="Name that way of being"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <CardHeading>Details</CardHeading>
        <Hint>What do you pay attention to, when you live that way?</Hint>
        <TabbedDrawerMultiselect
          options={attendablesOptions}
          selected={lookFor}
          setSelected={setLookFor}
        >
          <AnnotatedTagsField
            tagVariant='lookFor'
            placeholder="I notice..."
            tags={lookFor}
            annotations={annotations}
            setAnnotation={setAnnotation}
          />
        </TabbedDrawerMultiselect>
      </Card>
      <ButtonRow>
        <Button
          disabled={!name || !feelings.length || !lifeGets.length || !lookFor.length}
          onClick={() => {
            const value: Value = {
              name,
              type: 'exploratory',
              lookFor: Object.keys(annotations).map(tag => ({
                terms: [tag],
                qualifier: annotations[tag]
              })),
              lifeGets,
            }
            onSave({ value, feelings })
            reset()
          }}>
          Save
        </Button>
      </ButtonRow>
    </>
  )
}
