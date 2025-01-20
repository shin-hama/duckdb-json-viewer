// storageManager.js

import { useMemo } from "react";
import { z } from "zod";

// SQLクエリのスキーマ
const QuerySchema = z.object({
  query: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
type Query = z.infer<typeof QuerySchema>;

// SQLクエリを管理するためのプレフィックス
const SQL_PREFIX = "sql_";

const useQueryRepository = () => {
  const actions = useMemo(() => {
    // SQLクエリの保存
    const saveQuery = (name: string, query: string) => {
      const key = `${SQL_PREFIX}${name}`;
      localStorage.setItem(
        key,
        JSON.stringify({
          query,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );
    };

    // すべてのSQLクエリを取得
    const getAllQueries = (): Record<string, Query> => {
      return Object.keys(localStorage)
        .filter((key) => key.startsWith(SQL_PREFIX))
        .reduce((queries: Record<string, Query>, key) => {
          const name = key.replace(SQL_PREFIX, "");
          const parsedQuery = QuerySchema.safeParse(
            JSON.parse(localStorage.getItem(key) || ""),
          );

          if (parsedQuery.success) {
            queries[name] = parsedQuery.data;
          }

          return queries;
        }, {});
    };

    // 特定のSQLクエリを取得
    const getQuery = (name: string): string | null => {
      const key = `${SQL_PREFIX}${name}`;

      const parsedQuery = QuerySchema.safeParse(
        JSON.parse(localStorage.getItem(key) || ""),
      );

      if (parsedQuery.success) {
        return parsedQuery.data.query;
      }

      return null;
    };

    // SQLクエリの削除
    const deleteQuery = (name: string) => {
      const key = `${SQL_PREFIX}${name}`;
      localStorage.removeItem(key);
    };

    return {
      saveQuery,
      getAllQueries,
      getQuery,
      deleteQuery,
    };
  }, []);

  return actions;
};

export { useQueryRepository };
