import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";

export function SheetedField({ sheetContent, children }: {
  sheetContent: React.ReactNode,
  children: React.ReactNode,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet modal open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" hideX>
        {sheetContent}
      </SheetContent>
    </Sheet>
  )
}
