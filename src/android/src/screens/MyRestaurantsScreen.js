import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { getAllRestaurants } from '../api/restaurantsApi';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

export default function MyRestaurantsScreen({ navigation }) {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);

  const load = useCallback(async () => {
    try {
      const all = await getAllRestaurants();
      const mine = all.filter((r) =>
        r.authorizedUsers?.includes(user?.id) || r.authorizedUsers?.includes(user?._id)
      );
      setRestaurants(mine);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#009de0" /></View>;
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ManageRestaurant', { restaurantId: item.id })}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.image }} style={styles.thumb} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>{item.category}</Text>
          <Text style={styles.rating}>😍 {item.rating?.toFixed(1)}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(r) => String(r.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={
          <EmptyState
            icon="🏪"
            title="No restaurants yet"
            subtitle="Tap Add Restaurant in the Account tab to get started."
          />
        }
        ListHeaderComponent={
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddRestaurant')}>
            <Text style={styles.addBtnText}>＋ Add New Restaurant</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  addBtn: {
    backgroundColor: '#e6f5fc',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#009de0',
    borderStyle: 'dashed',
  },
  addBtnText: { color: '#009de0', fontSize: 15, fontWeight: '700' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  thumb: { width: 64, height: 64, borderRadius: 10 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#202125', marginBottom: 3 },
  meta: { fontSize: 12, color: '#7a7d82', marginBottom: 4 },
  rating: { fontSize: 12, color: '#7a7d82' },
  chevron: { fontSize: 24, color: '#c8ccd0' },
});
