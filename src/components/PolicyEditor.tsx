import { useState } from "react";
import { styled } from "../stitches.config";
import { attendables as attendablesOptions } from "../attendables"
import { wobs as wobOptions } from "../wobs"
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";
import { AnnotatedTagsField, TagsField } from "./TagsFields";
import { PolicyCardFrame } from "./PolicyCard";
import { Policy, Value } from "../types";
import { Button } from "./Button";

const TitleInput = styled("input", {
  fontSize: "$4",
  padding: "8px 8px",
  borderRadius: "$2",
  border: "none",
  "&::placeholder": {
    color: "rgb(136, 136, 136)",
  }
})

export function PolicyEditor({ initialPolicy, onSave, onCancel }: {
  initialPolicy: Policy,
  onSave: (policy: Policy) => void,
  onCancel: () => void
}) {
  const [name, setName] = useState(initialPolicy.name);
  const [lifeGets, setLifeGets] = useState<string[]>(initialPolicy.lifeGets);
  const [lookFor, setLookFor] = useState<string[]>(initialPolicy.lookFor.flatMap(l => l.terms));
  const [annotations, setAnnotations] = useState<{
    [tag: string]: string
  }>(initialPolicy.lookFor.reduce((acc, { terms, qualifier }) => ({ ...acc, [terms[0]]: qualifier }), {}));
  function setAnnotation(tag: string, annotation: string) {
    setAnnotations({
      ...annotations,
      [tag]: annotation,
    });
  }

  return (
    <div>
      <PolicyCardFrame
        name={
          <TitleInput
            placeholder=""
            value={name}
            onChange={e => setName(e.target.value)}
          />
        }
        lookFors={
          <TabbedDrawerMultiselect
            options={attendablesOptions}
            selected={lookFor}
            setSelected={setLookFor}
          >
            <AnnotatedTagsField
              tagVariant='lookFor'
              placeholder=""
              annotations={annotations}
              setAnnotation={setAnnotation}
            />
          </TabbedDrawerMultiselect>
        }
        lifeGets={
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
        }
      />
      <Button chill onClick={onCancel}> Cancel </Button>
      <Button
        disabled={!name || !lookFor.length || !lifeGets.length}
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
          onSave(value)
        }}>
        Save
      </Button>
    </div>
  )
}
