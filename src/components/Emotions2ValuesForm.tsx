import { useState } from "react";
import { feels, attendables as attendablesOptions, wobs as wobOptions } from "../taxonomy";
import { Badge } from "./Badge";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";

function TagsField({ tags, onClick }: { tags: string[], onClick?: () => void }) {
  return (
    <div style={{
      border: "solid 1px #888",
      backgroundColor: "#fff",
      borderRadius: 4,
      padding: "8px",
      minWidth: "3em",
      minHeight: "1.5em",
    }} onClick={onClick}>
      {tags.map(tag => (
        <Badge key={tag}>
          {tag}
        </Badge>
      ))}
    </div>
  )
}

function AnnotatedTagsField({ tags, annotations, setAnnotation, onClick }: {
  tags: string[],
  annotations: { [tag: string]: string },
  setAnnotation: (tag: string, annotation: string) => void,
  onClick?: () => void
}) {
  return (
    <div style={{
      border: "solid 1px #888",
      backgroundColor: "#fff",
      borderRadius: 4,
      padding: "8px",
      minWidth: "3em",
      minHeight: "1.5em",
      display: "grid",
      gap: "8px"
    }} onClick={onClick}>
      {tags.map(tag => (
        <div style={{ display: "flex", gap: "4px" }}>
          <Badge key={tag}>
            {tag}
          </Badge>
          <input
            onClickCapture={e => e.stopPropagation()}
            style={{ flex: "auto" }}
            value={annotations[tag]}
            onChange={(e) => setAnnotation(tag, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}


export function Emotions2ValuesForm() {
  const [feelings, setFeelings] = useState<string[]>([]);
  const [wobs, setWobs] = useState<string[]>([]);
  const [attendables, setAttendables] = useState<string[]>([]);
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
        <TagsField tags={feelings} />
      </TabbedDrawerMultiselect>

      <TabbedDrawerMultiselect
        options={wobOptions}
        selected={wobs}
        setSelected={setWobs}
      >
        <TagsField tags={wobs} />
      </TabbedDrawerMultiselect>

      <TabbedDrawerMultiselect
        options={attendablesOptions}
        selected={attendables}
        setSelected={setAttendables}
      >
        <AnnotatedTagsField
          tags={attendables}
          annotations={annotations}
          setAnnotation={setAnnotation}
        />
      </TabbedDrawerMultiselect>
    </>
  )
}