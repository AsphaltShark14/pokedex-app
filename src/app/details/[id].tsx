import { useLocalSearchParams } from 'expo-router';
import { H2, Paragraph, YStack } from 'tamagui';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <YStack flex={1} items="center" justify="center" gap="$3" p="$4">
      <H2>Details</H2>
      <Paragraph>Showing details for id: {id}</Paragraph>
    </YStack>
  );
}
