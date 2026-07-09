export interface ExampleItem {
  id: string;
  title: string;
}

export async function fetchExampleItems(): Promise<ExampleItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: '1', title: 'First item' },
    { id: '2', title: 'Second item' },
  ];
}
