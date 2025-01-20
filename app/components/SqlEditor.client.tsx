import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useQueryRepository } from "@/hooks/useQueryRepository";
import { useCallback, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};
const SqlEditor = (props: Props) => {
  const [name, setName] = useState("New Query");
  const repo = useQueryRepository();
  const [error, setError] = useState<string | null>(null);

  const handleSaveQuery = useCallback(() => {
    if (!name) {
      setError("Query name is required.");
      return;
    }

    setError(null);
    repo.saveQuery(name, props.value);
  }, [name, props.value, repo]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-semibold">SQL Editor</h2>
            <p>/</p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              required
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Input query name..."
              className={`min-w-120 p-1 h-8 hover:bg-accent`}
            />
            {error && <p className="text-red-500 text-xs w-full">{error}</p>}
          </div>
        </div>
        <Button onClick={handleSaveQuery}>Save Query</Button>
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
