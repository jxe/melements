import { useState } from "react";
import { styled } from "../stitches.config";
import { feels, attendables as attendablesOptions, wobs as wobOptions } from "../taxonomy";
import { Badge } from "./Badge";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";

const SelectableField = styled('div', {
  border: "solid 1px #888",
  backgroundColor: "#fff",
  borderRadius: 4,
  padding: "8px",
  minWidth: "3em",
  minHeight: "1.5em",
  '.open &': {
    // outline: "auto 2px Highlight",
    outline: "auto 5px -webkit-focus-ring-color",
  }
})

function TagsField({ tags, onClick, placeholder = "Enter a thing" }: { tags: string[], onClick?: () => void, placeholder?: string }) {
  return (
    <SelectableField onClick={onClick}>
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
    </SelectableField>
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
    <SelectableField style={{
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
    </SelectableField>
  )
}

const TitleInput = styled("input", {
  fontSize: "$4",
  padding: "8px",
})

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

      <TitleInput
        placeholder="Give it a name"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

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

      <button
        style={{
          fontSize: "1.2em",
        }}
        onClick={() => {
          const date = new Date().toISOString()
          const data = {
            date,
            title,
            feelings,
            wobs,
            attendables,
            annotations,
          }
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
