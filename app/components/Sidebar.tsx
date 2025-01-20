import { Database, Save, Upload } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { useDatabase } from "@/providers/DuckDbProvider";
import { useQueryRepository } from "@/hooks/useQueryRepository";

type Props = {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadQuery: (query: string) => void;
};
const Sidebar: React.FC<Props> = (
  { onFileUpload, onLoadQuery },
) => {
  // プリセットクエリ
  const presetQueries = [
    {
      name: "全件表示 (10件)",
      query: "SELECT * FROM rows LIMIT 10;",
    },
    {
      name: "件数カウント",
      query: "SELECT COUNT(*) as count FROM rows;",
    },
    {
      name: "カラム一覧",
      query: `SELECT
  column_name,
  data_type,
  character_maximum_length,
  column_default,
  is_nullable
FROM
  information_schema.columns;`,
    },
  ];

  const { getAllQueries } = useQueryRepository();

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

  const savedQueries = useMemo(() => {
    return Object.entries(getAllQueries()).sort((a, b) => {
      return a[1].updatedAt > b[1].updatedAt ? -1 : 1;
    }).map(([name, query]) => ({
      name,
      query: query.query,
    }));
  }, [getAllQueries]);

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
