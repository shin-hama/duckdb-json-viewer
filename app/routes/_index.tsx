import type { MetaFunction } from '@remix-run/node';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { getDb } from '@/infrastructures/db';
import { DataTable } from '@/components/DataTable';
import SqlEditor from '@/components/SqlEditor.client';
import { ClientOnly } from 'remix-utils/client-only';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  const [data, setData] = React.useState<object[]>([]);
  const test = async () => {
    const db = await getDb();
    const c = await db.connect();
    const jsonRowContent = [
      { col1: 1, col2: 'foo' },
      { col1: 2, col2: 'bar' },
    ];
    await db.registerFileText('rows.json', JSON.stringify(jsonRowContent));
    await c.insertJSONFromPath('rows.json', { name: 'rows' });

    const table = await c.query('SELECT * FROM rows');

    console.log(table.toArray().map((row) => row.toJSON()));
    console.log(Object.keys(data).map((key) => ({ header: key, accessorKey: key })));
    setData(table.toArray().map((row) => row.toJSON()));
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={15} maxSize={40} defaultSize={20}>
          <div>
            <p>Sidebar</p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <ClientOnly>{() => <SqlEditor />}</ClientOnly>
              <Button variant="default" onClick={test}>
                test
              </Button>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <DataTable
                columns={Object.keys(data[0] ?? {}).map((key) => ({
                  header: key,
                  accessorKey: key,
                }))}
                data={data}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
