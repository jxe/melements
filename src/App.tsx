import { useState } from "react";
import "./App.css";
import { Dialog, DialogTrigger, PolicyNewsItem, Appreciator, Button, PlusButton } from "./components";
import { styled } from "./stitches.config";
import { Appreciation } from "./types";
import { SaveButton } from "./components/PolicyCard";
import { Feeler } from "./components/Feeler";

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
          date: new Date(),
          feelings: feeling.feelings,
          users: [{
            name: "Unknown Guy"
          }],
          visibility: "onlyme",
          imageUrl: feeling.imageUrl,
          location: feeling.location,
        }]
      }}
    />
  )
}

const Stack = styled('div', {
  display: "grid", gap: "32px"
})

export function FeelingsFeed({ feelings }: {
  feelings: Feeling[],
}) {
  return (
    <Stack>
      {feelings.map(f => (
        <FeelingFeedItem
          key={f.date}
          feeling={f}
        />
      ))}
    </Stack>
  )
}

const Container = styled('div', {
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "400px"
})

interface Feeling extends Appreciation {
  date: string,
  visibility?: 'public' | 'onlyme'
}

function App() {
  const [latest, setLatest] = useState<string>("")
  const keys = Object.keys(localStorage).filter(key => key.startsWith("e2v:"))
  const unsorted = keys.map(key => JSON.parse(localStorage.getItem(key) as string)) as Feeling[]
  const feelings = unsorted.filter(v => v.value).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Dialog key={latest}>
            <DialogTrigger asChild>
              <Button>Open Feeler</Button>
            </DialogTrigger>
            <Feeler />
          </Dialog>

          <Dialog key={latest}>
            <DialogTrigger asChild>
              <PlusButton />
            </DialogTrigger>
            <Appreciator
              relatedValues={[]}
              onCancel={() => setLatest(new Date().toISOString())}
              onSave={(result) => {
                if ('uuid' in result.value) {
                  alert("We don't support storing value matches yet")
                  return
                } else {
                  console.log('got', result)
                  const date = new Date().toISOString()
                  const json = JSON.stringify({
                    ...result,
                    date
                  })
                  localStorage.setItem(`e2v:${date}`, json)
                  setLatest(date)
                }
              }} />
          </Dialog>

          <div style={{ height: "1em" }} />
          <FeelingsFeed feelings={feelings} />

          <div style={{ height: "2rem" }} />
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
