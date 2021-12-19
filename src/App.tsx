// import logo from "./logo.svg";
// import * as React from "react";
import "./App.css";
import { Emotions2ValuesForm } from "./components/Emotions2ValuesForm";
import { PolicyCard } from "./components/PolicyCard";
import { Value } from "./types";
// import { EmotionSelect } from "./components/EmotionSelect";

function ValFeed() {
  const keys = Object.keys(localStorage).filter(key => key.startsWith("e2v:"));
  const values = keys.map(key => JSON.parse(localStorage.getItem(key) as string)).filter(v => v.value);
  return (
    <>
      {values.map(value => (<PolicyCard key={value.date} policy={value as Value} />))}
    </>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3 style={{ marginBottom: 0 }}>Emotions to Values</h3>
        {/* <EmotionSelect /> */}
        <Emotions2ValuesForm />
        <h3 style={{ marginBottom: 0 }}>Previous</h3>
        <ValFeed />
      </header>
    </div>
  );
}

export default App;
