import { Cross1Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { styled } from "../stitches.config";
import { Badge } from "./Badge";
import { IconButton } from "./IconButton";

const SelectableField = styled('div', {
  backgroundColor: "#fff",
  borderRadius: "$2",
  padding: "8px 8px",
  minWidth: "3em",
  minHeight: "36px",
  boxSizing: "border-box",
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
  // marginLeft: "-8px",
  // marginRight: "-8px",
  gap: "4px",
  position: "relative",
  '.open &': {
    // outline: "auto 2px Highlight",
    outline: "auto 5px -webkit-focus-ring-color",
  },
  variants: {
    disabled: {
      true: {
        opacity: 0.5,
        cursor: "not-allowed",
      }
    },
    variant: {
      inset: {
        // padding: "8px 24px",
        border: "solid 1px #aaa",
      }
    }
  }
})

interface Props extends React.ComponentProps<typeof SelectableField> {
  tags: string[],
  placeholder?: string
  tagVariant?: Parameters<typeof Badge>[0]['variant']
  onClear?: () => void
}

export function TagsField({
  tags,
  placeholder,
  tagVariant = "blue",
  onClear,
  ...props
}: Props) {
  return (
    <SelectableField {...props}>
      {tags.length === 0 && (
        <span style={{ color: "#888", fontSize: "14px" }}>
          {placeholder}
        </span>
      )}
      {tags.map(tag => (
        <Badge key={tag} size={2} variant={tagVariant}>
          {tag}
        </Badge>
      ))}
      {tags.length > 0 && onClear && (
        <IconButton css={{ position: "absolute", right: "5px" }} variant="ghost" onClick={(e) => {
          onClear()
          e.stopPropagation()
        }}>
          <Cross1Icon />
        </IconButton>
      )}
    </SelectableField>
  )
}

const ExpandoInput = styled('input', {
  flex: "auto",
  border: "none",
  borderBottom: "solid 1px #aaa",
  borderRadius: 0,
  flexBasis: "fill",
  minWidth: "3em",
  "&[disabled]": {
    opacity: 0.5,
    cursor: "not-allowed",
  }
})

export function AnnotatedTagsField({ annotations, setAnnotation, annotationPlaceholder, onClick, placeholder = "Enter a thing", tagVariant = "blue", disabled }: {
  annotations: { [tag: string]: string },
  setAnnotation: (tag: string, annotation: string) => void,
  onClick?: () => void,
  placeholder?: string,
  annotationPlaceholder?: string,
  tagVariant?: Parameters<typeof Badge>[0]['variant'],
  disabled?: boolean
}) {
  const tags = Object.keys(annotations)
  return (
    <SelectableField
      disabled={disabled}
      style={{
        display: "grid",
        gap: "8px",
        overflowY: "auto",
        maxWidth: "100%"
      }}
      onClick={disabled ? undefined : onClick}>
      {tags.map(tag => (
        <div key={tag} style={{ display: "flex", gap: "8px", alignItems: 'baseline' }}>
          <Badge variant={tagVariant}> {tag} </Badge>
          <ExpandoInput
            placeholder={annotationPlaceholder}
            autoCapitalize="none"
            onClickCapture={e => e.stopPropagation()}
            value={annotations[tag] || ""}
            onChange={(e) => setAnnotation(tag, e.target.value)}
          />
        </div>
      ))}
      {tags.length === 0 ? (
        <span style={{ color: "#888" }}>
          {placeholder}
        </span>
      ) : (
        <div style={{ textAlign: "center" }}>
          <PlusCircledIcon style={{ color: "var(--blue-text)", }} />
        </div>
      )}
    </SelectableField>
  )
}
