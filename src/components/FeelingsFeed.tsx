import { PolicyCard, SaveButton } from "./PolicyCard";
import { Feeling } from "../types";
import { Badge } from "./Badge";
import { styled } from "../stitches.config";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "./Tabs";
import { PolicyNewsItem } from "./PolicyNewsItem";
import { PolicyFilter } from "./PolicyFilter";

const TagList = styled('div', {
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
})

function Tags({ tags }: { tags: string[] }) {
  return (
    <TagList>
      {
        tags.map(tag => (
          <Badge key={tag} size={2} variant="blue">
            {tag}
          </Badge>
        ))
      }
    </TagList>
  )
}

function FeelingFeedItem({ feeling }: { feeling: Feeling }) {
  return (
    <PolicyNewsItem
      leftButton={
        <SaveButton
          lists={[{
            uuid: "1",
            name: "Saved1",
            _count: { values: 14 }
          }]}
          savedToListIds={[]}
          setSavedToListIds={async (listIds) => alert(listIds)}
        />
      }
      item={{
        policy: feeling.value,
        events: [{
          eventType: 'feeling',
          date: "3 minutes ago",
          feelings: feeling.feelings,
          users: [{
            name: "Unknown Guy"
          }],
          visibility: "onlyme"
        }]
      }}
    />
  )
}

const Stack = styled('div', {
  display: "grid", gap: "32px"
})

const FilterRow = styled('div', {
  display: "flex",
  flexDirection: "row-reverse"
})

export function FeelingsFeed({ feelings, latest, starred, set }: {
  latest: string,
  starred: string[],
  set: (k: string, value: boolean) => void,
  feelings: Feeling[],
}) {
  const starredFeelings = feelings.filter(f => starred.includes(f.date))
  console.log('starredFeelings', starredFeelings)
  return (
    <div>
      <FilterRow>
        <PolicyFilter
          value={{ feelings: 'all' }}
          onChange={() => { }}
          lists={[{
            _count: { values: 7 },
            name: "Special Values",
            uuid: "1"
          }]}
        />
      </FilterRow>
      <Stack>
        {feelings.map(f => (
          <FeelingFeedItem
            key={f.date}
            feeling={f}
          />
        ))}
      </Stack>
    </div>

  )
}

/* <Stack>
          {starredFeelings.map(f => (
            <FeelingFeedItem
              key={f.date}
              feeling={f} />))}
        </Stack> */