import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Input } from "./ui/input";

const SqlEditor = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center space-x-1 p-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-semibold">SQL Editor</h2>
          <p>/</p>
        </div>
        <div>
          <Input
            defaultValue="New Query"
            placeholder="Query Name"
            className="border-0 min-w-120 p-1 h-8 hover:bg-accent"
          />
        </div>
      </div>
      <ReactCodeMirror
        defaultValue="SELECT * FROM table"
        extensions={[sql()]}
        theme={vscodeDark}
        className="flex-1 overflow-auto"
        height="100%"
      />
    </div>
  );
};

export default SqlEditor;
