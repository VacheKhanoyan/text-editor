import React from "react";

import TextEditor from "./components/TextEditor/index";

import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Text Editor with Autocomplete</h1>
      <TextEditor />
    </div>
  );
};

export default App;
