import { PolicyCard } from "./PolicyCard";
import { Feeling } from "../types";
import { Badge } from "./Badge";
import { styled } from "../stitches.config";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "./Tabs";
import { PolicyNewsItem } from "./PolicyNewsItem";

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
      item={{
        policy: feeling.value,
        events: [{
          eventType: 'feeling',
          date: "Unknown",
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
            />
          ))}
        </Stack>
      </TabsContent>
      <TabsContent value="starred">
        <Stack>
          {starredFeelings.map(f => (
            <FeelingFeedItem
              key={f.date}
              feeling={f} />))}
        </Stack>
      </TabsContent>
    </Tabs>
  )
}
