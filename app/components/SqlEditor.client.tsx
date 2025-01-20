import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  value: string;
  onChange: (value: string) => void;
};
const SqlEditor = (props: Props) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-1">
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
        <Button>Save Query</Button>
      </div>
      <ReactCodeMirror
        extensions={[sql()]}
        theme={vscodeDark}
        {...props}
        height="100%"
        className="flex-1 overflow-auto"
      />
    </div>
  );
};

export default SqlEditor;
