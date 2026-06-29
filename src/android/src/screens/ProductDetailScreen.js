import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRestaurantProducts } from '../api/productsApi';
import { useCart } from '../context/CartContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId, restaurantId } = route.params;
  const { addToCart } = useCart();
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);

  useEffect(() => {
    getRestaurantProducts(restaurantId)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#009de0" /></View>;
  }

  const product = products.find((p) => p.id === productId || p._id === productId);
  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  function toggleExtra(extraId) {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  }

  const extrasCost = selectedExtras.reduce((total, eid) => {
    const extra = products.find((p) => p.id === eid || p._id === eid);
    return total + (extra?.price || 0);
  }, 0);
  const finalPrice = (product.price + extrasCost) * quantity;

  function handleAddToCart() {
    addToCart(product, quantity, selectedExtras);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: product.image }} style={styles.hero} resizeMode="cover" />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{product.name}</Text>
            {product.isPopular && <View style={styles.popularBadge}><Text style={styles.popularText}>Popular</Text></View>}
          </View>
          <Text style={styles.price}>₪{product.price.toFixed(2)}</Text>
          {!!product.description && <Text style={styles.description}>{product.description}</Text>}

          {/* Extras */}
          {product.extras?.length > 0 && (
            <View style={styles.extrasSection}>
              <Text style={styles.extrasTitle}>Optional add-ons</Text>
              {product.extras.map((extraId, i) => {
                const extra = products.find((p) => p.id === extraId || p._id === extraId);
                if (!extra) return null;
                const eid = extra.id || extra._id;
                const selected = selectedExtras.includes(eid);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.extraItem, selected && styles.extraItemSelected]}
                    onPress={() => toggleExtra(eid)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                      {selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.extraName}>{extra.name}</Text>
                    {extra.price > 0 && <Text style={styles.extraPrice}>+₪{extra.price.toFixed(2)}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => q + 1)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.9}>
          <Text style={styles.addBtnText}>Add to order  ₪{finalPrice.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#c43228', fontSize: 15 },
  scroll: { paddingBottom: 16 },
  hero: { width: '100%', height: 240 },
  body: { padding: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontSize: 22, fontWeight: '800', color: '#202125', flex: 1, marginRight: 8 },
  popularBadge: { backgroundColor: '#fef9c3', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  popularText: { fontSize: 12, color: '#854d0e', fontWeight: '600' },
  price: { fontSize: 20, fontWeight: '700', color: '#009de0', marginBottom: 12 },
  description: { fontSize: 14, color: '#7a7d82', lineHeight: 20, marginBottom: 20 },
  extrasSection: { marginTop: 8 },
  extrasTitle: { fontSize: 15, fontWeight: '700', color: '#202125', marginBottom: 12 },
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    marginBottom: 8,
    backgroundColor: '#fafbfc',
    gap: 12,
  },
  extraItemSelected: { borderColor: '#009de0', backgroundColor: '#e6f5fc' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#c8ccd0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#009de0', borderColor: '#009de0' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '800' },
  extraName: { flex: 1, fontSize: 14, color: '#202125', fontWeight: '500' },
  extraPrice: { fontSize: 13, color: '#009de0', fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#fff',
    gap: 12,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0f4f8', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 20, color: '#202125', fontWeight: '700', lineHeight: 24 },
  qtyNum: { fontSize: 17, fontWeight: '700', color: '#202125', minWidth: 24, textAlign: 'center' },
  addBtn: { flex: 1, backgroundColor: '#009de0', borderRadius: 10, paddingVertical: 15, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
