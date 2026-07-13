import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Colors, PokedexBrand } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const AppTabs = () => {
  const { theme } = useAppTheme();
  const colors = Colors[theme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      tintColor={PokedexBrand.red}
      labelStyle={{ selected: { color: PokedexBrand.red } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default AppTabs;
