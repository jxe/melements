import { useState } from "react";
import { styled } from "../stitches.config";
import { Checkbox, CheckboxLabel } from "./Checkbox";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import { TabbedDrawer } from "./TabbedDrawer";

const List = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  backgroundColor: '#ddd',
})

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
    <List>
      {
        options.map(option => (
          <CheckboxLabel htmlFor={option}>
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
          </CheckboxLabel>
        ))
      }
    </List>
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
      <div className={open ? 'open' : undefined} >
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
      </div>
      <SheetContent side="bottom" hideX>
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
