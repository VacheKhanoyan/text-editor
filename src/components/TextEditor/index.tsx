import React, { useState, useRef } from "react";
import { Editor, EditorState, getDefaultKeyBinding } from "draft-js";
import "draft-js/dist/Draft.css";

import AutocompleteDropdown from "./AutocompleteDropdown";
import { calculatePosition, insertSuggestion } from "./utils";
import HTML_TAGS from "./htmlTags";

import "./TextEditor.css";

const TextEditor: React.FC = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [autocompleteVisible, setAutocompleteVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const editorRef = useRef<Editor>(null);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const handleEditorChange = (newState: EditorState) => {
    const content = newState.getCurrentContent();
    const selection = newState.getSelection();
    const block = content.getBlockForKey(selection.getStartKey());
    const text = block.getText();
    const offset = selection.getStartOffset();

    const match = text.slice(0, offset).match(/<([a-z]*)$/i);
    if (match) {
      const matchString = match[1];
      const filteredSuggestions = HTML_TAGS.filter((tag) =>
        tag.startsWith(matchString)
      );

      setSuggestions(filteredSuggestions);
      setAutocompleteVisible(true);
      setActiveSuggestionIndex(0);

      setTimeout(() => {
        if (editorRef.current) {
          const newPosition = calculatePosition(editorRef.current);
          setPosition(newPosition);
        }
      }, 0);
    } else {
      setAutocompleteVisible(false);
    }

    setEditorState(newState);
  };

  const handleKeyCommand = (command: string): "handled" | "not-handled" => {
    if (!autocompleteVisible) return "not-handled";

    switch (command) {
      case "next-suggestion":
        setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        return "handled";
      case "previous-suggestion":
        setActiveSuggestionIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
        return "handled";
      case "select-suggestion":
        setEditorState((state) =>
          insertSuggestion(state, suggestions[activeSuggestionIndex])
        );
        setAutocompleteVisible(false);
        return "handled";
      case "close-suggestion":
        setAutocompleteVisible(false);
        return "handled";
      default:
        return "not-handled";
    }
  };

  const keyBindingFn = (event: React.KeyboardEvent): string | null => {
    if (!autocompleteVisible) return getDefaultKeyBinding(event);

    if (event.key === "ArrowDown") return "next-suggestion";
    if (event.key === "ArrowUp") return "previous-suggestion";
    if (event.key === "Enter" || event.key === "Tab")
      return "select-suggestion";
    if (event.key === "Escape") return "close-suggestion";

    return getDefaultKeyBinding(event);
  };

  return (
    <div className="editor-wrapper" onClick={focusEditor}>
      <div className="text-editor-container">
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
          placeholder="Type '<' to see suggestions..."
        />
      </div>
      {autocompleteVisible && (
        <AutocompleteDropdown
          suggestions={suggestions}
          activeIndex={activeSuggestionIndex}
          onMouseEnter={(index) => setActiveSuggestionIndex(index)}
          onClick={(index) => {
            setEditorState((state) =>
              insertSuggestion(state, suggestions[index])
            );
            setAutocompleteVisible(false);
          }}
          position={position}
        />
      )}
    </div>
  );
};

export default TextEditor;
