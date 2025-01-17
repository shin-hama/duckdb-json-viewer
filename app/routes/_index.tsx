import type { MetaFunction } from '@remix-run/node';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { getDb } from '@/infrastructures/db';
import { DataTable } from '@/components/DataTable';
import SqlEditor from '@/components/SqlEditor.client';
import { ClientOnly } from 'remix-utils/client-only';

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
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img src="/logo-light.png" alt="Remix" className="block w-full dark:hidden" />
            <img src="/logo-dark.png" alt="Remix" className="hidden w-full dark:block" />
          </div>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <Button variant="default" onClick={test}>
            test
          </Button>

          <div className="w-80">
            <ClientOnly>{() => <SqlEditor />}</ClientOnly>
          </div>
          {data.length > 0 && (
            <DataTable
              columns={Object.keys(data[0] ?? {}).map((key) => ({ header: key, accessorKey: key }))}
              data={data}
            />
          )}
        </nav>
      </div>
    </div>
  );
}
