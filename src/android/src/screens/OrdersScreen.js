import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMyOrders } from '../api/ordersApi';
import { getRestaurantById } from '../api/restaurantsApi';
import { getRestaurantProducts } from '../api/productsApi';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';

function formatDate({ day, month, year, hour, minute }) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(day)}/${pad(month)}/${year} · ${pad(hour)}:${pad(minute)}`;
}

export default function OrdersScreen({ navigation }) {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const [orders, setOrders]           = useState([]);
  const [restaurantMap, setRestaurantMap] = useState({});
  const [productMap, setProductMap]   = useState({});
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (!token) { navigation.navigate('Login'); return; }
    fetchData();
  }, [token]);

  async function fetchData() {
    setLoading(true);
    try {
      const myOrders = await getMyOrders();
      myOrders.sort((a, b) => {
        const ms = (d) => new Date(d.year, d.month - 1, d.day, d.hour, d.minute).getTime();
        return ms(b.date) - ms(a.date);
      });
      setOrders(myOrders);

      const ids = [...new Set(myOrders.map((o) => o.restaurantId))];
      const [rests, prods] = await Promise.all([
        Promise.all(ids.map((id) => getRestaurantById(id).catch(() => null))),
        Promise.all(ids.map((id) => getRestaurantProducts(id).catch(() => []))),
      ]);

      const rMap = {}, pMap = {};
      ids.forEach((id, i) => {
        if (rests[i]) rMap[id] = rests[i];
        (prods[i] || []).forEach((p) => { pMap[p.id || p._id] = p; });
      });
      setRestaurantMap(rMap);
      setProductMap(pMap);
    } catch {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#009de0" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }

  function renderOrder({ item: order }) {
    const restaurant = restaurantMap[order.restaurantId];
    const itemCounts = {};
    order.orderedItems.forEach((pid) => {
      const name = productMap[pid]?.name ?? pid;
      itemCounts[name] = (itemCounts[name] || 0) + 1;
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.restName}>{restaurant?.name ?? 'Restaurant'}</Text>
            <Text style={styles.date}>{formatDate(order.date)}</Text>
          </View>
          {restaurant && (
            <TouchableOpacity
              style={styles.reorderBtn}
              onPress={() => navigation.navigate('Restaurant', { restaurantId: order.restaurantId })}
            >
              <Text style={styles.reorderText}>Order again</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.itemsList}>
          {Object.entries(itemCounts).map(([name, count]) => (
            <View key={name} style={styles.item}>
              <Text style={styles.itemQty}>{count}×</Text>
              <Text style={styles.itemName}>{name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.itemCount}>
          {order.orderedItems.length} item{order.orderedItems.length !== 1 ? 's' : ''}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.heading}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(o) => String(o.id)}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="🍽️"
            title="No orders yet"
            subtitle="Your order history will appear here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#c43228', fontSize: 15 },
  heading: { fontSize: 24, fontWeight: '800', color: '#202125', paddingHorizontal: 20, paddingVertical: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardHeaderLeft: { flex: 1, marginRight: 8 },
  restName: { fontSize: 16, fontWeight: '700', color: '#202125', marginBottom: 3 },
  date: { fontSize: 12, color: '#7a7d82' },
  reorderBtn: { backgroundColor: '#e6f5fc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  reorderText: { color: '#009de0', fontSize: 12, fontWeight: '700' },
  itemsList: { marginBottom: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  itemQty: { width: 28, fontSize: 13, fontWeight: '700', color: '#009de0' },
  itemName: { fontSize: 13, color: '#202125', flex: 1 },
  itemCount: { fontSize: 12, color: '#7a7d82', borderTopWidth: 1, borderTopColor: '#f0f4f8', paddingTop: 8 },
});
