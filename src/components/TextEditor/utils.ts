import { Editor, EditorState, Modifier, SelectionState } from "draft-js";


export const calculatePosition = (editorRef: Editor) => {
    const selection = window.getSelection();
    if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.editorContainer?.getBoundingClientRect();

        if (rect && editorRect) {
            return {
                top: rect.bottom - editorRect.top + 10,
                left: Math.max(0, rect.left - editorRect.left),
            };
        }
    }
    return { top: 0, left: 0 };
};

export const insertSuggestion = (
    editorState: EditorState,
    suggestion: string
): EditorState => {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = content.getBlockForKey(selection.getStartKey());
    const text = block.getText();
    const match = text.match(/<([a-z]*)$/i);

    if (match) {
        const start = match.index || 0;
        const end = selection.getStartOffset();

        const newSelection = SelectionState.createEmpty(block.getKey()).merge({
            anchorOffset: start + 1,
            focusOffset: end,
        });

        const newContent = Modifier.replaceText(content, newSelection, suggestion);

        const updatedSelection = SelectionState.createEmpty(block.getKey()).merge({
            anchorOffset: start + 1 + suggestion.length,
            focusOffset: start + 1 + suggestion.length,
        });

        return EditorState.forceSelection(
            EditorState.push(editorState, newContent, "insert-characters"),
            updatedSelection
        );
    }

    return editorState;
};
