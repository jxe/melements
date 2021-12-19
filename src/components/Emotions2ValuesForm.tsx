import { useState } from "react";
import { styled } from "../stitches.config";
import { feels, attendables as attendablesOptions, wobs as wobOptions } from "../taxonomy";
import { Value } from "../types";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";
import { AnnotatedTagsField, TagsField } from "./TagsFields";

const TitleInput = styled("input", {
  fontSize: "$4",
  padding: "8px",
})

export function Emotions2ValuesForm() {
  const [name, setName] = useState("");
  const [feelings, setFeelings] = useState<string[]>([]);
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
  }
  return (
    <>
      <TabbedDrawerMultiselect
        options={feels.negative}
        selected={feelings}
        setSelected={setFeelings}
      >
        <TagsField
          placeholder="Your feelings"
          tags={feelings}
        />
      </TabbedDrawerMultiselect>

      <TabbedDrawerMultiselect
        options={wobOptions}
        selected={lifeGets}
        setSelected={setLifeGets}
      >
        <TagsField
          placeholder="Ways of Being"
          tags={lifeGets}
        />
      </TabbedDrawerMultiselect>

      <TitleInput
        placeholder="Give it a name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <TabbedDrawerMultiselect
        options={attendablesOptions}
        selected={lookFor}
        setSelected={setLookFor}
      >
        <AnnotatedTagsField
          placeholder="Attendables"
          tags={lookFor}
          annotations={annotations}
          setAnnotation={setAnnotation}
        />
      </TabbedDrawerMultiselect>

      <button
        style={{
          fontSize: "1.2em",
        }}
        onClick={() => {
          const date = new Date().toISOString()
          const value: Value = {
            name,
            type: 'exploratory',
            lookFor: Object.keys(lookFor).map(tag => ({
              terms: [tag],
              qualifier: annotations[tag]
            })),
            lifeGets,
          }
          const data = { date, feelings, value }
          const json = JSON.stringify(data)
          localStorage.setItem(`e2v:${date}`, json)
          const blob = new Blob([json], { type: 'text/json' })
          const link = document.createElement("a");
          link.download = `emotions-${date}.json`;
          link.href = window.URL.createObjectURL(blob);
          link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
          const evt = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
          link.dispatchEvent(evt);
          link.remove()
        }}>
        Save
      </button>
    </>
  )
}
