import React from "react";

interface AutocompleteDropdownProps {
  suggestions: string[];
  activeIndex: number;
  onMouseEnter: (index: number) => void;
  onClick: (index: number) => void;
  position: { top: number; left: number };
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  suggestions,
  activeIndex,
  onMouseEnter,
  onClick,
  position,
}) => {
  return (
    <ul
      className="autocomplete-list"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={suggestion}
          className={`autocomplete-item ${
            index === activeIndex ? "active" : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            onClick(index);
          }}
          onMouseEnter={() => onMouseEnter(index)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};

export default AutocompleteDropdown;
