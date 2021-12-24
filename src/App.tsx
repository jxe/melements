// import logo from "./logo.svg";
// import * as React from "react";
import { useState } from "react";
import "./App.css";
import { Emotions2ValuesForm } from "./components/Emotions2ValuesForm";
import { PolicyCard } from "./components/PolicyCard";
import { Value } from "./types";
// import { EmotionSelect } from "./components/EmotionSelect";

function ValFeed({ latest }: { latest: string }) {
  const keys = Object.keys(localStorage).filter(key => key.startsWith("e2v:"));
  const feelings = keys.map(key => JSON.parse(localStorage.getItem(key) as string)).filter(v => v.value).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      {feelings.map(f => (<PolicyCard key={f.date} policy={f.value as Value} />))}
    </>
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
        <h3 style={{ marginBottom: 0 }}>Previous</h3>
        <ValFeed latest={latest} />
      </header>
    </div>
  );
}

export default App;
