import type { MetaFunction } from "@remix-run/node";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { getDb } from "@/infrastructures/db";
import { DataTable } from "@/components/DataTable";
import SqlEditor from "@/components/SqlEditor.client";
import { ClientOnly } from "remix-utils/client-only";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "@/components/Sidebar";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, {
    name: "description",
    content: "Welcome to Remix!",
  }];
};

export default function Index() {
  const [data, setData] = React.useState<object[]>([]);
  const test = async () => {
    const db = await getDb();
    const c = await db.connect();
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
    await c.insertJSONFromPath("rows.json", { name: "rows" });

    const table = await c.query("SELECT * FROM rows");

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
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <ClientOnly>{() => <SqlEditor />}</ClientOnly>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
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
