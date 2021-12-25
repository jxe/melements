// import logo from "./logo.svg";
// import * as React from "react";
import { useState } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Emotions2ValuesForm } from "./components/Emotions2ValuesForm";
import { PolicyCard } from "./components/PolicyCard";
import { Value } from "./types";
// import { EmotionSelect } from "./components/EmotionSelect";

function ValFeed({ latest }: { latest: string }) {
  const keys = Object.keys(localStorage).filter(key => key.startsWith("e2v:"));
  const feelings = keys.map(key => JSON.parse(localStorage.getItem(key) as string)).filter(v => v.value).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div
      style={{ display: "grid", gap: "16px" }}
    >
      {feelings.map(f => (<PolicyCard key={f.date} policy={f.value as Value} />))}
    </div>
  )
}

function App() {
  const [latest, setLatest] = useState<string>("")
  return (
    <div className="App">
      <header className="App-header">
        {/* <h3 style={{ marginBottom: 0 }}>Emotions to Values</h3> */}
        {/* <EmotionSelect /> */}
        <Emotions2ValuesForm onSave={({ feelings, value }) => {
          const date = new Date().toISOString()
          const data = { date, feelings, value }
          const json = JSON.stringify(data)
          localStorage.setItem(`e2v:${date}`, json)
          setLatest(date)
        }} />
        <div style={{ height: "3em" }} />
        <ValFeed latest={latest} />
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
      </header>
    </div>
  );
}

export default App;
