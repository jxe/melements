import { styled } from "../stitches.config";
import { Badge } from "./Badge";

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

export function TagsField({ tags, onClick, placeholder = "Enter a thing" }: { tags: string[], onClick?: () => void, placeholder?: string }) {
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

export function AnnotatedTagsField({ tags, annotations, setAnnotation, onClick, placeholder = "Enter a thing" }: {
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
            autoCapitalize="none"
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
