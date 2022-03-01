import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "@radix-ui/react-icons";
import { Filter, List } from "../types";
import { Select, SelectContent, SelectGroup, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, SelectViewport } from "./Select";

export function PolicyFilter({ lists, value, onChange }: {
  lists: List[]
  value: Filter,
  onChange: (newValue: Filter) => void
}) {
  return <Select
    value={'listUuid' in value ? value.listUuid : value.feelings}
    onValueChange={(x) => {
      onChange(
        x === 'all' ?
          { feelings: "all" }
          : x === 'mine' ?
            { feelings: "mine" }
            : { listUuid: x }
      )
    }}>
    <SelectTrigger filter>
      <SelectValue tag />
      <SelectIcon>
        <ChevronDownIcon />
      </SelectIcon>
    </SelectTrigger>
    <SelectContent>
      <SelectScrollUpButton>
        <ChevronUpIcon />
      </SelectScrollUpButton>
      <SelectViewport>
        <SelectGroup>
          <SelectLabel>Feelings</SelectLabel>
          <SelectItem value="mine">
            <SelectItemText>My feelings</SelectItemText>
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
          <SelectItem value="all">
            <SelectItemText>All Feelings</SelectItemText>
            <SelectItemIndicator>
              <CheckIcon />
            </SelectItemIndicator>
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />

        <SelectGroup>
          <SelectLabel>Lists</SelectLabel>
          {lists.map(l => (
            <SelectItem value={l.uuid}>
              <SelectItemText>{l.name} ({l._count.values})</SelectItemText>
              <SelectItemIndicator>
                <CheckIcon />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectViewport>
      <SelectScrollDownButton>
        <ChevronDownIcon />
      </SelectScrollDownButton>
    </SelectContent>
  </Select >
}
