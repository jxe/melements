import { useState } from "react";
import { CheckboxList } from "./Checkbox";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import { TabbedDrawer } from "./TabbedDrawer";

export function TabbedDrawerMultiselect({ options, selected, setSelected, children }: {
  options: { [tab: string]: string[] },
  selected: string[],
  setSelected: (selected: string[]) => void,
  children: React.ReactNode,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet modal open={open} onOpenChange={setOpen}>
      {/* <div className={open ? 'open' : undefined} > */}
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      {/* </div> */}
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
