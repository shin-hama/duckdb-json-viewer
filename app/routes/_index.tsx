import type { MetaFunction } from "@remix-run/node";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import SqlEditor from "@/components/SqlEditor.client";
import { ClientOnly } from "remix-utils/client-only";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "@/components/Sidebar";
import { useDatabase } from "@/providers/DuckDbProvider";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, {
    name: "description",
    content: "Welcome to Remix!",
  }];
};

export default function Index() {
  const [data, setData] = React.useState<object[]>([]);
  const dbContext = useDatabase();
  const test = async () => {
    const { db, connection } = dbContext;
    const jsonRowContent = [
      {
        col1: 1,
        col2: "foo",
        col3: "bar",
        col4: "baz",
        col5: "qux",
        col6: "quux",
      },
      {
        col1: 1,
        col2: "foo",
        col3: "bar",
        col4: "baz",
        col5: "qux",
        col6: "quux",
      },
    ];
    await db.registerFileText("rows.json", JSON.stringify(jsonRowContent));
    await connection.insertJSONFromPath("rows.json", { name: "rows" });

    const table = await connection.query("SELECT * FROM rows");

    console.log(table.toArray().map((row) => row.toJSON()));
    console.log(
      Object.keys(data).map((key) => ({ header: key, accessorKey: key })),
    );
    setData(table.toArray().map((row) => row.toJSON()));
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={15} maxSize={40} defaultSize={20}>
          <Sidebar
            onFileUpload={() => {}}
            onLoadQuery={(query: string) => {}}
            savedQueries={[
              {
                name: "カラム一覧",
                query: "SELECT * FROM data LIMIT 0",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle className="hover:visible" />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={30}>
              <ClientOnly>{() => <SqlEditor />}</ClientOnly>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
              <div className="flex justify-end space-x-2">
                <Button>Save Query</Button>
                <Button onClick={test}>Run</Button>
              </div>
              <div className="h-full">
                <DataTable
                  columns={Object.keys(data[0] ?? {}).map((key) => ({
                    header: key,
                    accessorKey: key,
                  }))}
                  data={data}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
