import type { AndroidSymbol, SFSymbol } from 'expo-symbols';

import type { EvolutionCondition } from '@/api/pokemon';
import { formatName } from '@/api/pokemon';

export type EvolutionIcon = { ios: SFSymbol; android: AndroidSymbol; web: AndroidSymbol };

export type EvolutionChip = {
  icon: EvolutionIcon;
  label: string;
};

const SPARKLE_ICON: EvolutionIcon = {
  ios: 'sparkles',
  android: 'auto_awesome',
  web: 'auto_awesome',
};

const TRIGGER_ICONS: Record<string, EvolutionIcon> = {
  'level-up': { ios: 'arrow.up.circle.fill', android: 'trending_up', web: 'trending_up' },
  trade: { ios: 'arrow.left.arrow.right.circle.fill', android: 'swap_horiz', web: 'swap_horiz' },
  'use-item': SPARKLE_ICON,
  shed: SPARKLE_ICON,
};

const TRIGGER_LABELS: Record<string, string> = {
  'level-up': 'Level up',
  trade: 'Trade',
  'use-item': 'Use item',
  shed: 'Special condition',
};

const DEFAULT_TRIGGER_ICON: EvolutionIcon = {
  ios: 'questionmark.circle.fill',
  android: 'help',
  web: 'help',
};

export const describeEvolutionTrigger = (
  trigger: string,
): { icon: EvolutionIcon; label: string } => ({
  icon: TRIGGER_ICONS[trigger] ?? DEFAULT_TRIGGER_ICON,
  label: TRIGGER_LABELS[trigger] ?? formatName(trigger),
});

const GENDER_LABELS: Record<number, string> = {
  1: 'Female only',
  2: 'Male only',
};

const RELATIVE_STAT_LABELS: Record<number, string> = {
  [-1]: 'Defense > Attack',
  0: 'Attack = Defense',
  1: 'Attack > Defense',
};

const ITEM_ICON: EvolutionIcon = { ios: 'diamond.fill', android: 'diamond', web: 'diamond' };
const HELD_ITEM_ICON: EvolutionIcon = {
  ios: 'shippingbox.fill',
  android: 'inventory_2',
  web: 'inventory_2',
};
const LEVEL_ICON: EvolutionIcon = {
  ios: 'arrow.up.circle',
  android: 'trending_up',
  web: 'trending_up',
};
const TIME_ICON: EvolutionIcon = { ios: 'clock.fill', android: 'schedule', web: 'schedule' };
const FRIENDSHIP_ICON: EvolutionIcon = { ios: 'heart.fill', android: 'favorite', web: 'favorite' };
const RAIN_ICON: EvolutionIcon = { ios: 'cloud.rain.fill', android: 'rainy', web: 'rainy' };
const UPSIDE_DOWN_ICON: EvolutionIcon = {
  ios: 'iphone.gen3',
  android: 'screen_rotation',
  web: 'screen_rotation',
};
const GENDER_ICON: EvolutionIcon = { ios: 'person.fill', android: 'person', web: 'person' };
const LOCATION_ICON: EvolutionIcon = { ios: 'mappin.circle.fill', android: 'place', web: 'place' };
const MOVE_ICON: EvolutionIcon = { ios: 'bolt.fill', android: 'bolt', web: 'bolt' };
const PARTY_ICON: EvolutionIcon = { ios: 'person.2.fill', android: 'group', web: 'group' };
const STAT_ICON: EvolutionIcon = { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' };
const TRADE_SPECIES_ICON: EvolutionIcon = {
  ios: 'arrow.left.arrow.right.circle.fill',
  android: 'swap_horiz',
  web: 'swap_horiz',
};

export const buildConditionChips = (condition: EvolutionCondition): EvolutionChip[] => {
  const chips: EvolutionChip[] = [];

  if (condition.item) {
    chips.push({ icon: ITEM_ICON, label: condition.item.formattedName });
  }
  if (condition.heldItem) {
    chips.push({ icon: HELD_ITEM_ICON, label: `Holds ${condition.heldItem.formattedName}` });
  }
  if (condition.minLevel !== null) {
    chips.push({ icon: LEVEL_ICON, label: `Lv. ${condition.minLevel}` });
  }
  if (condition.timeOfDay) {
    chips.push({
      icon: TIME_ICON,
      label: condition.timeOfDay === 'day' ? 'During the day' : 'At night',
    });
  }
  if (condition.minHappiness !== null) {
    chips.push({ icon: FRIENDSHIP_ICON, label: 'High Friendship' });
  }
  if (condition.minAffection !== null) {
    chips.push({ icon: FRIENDSHIP_ICON, label: 'High Affection' });
  }
  if (condition.minBeauty !== null) {
    chips.push({ icon: FRIENDSHIP_ICON, label: `Beauty ${condition.minBeauty}+` });
  }
  if (condition.needsOverworldRain) {
    chips.push({ icon: RAIN_ICON, label: 'During rain' });
  }
  if (condition.turnUpsideDown) {
    chips.push({ icon: UPSIDE_DOWN_ICON, label: 'Console upside-down' });
  }
  if (condition.gender !== null && GENDER_LABELS[condition.gender]) {
    chips.push({ icon: GENDER_ICON, label: GENDER_LABELS[condition.gender] });
  }
  if (condition.location) {
    chips.push({ icon: LOCATION_ICON, label: `Near ${condition.location}` });
  }
  if (condition.knownMove) {
    chips.push({ icon: MOVE_ICON, label: `Knows ${condition.knownMove}` });
  }
  if (condition.knownMoveType) {
    chips.push({ icon: MOVE_ICON, label: `Knows a ${condition.knownMoveType}-type move` });
  }
  if (condition.partySpecies) {
    chips.push({ icon: PARTY_ICON, label: `${condition.partySpecies} in party` });
  }
  if (condition.partyType) {
    chips.push({ icon: PARTY_ICON, label: `${condition.partyType}-type in party` });
  }
  if (
    condition.relativePhysicalStats !== null &&
    RELATIVE_STAT_LABELS[condition.relativePhysicalStats]
  ) {
    chips.push({ icon: STAT_ICON, label: RELATIVE_STAT_LABELS[condition.relativePhysicalStats] });
  }
  if (condition.tradeSpecies) {
    chips.push({ icon: TRADE_SPECIES_ICON, label: `Trade for ${condition.tradeSpecies}` });
  }

  return chips;
};

const serializeCondition = (condition: EvolutionCondition): string => JSON.stringify(condition);

export const conditionSetsEqual = (a: EvolutionCondition[], b: EvolutionCondition[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  const serializedA = a.map(serializeCondition).sort();
  const serializedB = b.map(serializeCondition).sort();
  return serializedA.every((value, index) => value === serializedB[index]);
};

export const getPrimaryConditionLabel = (condition: EvolutionCondition): string => {
  const chips = buildConditionChips(condition);
  const trigger = describeEvolutionTrigger(condition.trigger);

  if (condition.trigger === 'level-up' && condition.minLevel !== null) {
    return `Lv. ${condition.minLevel}`;
  }

  return chips[0]?.label ?? trigger.label;
};
