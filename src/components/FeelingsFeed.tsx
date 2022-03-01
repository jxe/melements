import { PolicyCard } from "./PolicyCard";
import { Feeling } from "../types";
import { Badge } from "./Badge";
import { styled } from "../stitches.config";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "./Tabs";

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

function FeelingFeedItem({ feeling, starred, setStarred }: { feeling: Feeling, starred: boolean, setStarred: (b: boolean) => void }) {
  return (
    <div>
      <Tags tags={feeling.feelings} />
      <div style={{ display: 'flex', gap: "8px" }}>
        <PolicyCard
          policy={feeling.value}
          onEdited={() => { }}
        />
      </div>
    </div>
  )
}

const Stack = styled('div', {
  display: "grid", gap: "32px"
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
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="starred">Starred</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <Stack>
          {feelings.map(f => (
            <FeelingFeedItem
              key={f.date}
              feeling={f}
              starred={starred.includes(f.date)}
              setStarred={(b) => set(f.date, b)}
            />
          ))}
        </Stack>
      </TabsContent>
      <TabsContent value="starred">
        <Stack>
          {starredFeelings.map(f => (
            <FeelingFeedItem
              starred={starred.includes(f.date)}
              setStarred={(b) => set(f.date, b)}
              key={f.date}
              feeling={f} />))}
        </Stack>
      </TabsContent>
    </Tabs>
  )
}
