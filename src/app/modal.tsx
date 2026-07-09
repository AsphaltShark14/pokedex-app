import { Button, H2, Paragraph, Spinner, YStack } from 'tamagui';

import { useExampleQuery } from '@/api/use-example-query';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function ModalScreen() {
  const { data, isLoading, isError } = useExampleQuery();
  const { toggleTheme } = useAppTheme();

  return (
    <YStack flex={1} items="center" justify="center" gap="$3" p="$4">
      <H2>Modal</H2>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Paragraph>Something went wrong loading the example items.</Paragraph>
      ) : (
        data?.map((item) => <Paragraph key={item.id}>{item.title}</Paragraph>)
      )}
      <Button onPress={toggleTheme}>Toggle theme</Button>
    </YStack>
  );
}
