import { GlobeIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Badge } from "./Badge";
import { Checkbox, CheckboxLabel } from "./Checkbox"
import { Sheet, SheetTrigger, SheetContent } from "./Sheet";

export function VisibilityTag({ visibility, setVisibility }: {
  visibility: 'public' | 'onlyme',
  setVisibility: (x: 'public' | 'onlyme') => void
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet modal open={open} onOpenChange={setOpen}>
      <div className={open ? 'open' : undefined} >
        <SheetTrigger asChild>
          {visibility === 'public' ?
            <Badge><GlobeIcon /> Public</Badge> :
            <Badge><LockClosedIcon />Only Me</Badge>}
        </SheetTrigger>
      </div>
      <SheetContent side="bottom" hideX>
        <CheckboxLabel htmlFor="visibility">
          <Checkbox id="visibility" checked={visibility === 'public'} onCheckedChange={(b) => {
            setVisibility(b ? 'public' : 'onlyme')
          }} />
          Share with the public
        </CheckboxLabel>
      </SheetContent>
    </Sheet>
  )
}
