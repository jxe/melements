import { styled } from "../stitches.config";
import { Badge } from "./Badge";

const SelectableField = styled('div', {
  // border: "solid 1px #888",
  backgroundColor: "#fff",
  // borderRadius: 4,
  padding: "8px 16px",
  minWidth: "3em",
  minHeight: "1.5em",
  display: "flex",
  flexWrap: "wrap",
  marginLeft: "-8px",
  marginRight: "-8px",
  gap: "4px",
  '.open &': {
    // outline: "auto 2px Highlight",
    outline: "auto 5px -webkit-focus-ring-color",
  },
  variants: {
    variant: {
      inset: {
        padding: "8px 24px",
      }
    }
  }
})

export function TagsField({
  tags,
  onClick,
  placeholder = "Enter a thing",
  tagVariant = "blue",
  variant
}: {
  tags: string[],
  onClick?: () => void,
  placeholder?: string
  tagVariant?: Parameters<typeof Badge>[0]['variant']
  variant?: Parameters<typeof SelectableField>[0]['variant']
}) {
  return (
    <SelectableField
      variant={variant}
      onClick={onClick}
    >
      {tags.length === 0 && (
        <span style={{ color: "#888" }}>
          {placeholder}
        </span>
      )}
      {tags.map(tag => (
        <Badge key={tag} size={2} variant={tagVariant}>
          {tag}
        </Badge>
      ))}
    </SelectableField>
  )
}

const ExpandoInput = styled('input', {
  flex: "auto",
  border: "none",
  borderBottom: "solid 1px #aaa",
  borderRadius: 0,
})

export function AnnotatedTagsField({ tags, annotations, setAnnotation, onClick, placeholder = "Enter a thing", tagVariant = "blue" }: {
  tags: string[],
  annotations: { [tag: string]: string },
  setAnnotation: (tag: string, annotation: string) => void,
  onClick?: () => void,
  placeholder?: string,
  tagVariant?: Parameters<typeof Badge>[0]['variant']
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
        <div style={{ display: "flex", gap: "8px", alignItems: 'baseline' }}>
          <Badge key={tag} variant={tagVariant}>
            {tag}
          </Badge>
          <ExpandoInput
            placeholder=" "
            autoCapitalize="none"
            onClickCapture={e => e.stopPropagation()}
            value={annotations[tag]}
            onChange={(e) => setAnnotation(tag, e.target.value)}
          />
        </div>
      ))}
    </SelectableField>
  )
}
