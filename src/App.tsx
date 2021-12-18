// import logo from "./logo.svg";
// import * as React from "react";
import "./App.css";
import { Emotions2ValuesForm } from "./components/Emotions2ValuesForm";
// import { EmotionSelect } from "./components/EmotionSelect";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3 style={{ marginBottom: 0 }}>Emotions to Values</h3>
        {/* <EmotionSelect /> */}
        <Emotions2ValuesForm />
      </header>
    </div>
  );
}

export default App;
