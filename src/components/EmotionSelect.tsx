import { feels } from "../emotions";
import { TabbedDrawerMultiselect } from "./TabbedDrawerMultiselect";
import { TagsField } from "./TagsFields";

interface Props extends Omit<React.ComponentProps<typeof TagsField>, 'tags' | 'placeholder'> {
  feelings: string[]
  onFeelingsChanged: (feelings: string[]) => void
}

export function EmotionSelect({ feelings, onFeelingsChanged, ...props }: Props) {
  return <TabbedDrawerMultiselect
    options={{ ...feels.negative, ...feels.positive }}
    selected={feelings}
    setSelected={onFeelingsChanged}
  >
    <TagsField
      {...props}
      placeholder="What are you feeling right now?"
      tags={feelings}
      onClear={() => onFeelingsChanged([])}
    />
  </TabbedDrawerMultiselect>
}
