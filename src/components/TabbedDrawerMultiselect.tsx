import { useState } from "react";
import { styled } from "../stitches.config";
import { Checkbox } from "./Checkbox";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import { TabbedDrawer } from "./TabbedDrawer";

const Label = styled('label', {
  padding: "4px",
  gap: "8px",
  display: 'flex',
  justifyContent: "flex-start",
  color: 'black',
  fontSize: 15,
  lineHeight: 1,
  userSelect: 'none',
  flex: "auto",
  textAlign: "left",
});

function CheckboxList({
  options,
  selected,
  onChange,
}: {
  options: string[],
  selected: string[],
  onChange: (selected: string[]) => void,
}) {
  return (
    <div>
      {
        options.map(option => (
          <Label htmlFor={option}>
            <Checkbox
              id={option}
              onCheckedChange={checked => {
                if (checked) {
                  onChange([...selected, option]);
                } else {
                  onChange(selected.filter(s => s !== option))
                }
              }}
              checked={selected.includes(option)}
            />
            {option}
          </Label>
        ))
      }
    </div>
  )
}

export function TabbedDrawerMultiselect({ options, selected, setSelected, children }: {
  options: { [tab: string]: string[] },
  selected: string[],
  setSelected: (selected: string[]) => void,
  children: React.ReactNode,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom">
        <TabbedDrawer
          tabs={Object.keys(options)}
          renderContentForTab={tab => {
            return (
              <CheckboxList
                options={options[tab]}
                selected={selected}
                onChange={setSelected}
              />
            )
          }
          }
        />
      </SheetContent>
    </Sheet>
  )
}
