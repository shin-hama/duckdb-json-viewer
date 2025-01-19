import { Database, Save, Upload } from "lucide-react";
import React, { useCallback } from "react";
import { Button } from "./ui/button";
import { useDatabase } from "@/providers/DuckDbProvider";

type Props = {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  savedQueries: { name: string; query: string }[];
  onLoadQuery: (query: string) => void;
};
const Sidebar: React.FC<Props> = (
  { onFileUpload, savedQueries, onLoadQuery },
) => {
  // プリセットクエリ
  const presetQueries = [
    {
      name: "全件表示 (10件)",
      query: "SELECT * FROM data LIMIT 10",
    },
    {
      name: "件数カウント",
      query: "SELECT COUNT(*) as count FROM data",
    },
    {
      name: "カラム一覧",
      query: "SELECT * FROM data LIMIT 0",
    },
  ];

  const { db, connection } = useDatabase();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("file upload");
      console.log(event);
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        await db.registerFileBuffer(
          "rows.json",
          new Uint8Array(await file.arrayBuffer()),
        );

        await connection.query(
          `CREATE TABLE IF NOT EXISTS rows AS SELECT * FROM read_json('rows.json')`,
        );

        onFileUpload(event);
      } catch (e) {
        console.error(e);
        return;
      }

      // onFileUpload(event);
    },
    [db, connection],
  );

  return (
    <div className="h-full flex flex-col gap-8 p-4">
      {/* ファイルアップロード部分 */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">ファイル</h2>
        <Button asChild variant="ghost" className="w-full justify-start">
          <label className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>ファイルアップロード</span>
            <input
              type="file"
              accept=".jsonl,.log"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </Button>
      </div>

      {/* SQLテンプレート部分 */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">SQLテンプレート</h2>
        <div className="space-y-1">
          {presetQueries.map((preset, index) => (
            <Button
              key={index}
              onClick={() => onLoadQuery(preset.query)}
              variant="ghost"
              className="w-full justify-start"
            >
              <Database className="w-4 h-4" />
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* 保存済みSQL部分 */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">
          保存済みSQL ({savedQueries.length})
        </h2>
        <div className="space-y-1">
          {savedQueries.map((saved, index) => (
            <Button
              key={index}
              onClick={() => onLoadQuery(saved.query)}
              variant="ghost"
              className="w-full justify-start"
            >
              <Save className="w-4 h-4" />
              {saved.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
