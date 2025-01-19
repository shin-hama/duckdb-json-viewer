import { getDb } from "@/infrastructures/db";
import { AsyncDuckDB, AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useEffectOnce } from "react-use";

type DatabaseContext = {
  db: AsyncDuckDB;
  connection: AsyncDuckDBConnection;
};
const DuckDbContext = createContext<DatabaseContext | null>(null);

const DuckDbProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [context, setContext] = useState<DatabaseContext | null>(null);

  useEffectOnce(() => {
    setIsLoading(true);
    getDb()
      .then(async (db) => {
        const connection = await db.connect();
        setContext({ db, connection });
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DuckDbContext.Provider value={context}>{children}</DuckDbContext.Provider>
  );
};

const useDatabase = (): DatabaseContext => {
  const context = useContext(DuckDbContext);
  if (context === null) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }

  return context;
};

export { DuckDbProvider, useDatabase };
