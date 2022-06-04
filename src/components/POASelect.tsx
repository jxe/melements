import { attendables as attendablesOptions } from "../attendables";
import { AnnotatedTagsField } from "./TagsFields";
import { SheetedField } from './SheetedField';
import { TabbedDrawer } from './TabbedDrawer';
import { styled } from "../stitches.config";
import { List as Checklist, CollapsibleCheckbox } from "./Checkbox";
import { ReactNode } from "react";

export function POASelect({ disabled, annotations, setAnnotations }: {
  disabled?: boolean
  annotations: {
    [tag: string]: string
  },
  setAnnotations: (f: (as: {
    [tag: string]: string
  }) => {
    [tag: string]: string
  }) => void
}) {
  function setAnnotation(tag: string, value?: string) {
    setAnnotations(annotations => {
      const newAnnotations = { ...annotations }
      if (value === undefined) delete newAnnotations[tag]
      else newAnnotations[tag] = value
      return newAnnotations
    })
  }

  return (
    <SheetedField
      sheetContent={
        <TabbedDrawer
          tabs={Object.keys(attendablesOptions)}
          renderContentForTab={(tab) => {
            const options: string[] = (attendablesOptions as any)[tab]
            return <Checklist>{
              options.map(option => (
                <ChickinputField
                  label={option}
                  placeholder="What kind?"
                  value={annotations[option]}
                  onChange={(value) => setAnnotation(option, value)}
                />
              ))
            }</Checklist>
          }}
        />
      }
    >
      <AnnotatedTagsField
        disabled={disabled}
        tagVariant='lookFor'
        placeholder={disabled ? "" : "Add paths of attention"}
        annotations={annotations}
        setAnnotation={setAnnotation}
        annotationPlaceholder="What kind?"
      />
    </SheetedField>
  )
}


const Chickinput = styled('input', {
  border: "none",
  borderBottom: "1px solid #ccc",
  padding: "8px",
  fontSize: "16px",
  width: "100%",
  outline: "none",

})

function ChickinputField({ value, onChange, placeholder, label }: {
  value?: string,
  onChange: (value?: string) => void,
  placeholder: string,
  label: ReactNode
}) {
  return <CollapsibleCheckbox
    label={label}
    open={value !== undefined}
    onChange={(b) => onChange(b ? "" : undefined)}
  >
    <Chickinput placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
  </CollapsibleCheckbox>
}
