import { createContext, ReactNode, useContext, useState } from "react";
import { AsyncCheckbox, CheckboxLabel } from "./Checkbox";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";

const CheckboxDrawerContext = createContext<{
  selected: string[],
  setSelected: (selected: string[]) => Promise<void>,
}>(null as any);

export function Checkbox({
  id,
  children,
}: {
  id: string,
  children: React.ReactNode,
}) {
  const { selected, setSelected } = useContext(CheckboxDrawerContext);
  return (
    <CheckboxLabel htmlFor={id}>
      <AsyncCheckbox
        id={id}
        onCheckedChange={async checked => {
          await setSelected(checked ? [...selected, id] : selected.filter(s => s !== id));
        }}
        checked={selected.includes(id)}
      />
      {children}
    </CheckboxLabel>
  )
}

export function CheckboxListDrawer({ children, selected, setSelected, trigger }: {
  children: ReactNode,
  selected: string[],
  setSelected: (selected: string[]) => Promise<void>,
  trigger: ReactNode,
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className={open ? 'open' : undefined} >
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
      </div>
      <SheetContent side="bottom" hideX>
        <CheckboxDrawerContext.Provider value={{ selected, setSelected }}>
          {children}
        </CheckboxDrawerContext.Provider>
      </SheetContent>
    </Sheet>
  )
}
