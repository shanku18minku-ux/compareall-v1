import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Vibration,
} from 'react-native';
import { getSearchSchema, CategorySearchSchema } from './SearchSchemas';
import { VoiceSearchModal } from './VoiceSearchModal';

interface DynamicSearchBarProps {
  category: string;
  onSelectCategory: (category: string) => void;
  categoriesList: string[];
  location: { latitude: number; longitude: number; name: string } | null;
  searchValues: { [key: string]: string };
  onChangeValue: (key: string, value: string) => void;
  onSubmit: (effectiveQuery: string) => void;
  isSearching: boolean;
}

export const DynamicSearchBar: React.FC<DynamicSearchBarProps> = ({
  category,
  onSelectCategory,
  categoriesList,
  location,
  searchValues,
  onChangeValue,
  onSubmit,
  isSearching,
}) => {
  const schema: CategorySearchSchema = getSearchSchema(category);
  const [isVoiceModalVisible, setIsVoiceModalVisible] = React.useState(false);

  const handleSuggestionPress = (suggestion: string) => {
    Vibration.vibrate(20);
    if (schema.searchType === 'commute_route') {
      onChangeValue('drop', suggestion);
      const pickup = searchValues.pickup || location?.name || 'Current Location';
      onSubmit(`${pickup} to ${suggestion}`);
    } else if (schema.searchType === 'travel_route') {
      const parts = suggestion.split(' to ');
      onChangeValue('from', parts[0] || '');
      onChangeValue('to', parts[1] || '');
      onSubmit(suggestion);
    } else {
      onChangeValue('query', suggestion);
      onSubmit(suggestion);
    }
  };

  const handleActionSubmit = () => {
    Vibration.vibrate(25);
    if (schema.searchType === 'commute_route') {
      const pickup = searchValues.pickup || location?.name || 'Current Location';
      const drop = searchValues.drop || '';
      if (!drop.trim()) return;
      onSubmit(`${pickup} to ${drop}`);
    } else if (schema.searchType === 'travel_route') {
      const from = searchValues.from || '';
      const to = searchValues.to || '';
      if (!from.trim() && !to.trim()) return;
      onSubmit(`${from} to ${to}`);
    } else {
      const q = searchValues.query || '';
      if (!q.trim()) return;
      onSubmit(q);
    }
  };

  return (
    <View style={styles.container}>
      <VoiceSearchModal 
        visible={isVoiceModalVisible} 
        onClose={() => setIsVoiceModalVisible(false)} 
        onQueryExtracted={(extractedQuery) => {
          setIsVoiceModalVisible(false);
          onChangeValue('query', extractedQuery);
          onSubmit(extractedQuery);
        }} 
      />

      {/* Dynamic Search Layout */}
      {schema.searchType === 'commute_route' ? (
        /* Commute Dual Input Layout (Ola, Rapido, Uber style) */
        <View style={styles.commuteBox}>
          {/* Pickup Field */}
          <View style={styles.routeFieldRow}>
            <Text style={styles.routeIcon}>🟢</Text>
            <View style={styles.routeInputBox}>
              <Text style={styles.routeInputLabel}>Pickup Location</Text>
              <TextInput
                style={styles.routeInput}
                placeholder="Current GPS Location"
                placeholderTextColor="#999"
                value={searchValues.pickup !== undefined ? searchValues.pickup : (location?.name || '')}
                onChangeText={val => onChangeValue('pickup', val)}
              />
            </View>
          </View>

          <View style={styles.routeDivider} />

          {/* Drop Field */}
          <View style={styles.routeFieldRow}>
            <Text style={styles.routeIcon}>🔴</Text>
            <View style={styles.routeInputBox}>
              <Text style={styles.routeInputLabel}>Where to?</Text>
              <TextInput
                style={styles.routeInput}
                placeholder="Enter destination (e.g. Station, Airport, Chowk)..."
                placeholderTextColor="#999"
                value={searchValues.drop || ''}
                onChangeText={val => onChangeValue('drop', val)}
                onSubmitEditing={handleActionSubmit}
                returnKeyType="search"
              />
            </View>
          </View>

          {/* Compare Fares Button */}
          <TouchableOpacity
            style={styles.routeSubmitBtn}
            onPress={handleActionSubmit}
            disabled={isSearching}
          >
            <Text style={styles.routeSubmitBtnText}>
              {isSearching ? 'Comparing Fares...' : '🚗 Compare Fares (Ola, Rapido, Uber)'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : schema.searchType === 'travel_route' ? (
        /* Travel Route Layout (Flight / Train / Bus style) */
        <View style={styles.travelBox}>
          <View style={styles.travelRow}>
            <View style={[styles.travelField, { marginRight: 8 }]}>
              <Text style={styles.travelLabel}>🛫 From</Text>
              <TextInput
                style={styles.travelInput}
                placeholder="Origin City / Station"
                placeholderTextColor="#999"
                value={searchValues.from || ''}
                onChangeText={val => onChangeValue('from', val)}
              />
            </View>
            <View style={styles.travelField}>
              <Text style={styles.travelLabel}>🛬 To</Text>
              <TextInput
                style={styles.travelInput}
                placeholder="Destination City"
                placeholderTextColor="#999"
                value={searchValues.to || ''}
                onChangeText={val => onChangeValue('to', val)}
                onSubmitEditing={handleActionSubmit}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.routeSubmitBtn}
            onPress={handleActionSubmit}
            disabled={isSearching}
          >
            <Text style={styles.routeSubmitBtnText}>
              {isSearching ? 'Searching Tickets...' : '🎫 Compare Tickets (IRCTC, MMT, RedBus)'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Standard Omnibar (Food, Groceries, Medicine, Shopping) */
        <View style={styles.singleSearchBox}>
          <View style={styles.singleInputWrapper}>
            <Text style={styles.singleIcon}>{schema.fields[0]?.icon || '🔍'}</Text>
            <TextInput
              style={styles.singleInput}
              placeholder={schema.fields[0]?.placeholder || 'Search items, dishes...'}
              placeholderTextColor="#999"
              value={searchValues.query || ''}
              onChangeText={val => onChangeValue('query', val)}
              onSubmitEditing={handleActionSubmit}
              returnKeyType="search"
            />
            <TouchableOpacity 
              style={styles.micBtn} 
              onPress={() => setIsVoiceModalVisible(true)}
            >
              <Text style={styles.micIconText}>🎤</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.singleSearchBtn}
            onPress={handleActionSubmit}
            disabled={isSearching}
          >
            <Text style={styles.singleSearchBtnText}>{isSearching ? '...' : 'Search'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Category Pills below search bar */}
      <View style={[styles.categoryScrollBox, { marginTop: 15 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categoriesList.map(cat => {
            const isActive = (cat === category) || (cat === 'Commute' && category === 'Services');
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, isActive && styles.catChipActive]}
                onPress={() => {
                  Vibration.vibrate(15);
                  onSelectCategory(cat);
                }}
              >
                <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>
                  {cat === 'Food' ? '🍔 Food' :
                   cat === 'Commute' ? '🚕 Commute/Cabs' :
                   cat === 'Groceries' ? '🛒 Groceries' :
                   cat === 'Travel' ? '✈️ Travel' :
                   cat === 'Medicine' ? '💊 Medicine' :
                   cat === 'Shopping' ? '🛍️ Shopping' : '✨ ' + cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Quick Filters (Veg/Non-Veg/Rating) */}
      {category === 'Food' && (
        <View style={styles.quickFiltersContainer}>
          <TouchableOpacity style={styles.quickFilterBtn} onPress={() => { Vibration.vibrate(15); onChangeValue('query', (searchValues.query || '') + ' veg'); handleActionSubmit(); }}>
            <Text style={styles.quickFilterText}>🟢 Pure Veg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickFilterBtn} onPress={() => { Vibration.vibrate(15); onChangeValue('query', (searchValues.query || '') + ' non-veg'); handleActionSubmit(); }}>
            <Text style={styles.quickFilterText}>🔴 Non-Veg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickFilterBtn} onPress={() => { Vibration.vibrate(15); onChangeValue('query', (searchValues.query || '') + ' 4+ rating'); handleActionSubmit(); }}>
            <Text style={styles.quickFilterText}>⭐ 4.0+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  categoryScrollBox: {
    marginBottom: 14,
  },
  categoryScroll: {
    paddingRight: 10,
  },
  catChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catChipActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  catChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Single Search Box
  singleSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  singleInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 12,
    height: 50,
  },
  singleIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  singleInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
  },
  micBtn: {
    padding: 8,
    marginLeft: 4,
  },
  micIconText: {
    fontSize: 18,
  },
  singleSearchBtn: {
    backgroundColor: '#007AFF',
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  singleSearchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Commute Box (Ola / Rapido)
  commuteBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  routeFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  routeIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  routeInputBox: {
    flex: 1,
  },
  routeInputLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  routeInput: {
    fontSize: 15,
    color: '#111',
    fontWeight: '600',
    padding: 0,
  },
  routeDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 8,
    marginLeft: 26,
  },
  routeSubmitBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  routeSubmitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Travel Box
  travelBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  travelRow: {
    flexDirection: 'row',
  },
  travelField: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  travelLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  travelInput: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
  },

  // Quick Suggestions Chips
  suggestionsContainer: {
    marginTop: 4,
  },
  suggestionsScroll: {
    alignItems: 'center',
  },
  suggestionsLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginRight: 8,
  },
  suggestionChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  suggestionChipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  quickFiltersContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 4,
  },
  quickFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  quickFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
});
