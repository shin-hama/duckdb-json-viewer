import ReactCodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const SqlEditor = () => {
  return (
    <ReactCodeMirror defaultValue="SELECT * FROM table" extensions={[sql()]} theme={vscodeDark} />
  );
};

export default SqlEditor;
