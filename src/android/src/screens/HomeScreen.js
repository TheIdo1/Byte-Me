import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, ScrollView, FlatList,
  TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAllRestaurants } from '../api/restaurantsApi';
import { searchQuery as searchApi } from '../api/searchApi';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from '../components/RestaurantCard';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import EmptyState from '../components/EmptyState';

function haversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toCardProps(r, userLat, userLon) {
  const dist = haversineDistance(userLat, userLon, r.address?.lat, r.address?.long);
  let deliveryTime, deliveryFee;
  if (dist === Infinity || dist > 25) {
    deliveryTime = '45-60 min';
    deliveryFee  = 25;
  } else {
    const min = Math.max(20, Math.round(15 + dist * 4));
    deliveryTime = `${min}-${min + 10} min`;
    deliveryFee  = 10 + Math.round(dist * 2);
  }
  return {
    id: r.id,
    name: r.name,
    imageUrl: r.image,
    rating: r.rating,
    isSponsored: r.isSponsored,
    promotion: r.promotionalMessage,
    tags: r.subcategories?.length ? r.subcategories : [r.category].filter(Boolean),
    deliveryTime,
    deliveryFee,
  };
}

function RestaurantSection({ title, restaurants, onPress }) {
  if (!restaurants.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={restaurants}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} onPress={() => onPress(item.id)} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
      />
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [searchText, setSearchText]   = useState('');
  const [query, setQuery]             = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const userLat = user?.address?.lat ?? 32.071297;
  const userLon = user?.address?.long ?? 34.844649;

  async function loadRestaurants() {
    try {
      const data = await getAllRestaurants();
      setRestaurants(data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }

  useEffect(() => { loadRestaurants(); }, []);

  useEffect(() => {
    if (!query.trim()) { setSearchResults(null); return; }
    setSearchLoading(true);
    searchApi(query)
      .then(setSearchResults)
      .catch(() => setSearchResults(null))
      .finally(() => setSearchLoading(false));
  }, [query]);

  const sorted = useMemo(() => {
    return [...restaurants].sort((a, b) => {
      if (a.isSponsored !== b.isSponsored) return b.isSponsored ? 1 : -1;
      const dA = haversineDistance(userLat, userLon, a.address?.lat, a.address?.long);
      const dB = haversineDistance(userLat, userLon, b.address?.lat, b.address?.long);
      if (dA !== dB) return dA - dB;
      return (a.category || '').localeCompare(b.category || '');
    });
  }, [restaurants, userLat, userLon]);

  const filtered = selectedCategory
    ? sorted.filter((r) => r.category === selectedCategory)
    : sorted;

  const sponsored  = filtered.filter((r) => r.isSponsored);
  const categories = [...new Set(filtered.map((r) => r.category).filter(Boolean))];

  function goToRestaurant(id) {
    navigation.navigate('Restaurant', { restaurantId: id });
  }

  function submitSearch() {
    setQuery(searchText.trim());
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#009de0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={[styles.searchBar, { paddingTop: insets.top + 8 }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants & dishes..."
          placeholderTextColor="#b0b4ba"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={submitSearch}
          returnKeyType="search"
        />
        {!!searchText && (
          <TouchableOpacity onPress={() => { setSearchText(''); setQuery(''); }}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <CategoryBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadRestaurants(); }} />}
      >
        {/* Search results */}
        {!!query && (
          <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
            <Text style={styles.searchLabel}>Results for "{query}"</Text>
            {searchLoading && <ActivityIndicator color="#009de0" />}
            {searchResults && !searchLoading && (
              <>
                {(searchResults.restaurants ?? []).length > 0 && (
                  <>
                    <Text style={styles.subLabel}>Restaurants</Text>
                    {(searchResults.restaurants ?? []).map((r) => (
                      <TouchableOpacity key={r.id} onPress={() => goToRestaurant(r.id)} style={{ marginBottom: 10 }}>
                        <RestaurantCard restaurant={toCardProps(r, userLat, userLon)} onPress={() => goToRestaurant(r.id)} />
                      </TouchableOpacity>
                    ))}
                  </>
                )}
                {(searchResults.products ?? []).length > 0 && (
                  <>
                    <Text style={styles.subLabel}>Dishes</Text>
                    {(searchResults.products ?? []).map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onPress={() => navigation.navigate('Restaurant', { restaurantId: p.restaurantId })}
                      />
                    ))}
                  </>
                )}
                {!searchResults.restaurants?.length && !searchResults.products?.length && (
                  <EmptyState icon="🔍" title={`No results for "${query}"`} subtitle="Try a different search term." />
                )}
              </>
            )}
          </View>
        )}

        {/* Normal home feed */}
        {!query && (
          <>
            <RestaurantSection
              title="Sponsored"
              restaurants={sponsored.map((r) => toCardProps(r, userLat, userLon))}
              onPress={goToRestaurant}
            />
            {categories.map((cat) => (
              <RestaurantSection
                key={cat}
                title={cat}
                restaurants={filtered.filter((r) => r.category === cat).map((r) => toCardProps(r, userLat, userLon))}
                onPress={goToRestaurant}
              />
            ))}
            {filtered.length === 0 && (
              <EmptyState icon="🍔" title="No restaurants yet" subtitle="Check back soon — new restaurants are added regularly." />
            )}
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#202125',
  },
  clearBtn: { fontSize: 16, color: '#7a7d82', paddingHorizontal: 4 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#202125', paddingHorizontal: 16, marginBottom: 12 },
  searchLabel: { fontSize: 16, fontWeight: '700', color: '#202125', marginBottom: 12 },
  subLabel: { fontSize: 14, fontWeight: '600', color: '#7a7d82', marginBottom: 8, marginTop: 4 },
});
