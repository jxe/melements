import { useState } from "react";
import { feels, attendables as attendablesOptions, wobs as wobOptions } from "../taxonomy";
import { Badge } from "./Badge";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";

function TagsField({ tags, onClick, placeholder = "Enter a thing" }: { tags: string[], onClick?: () => void, placeholder?: string }) {
  return (
    <div style={{
      border: "solid 1px #888",
      backgroundColor: "#fff",
      borderRadius: 4,
      padding: "8px",
      minWidth: "3em",
      minHeight: "1.5em",
    }} onClick={onClick}>
      {tags.length === 0 && (
        <span style={{ color: "#888" }}>
          {placeholder}
        </span>
      )}
      {tags.map(tag => (
        <Badge key={tag}>
          {tag}
        </Badge>
      ))}
    </div>
  )
}

function AnnotatedTagsField({ tags, annotations, setAnnotation, onClick, placeholder = "Enter a thing" }: {
  tags: string[],
  annotations: { [tag: string]: string },
  setAnnotation: (tag: string, annotation: string) => void,
  onClick?: () => void,
  placeholder?: string,
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
      {tags.length === 0 && (
        <span style={{ color: "#888" }}>
          {placeholder}
        </span>
      )}
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
  const [title, setTitle] = useState("");
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
        <TagsField
          placeholder="Your feelings"
          tags={feelings}
        />
      </TabbedDrawerMultiselect>

      <TabbedDrawerMultiselect
        options={wobOptions}
        selected={wobs}
        setSelected={setWobs}
      >
        <TagsField
          placeholder="Ways of Being"
          tags={wobs}
        />
      </TabbedDrawerMultiselect>

      <TabbedDrawerMultiselect
        options={attendablesOptions}
        selected={attendables}
        setSelected={setAttendables}
      >
        <AnnotatedTagsField
          placeholder="Attendables"
          tags={attendables}
          annotations={annotations}
          setAnnotation={setAnnotation}
        />
      </TabbedDrawerMultiselect>

      <input
        style={{
          fontSize: "1.5em",
          padding: "8px",
        }}
        placeholder="Title it"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <button
        style={{
          fontSize: "1.5em",
        }}
        onClick={() => {
          const date = new Date()
          const data = {
            date: date.toISOString(),
            title,
            feelings,
            wobs,
            attendables,
            annotations,
          }
          const blob = new Blob([JSON.stringify(data)], { type: 'text/json' })
          const link = document.createElement("a");
          link.download = `emotions-${date.toISOString()}.json`;
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
