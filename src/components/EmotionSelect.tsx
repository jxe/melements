import { areNegative, feels } from "../emotions";
import { TagsField } from "./TagsFields";
import { CheckboxList } from "./Checkbox";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { useState } from "react";

interface Props extends Omit<React.ComponentProps<typeof TagsField>, 'tags' | 'placeholder'> {
  feelings: string[]
  onFeelingsChanged: (feelings: string[]) => void
}

export function EmotionSelect({ feelings, onFeelingsChanged, ...props }: Props) {
  const options = { ...feels.negative, ...feels.positive }
  const [open, setOpen] = useState(false);
  return <Sheet modal open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <TagsField
        {...props}
        placeholder="What are you feeling right now?"
        tags={feelings}
        onClear={() => onFeelingsChanged([])}
      />
    </SheetTrigger>
    <SheetContent side="bottom" hideX>
      <Tabs css={{ display: "flex", flexDirection: "column", position: "absolute", inset: 0 }}>
        <TabsList>
          {Object.keys(options).map(tab => (
            <TabsTrigger
              key={tab as string}
              value={tab as string}
              css={{
                backgroundColor: areNegative([tab]) ? 'rgb(201, 203, 221)' : 'rgb(255, 254, 208)',
              }}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(options).map(tab => (
          <TabsContent key={tab as string} css={{ overflowY: "auto" }} value={tab as string}>
            <CheckboxList
              options={(options as any)[tab]}
              selected={feelings}
              onChange={onFeelingsChanged}
            />
          </TabsContent>
        ))}
      </Tabs>
    </SheetContent>
  </Sheet>
}
