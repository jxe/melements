// import logo from "./logo.svg";
// import * as React from "react";
import { useState } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Emotions2ValuesForm } from "./components/Emotions2ValuesForm";
import { PolicyCard } from "./components/PolicyCard";
import { Feeling } from "./types";
// import { EmotionSelect } from "./components/EmotionSelect";
import { StarIcon, StarFilledIcon } from '@radix-ui/react-icons';
import { Badge } from "./components/Badge";
import { styled } from "./stitches.config";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "./components/Tabs";

function useStarred() {
  const json = localStorage.getItem('starred') || "[]"
  const [starred, setStarred] = useState<string[]>(JSON.parse(json))
  function set(k: string, value: boolean) {
    const newValue = value ? [...starred, k] : starred.filter(x => x !== k)
    setStarred(newValue)
    localStorage.setItem('starred', JSON.stringify(newValue))
  }
  return { starred, set }
}

function ToggleStar({ id }: { id: string }) {
  const { starred, set } = useStarred()
  const isStarred = starred.includes(id)
  if (isStarred) return <StarFilledIcon
    // width="20px"
    // height="20px"
    fill="var(--gold-highlight)"
    stroke="black"
    onClick={() => set(id, false)}
  />
  else return <StarIcon onClick={() => set(id, true)} />
}

const Container = styled('div', {
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "400px"
})

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
    <div>
      <Tags tags={feeling.feelings} />
      <div style={{ display: 'flex', gap: "8px" }}>
        <PolicyCard policy={feeling.value} />
        <ToggleStar id={feeling.date} />
      </div>
    </div>
  )
}

const Stack = styled('div', {
  display: "grid", gap: "32px"
})

function FeelingsFeed({ latest }: { latest: string }) {
  const { starred } = useStarred()
  const keys = Object.keys(localStorage).filter(key => key.startsWith("e2v:"))
  const unsorted = keys.map(key => JSON.parse(localStorage.getItem(key) as string)) as Feeling[]
  const feelings = unsorted.filter(v => v.value).sort((a, b) => b.date.localeCompare(a.date));
  const starredFeelings = feelings.filter(f => starred.includes(f.date))
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="starred">Starred</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <Stack>
          {feelings.map(f => (<FeelingFeedItem key={f.date} feeling={f} />))}
        </Stack>
      </TabsContent>
      <TabsContent value="starred">
        <Stack>
          {starredFeelings.map(f => (<FeelingFeedItem key={f.date} feeling={f} />))}
        </Stack>
      </TabsContent>
    </Tabs>
  )
}

function App() {
  const [latest, setLatest] = useState<string>("")
  return (
    <div className="App">
      <header className="App-header">
        <Container>
          {/* <h3 style={{ marginBottom: 0 }}>Emotions to Values</h3> */}
          {/* <EmotionSelect /> */}
          <Emotions2ValuesForm onSave={(data) => {
            const json = JSON.stringify(data)
            localStorage.setItem(`e2v:${data.date}`, json)
            setLatest(data.date)
          }} />
          <div style={{ height: "3em" }} />
          <FeelingsFeed latest={latest} />
          <Button
            chill
            onClick={() => {
              const date = new Date().toISOString()
              const json = JSON.stringify(Object.values(localStorage))
              const blob = new Blob([json], { type: 'text/json' })
              const link = document.createElement("a");
              link.download = `emotions-${date}.json`;
              link.href = window.URL.createObjectURL(blob);
              link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
              const evt = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
              link.dispatchEvent(evt);
              link.remove()
            }}>
            Download
          </Button>
        </Container>
      </header>
    </div>
  );
}

export default App;
