import { useState } from "react";
import "./App.css";
import { Dialog, DialogTrigger } from "./components";
import { Appreciator } from "./components/Appreciator2";
import { Button } from "./components/Button";
import { FeelingsFeed } from "./components/FeelingsFeed";
import { styled } from "./stitches.config";
import { Feeling } from "./types";

function useStarred() {
  const json = localStorage.getItem('starred') || "[]"
  const [starred, setStarred] = useState<string[]>(JSON.parse(json))
  function set(k: string, value: boolean) {
    const newValue = value ? [...starred, k] : starred.filter(x => x !== k)
    setStarred(newValue)
    localStorage.setItem('starred', JSON.stringify(newValue))
    console.log('starred', newValue)
  }
  return { starred, set }
}

const Container = styled('div', {
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: "400px"
})

function App() {
  const [latest, setLatest] = useState<string>("")
  const keys = Object.keys(localStorage).filter(key => key.startsWith("e2v:"))
  const unsorted = keys.map(key => JSON.parse(localStorage.getItem(key) as string)) as Feeling[]
  const feelings = unsorted.filter(v => v.value).sort((a, b) => b.date.localeCompare(a.date));
  const { starred, set } = useStarred()
  return (
    <div className="App">
      <header className="App-header">
        <Container>
          {/* <h3 style={{ marginBottom: 0 }}>Emotions to Values</h3> */}
          {/* <EmotionSelect /> */}

          <Dialog key={latest}>
            <DialogTrigger asChild>
              <Button>New Appreciation</Button>
            </DialogTrigger>
            <Appreciator onSave={(result) => {
              if ('uuid' in result.value) {
                alert("We don't support storing value matches yet")
                return
              } else {
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
          <FeelingsFeed
            feelings={feelings}
            latest={latest} starred={starred} set={set} />

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
