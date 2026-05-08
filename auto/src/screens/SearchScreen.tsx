import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/common/EmptyState';
import { SearchResultItem } from '../components/search/SearchResultItem';
import { CURRENT_LOCATION, PARKING_SPOTS, SEARCH_SUGGESTIONS } from '../data/mockData';
import { useSearchStore } from '../store/searchStore';
import { THEME } from '../theme';
import type { LatLng, PlaceCategory, RootStackParamList, SearchResult } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const categories: { key: PlaceCategory | 'all'; label: string }[] = [
  { key: 'parking', label: '🅿 Зогсоол' },
  { key: 'shop', label: '🏪 Дэлгүүр' },
  { key: 'hospital', label: '🏥 Эмнэлэг' },
  { key: 'food', label: '🍜 Хоол' },
  { key: 'all', label: 'Бүгд' },
];

function distanceLabel(from: LatLng, result: SearchResult) {
  const latitudeMeters = (result.lat - from.latitude) * 111000;
  const longitudeMeters = (result.lng - from.longitude) * 74000;
  const meters = Math.round(Math.sqrt(latitudeMeters * latitudeMeters + longitudeMeters * longitudeMeters));

  if (meters < 1000) {
    return `${meters}м`;
  }

  return `${(meters / 1000).toFixed(1)}км`;
}

function resultMatches(result: SearchResult, query: string) {
  const normalized = query.toLowerCase();
  const haystack = `${result.name} ${result.nameEn} ${result.address} ${result.district}`.toLowerCase();
  return haystack.includes(normalized);
}

function resultCategory(result: SearchResult): PlaceCategory {
  return 'category' in result ? result.category : 'parking';
}

export function SearchScreen({ navigation }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | 'all'>('all');
  const recentSearches = useSearchStore((state) => state.recentSearches);
  const addRecent = useSearchStore((state) => state.addRecent);
  const removeRecent = useSearchStore((state) => state.removeRecent);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 220);
    return () => clearTimeout(timer);
  }, []);

  const allResults = useMemo<SearchResult[]>(() => [...PARKING_SPOTS, ...SEARCH_SUGGESTIONS], []);
  const trimmedQuery = query.trim();

  const popularResults = useMemo(() => {
    if (activeCategory === 'all') {
      return SEARCH_SUGGESTIONS;
    }

    return SEARCH_SUGGESTIONS.filter((place) => place.category === activeCategory);
  }, [activeCategory]);

  const filteredResults = useMemo(
    () =>
      trimmedQuery
        ? allResults.filter((result) => resultMatches(result, trimmedQuery))
        : popularResults,
    [allResults, popularResults, trimmedQuery],
  );

  const handleSelect = (result: SearchResult) => {
    addRecent(result);
    navigation.replace('Route', { destination: result });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.searchHeader}>
          <TouchableOpacity activeOpacity={0.78} onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons color={THEME.colors.textPrimary} name="arrow-back" size={22} />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Хаашаа явах вэ?"
              placeholderTextColor={THEME.colors.textMuted}
              ref={inputRef}
              returnKeyType="search"
              style={styles.input}
              value={query}
            />
            {query.length > 0 ? (
              <TouchableOpacity activeOpacity={0.72} onPress={() => setQuery('')} style={styles.clearButton}>
                <Ionicons color={THEME.colors.textMuted} name="close" size={20} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!trimmedQuery ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Сүүлд хайсан</Text>
              {recentSearches.length > 0 ? (
                recentSearches.map((result) => (
                  <SearchResultItem
                    distanceLabel={distanceLabel(CURRENT_LOCATION, result)}
                    isRecent
                    key={result.id}
                    onPress={handleSelect}
                    onRemove={removeRecent}
                    query={query}
                    result={result}
                  />
                ))
              ) : (
                <Text style={styles.mutedLine}>Одоогоор сүүлийн хайлт алга.</Text>
              )}
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {trimmedQuery ? 'Хайлтын илэрц' : 'Алдартай газрууд'}
            </Text>
            {!trimmedQuery ? (
              <ScrollView
                contentContainerStyle={styles.categoryChips}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {categories.map((category) => {
                  const isActive = activeCategory === category.key;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.76}
                      key={category.key}
                      onPress={() => setActiveCategory(category.key)}
                      style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    >
                      <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : null}

            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <SearchResultItem
                  distanceLabel={distanceLabel(CURRENT_LOCATION, result)}
                  key={result.id}
                  onPress={handleSelect}
                  query={trimmedQuery}
                  result={result}
                />
              ))
            ) : (
              <EmptyState icon="search-outline" title="Хайлт олдсонгүй" />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginRight: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.md,
  },
  categoryChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  categoryChips: {
    paddingBottom: THEME.spacing.sm,
  },
  categoryText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: THEME.colors.bgCard,
  },
  clearButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 36,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: THEME.spacing.md,
    paddingTop: THEME.spacing.xs,
  },
  input: {
    ...THEME.typography.h3,
    color: THEME.colors.textPrimary,
    flex: 1,
    height: 48,
    padding: 0,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: THEME.spacing.md,
    paddingRight: THEME.spacing.xs,
  },
  mutedLine: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    marginBottom: THEME.spacing.sm,
  },
  safeArea: {
    backgroundColor: THEME.colors.bgBase,
    flex: 1,
  },
  searchHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    ...THEME.typography.h2,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.sm,
  },
});
