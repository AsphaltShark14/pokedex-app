export type ExampleItem = {
  id: string;
  title: string;
};

export const fetchExampleItems = async (): Promise<ExampleItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: '1', title: 'First item' },
    { id: '2', title: 'Second item' },
  ];
};
