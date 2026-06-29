import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { getRestaurantById } from '../api/restaurantsApi';
import { getRestaurantProducts } from '../api/productsApi';
import { createOrder } from '../api/ordersApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function RestaurantScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const { token } = useAuth();
  const { cartItems, totalItems, initCart, addToCart, removeFromCart, clearCart, cartRestaurantId } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError]   = useState(null);
  const [placing, setPlacing]         = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    initCart(restaurantId);
  }, [restaurantId]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [rest, prods] = await Promise.all([
          getRestaurantById(restaurantId),
          getRestaurantProducts(restaurantId),
        ]);
        setRestaurant(rest);
        setProducts(prods);
        navigation.setOptions({ title: rest.name });
      } catch (err) {
        setError('Failed to load restaurant. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId]);

  const popular = products.filter((p) => p.isPopular);
  const categories = restaurant
    ? restaurant.subcategories.filter(
        (cat) => cat !== 'extras' && products.some((p) => p.category === cat)
      )
    : [];

  function openProduct(product) {
    navigation.navigate('ProductDetail', { productId: product.id || product._id, restaurantId });
  }

  function getItemTotal(item) {
    const extrasCost = item.selectedExtras.reduce((sum, extraId) => {
      const extra = products.find((p) => p.id === extraId || p._id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    return (item.product.price + extrasCost) * item.quantity;
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);

  async function handlePlaceOrder() {
    if (cartItems.length === 0) return;
    if (!token) { navigation.navigate('Login'); return; }
    setPlacing(true);
    setOrderError(null);
    const orderedItems = cartItems.flatMap((item) => {
      const ids = [];
      for (let i = 0; i < item.quantity; i++) {
        ids.push(item.product.id || item.product._id);
        item.selectedExtras.forEach((eid) => ids.push(eid));
      }
      return ids;
    });
    try {
      await createOrder({ restaurantId, orderedItems });
      clearCart();
      setOrderSuccess(true);
    } catch {
      setOrderError('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#009de0" /></View>;
  }
  if (error || !restaurant) {
    return <View style={styles.center}><Text style={styles.errorText}>{error ?? 'Restaurant not found'}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Hero image */}
        <Image source={{ uri: restaurant.image }} style={styles.hero} resizeMode="cover" />

        {/* Restaurant info */}
        <View style={styles.infoBox}>
          <Text style={styles.restName}>{restaurant.name}</Text>
          <Text style={styles.restMeta}>{restaurant.category}{restaurant.description ? ` · ${restaurant.description}` : ''}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.stat}>😍 {restaurant.rating?.toFixed(1)}</Text>
            <Text style={styles.statDot}>·</Text>
            <Text style={styles.stat}>🚴 35-45 min</Text>
            {restaurant.promotionalMessage && (
              <>
                <Text style={styles.statDot}>·</Text>
                <Text style={styles.stat}>🏷️ {restaurant.promotionalMessage}</Text>
              </>
            )}
          </View>
        </View>

        {/* Category tabs */}
        {categories.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catBar} contentContainerStyle={styles.catBarContent}>
            {popular.length > 0 && (
              <TouchableOpacity style={[styles.catTab, activeCategory === 'popular' && styles.catTabActive]} onPress={() => setActiveCategory('popular')}>
                <Text style={[styles.catTabText, activeCategory === 'popular' && styles.catTabTextActive]}>Most ordered</Text>
              </TouchableOpacity>
            )}
            {categories.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.catTab, activeCategory === cat && styles.catTabActive]} onPress={() => setActiveCategory(cat)}>
                <Text style={[styles.catTabText, activeCategory === cat && styles.catTabTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.menu}>
          {/* Popular section */}
          {popular.length > 0 && (!activeCategory || activeCategory === 'popular') && (
            <View style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>Most ordered</Text>
              {popular.map((p) => (
                <ProductCard key={p.id || p._id} product={p} onPress={() => openProduct(p)} />
              ))}
            </View>
          )}

          {/* Category sections */}
          {categories
            .filter((cat) => !activeCategory || activeCategory === cat)
            .map((cat) => {
              const catProducts = products.filter((p) => p.category === cat);
              return (
                <View key={cat} style={styles.menuSection}>
                  <Text style={styles.menuSectionTitle}>{cat}</Text>
                  {catProducts.map((p) => (
                    <ProductCard key={p.id || p._id} product={p} onPress={() => openProduct(p)} />
                  ))}
                </View>
              );
            })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cart FAB */}
      {totalItems > 0 && (
        <TouchableOpacity style={styles.cartFab} onPress={() => setCartVisible(true)} activeOpacity={0.9}>
          <Text style={styles.cartFabText}>🛒 View Cart ({totalItems}) · ₪{totalPrice.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      {/* Cart modal */}
      <Modal visible={cartVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setCartVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Order</Text>
            <TouchableOpacity onPress={() => setCartVisible(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {orderSuccess ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Order Placed!</Text>
              <Text style={styles.successSub}>Your order has been sent to the restaurant.</Text>
              <TouchableOpacity style={styles.btn} onPress={() => { setOrderSuccess(false); setCartVisible(false); }}>
                <Text style={styles.btnText}>Start New Order</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={cartItems}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item, index }) => {
                  const itemTotal = getItemTotal(item);
                  return (
                    <View style={styles.cartItem}>
                      <View style={styles.cartItemTop}>
                        <Text style={styles.cartItemQty}>{item.quantity}×</Text>
                        <Text style={styles.cartItemName}>{item.product.name}</Text>
                        <TouchableOpacity onPress={() => removeFromCart(index)}>
                          <Text style={styles.removeBtn}>✕</Text>
                        </TouchableOpacity>
                      </View>
                      {item.selectedExtras.length > 0 && (
                        <View style={styles.extrasRow}>
                          {item.selectedExtras.map((eid) => {
                            const extra = products.find((p) => p.id === eid || p._id === eid);
                            return extra ? <Text key={eid} style={styles.extraTag}>+ {extra.name}</Text> : null;
                          })}
                        </View>
                      )}
                      <Text style={styles.cartItemPrice}>₪{itemTotal.toFixed(2)}</Text>
                    </View>
                  );
                }}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={<Text style={styles.emptyCart}>Your cart is empty</Text>}
              />

              {cartItems.length > 0 && (
                <View style={styles.cartFooter}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>₪{totalPrice.toFixed(2)}</Text>
                  </View>
                  {orderError && <Text style={styles.orderError}>{orderError}</Text>}
                  <TouchableOpacity
                    style={[styles.btn, placing && { opacity: 0.6 }]}
                    onPress={token ? handlePlaceOrder : () => { setCartVisible(false); navigation.navigate('Login'); }}
                    disabled={placing}
                  >
                    {placing
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={styles.btnText}>{token ? `Confirm Order · ₪${totalPrice.toFixed(2)}` : 'Log in to place your order'}</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
                    <Text style={styles.clearBtnText}>Clear cart</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#c43228', fontSize: 15 },
  hero: { width: '100%', height: 220 },
  infoBox: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  restName: { fontSize: 22, fontWeight: '800', color: '#202125', marginBottom: 4 },
  restMeta: { fontSize: 13, color: '#7a7d82', marginBottom: 8 },
  statsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  stat: { fontSize: 13, color: '#7a7d82' },
  statDot: { color: '#c8ccd0' },
  catBar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  catBarContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  catTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f4f8' },
  catTabActive: { backgroundColor: '#e6f5fc', borderWidth: 1.5, borderColor: '#009de0' },
  catTabText: { fontSize: 13, fontWeight: '500', color: '#202125' },
  catTabTextActive: { color: '#009de0', fontWeight: '700' },
  menu: { padding: 16 },
  menuSection: { marginBottom: 24 },
  menuSectionTitle: { fontSize: 17, fontWeight: '700', color: '#202125', marginBottom: 12 },
  cartFab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#009de0',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#009de0',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cartFabText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#202125' },
  closeBtn: { fontSize: 18, color: '#7a7d82', padding: 4 },
  cartItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f4f8' },
  cartItemTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cartItemQty: { fontSize: 14, fontWeight: '700', color: '#009de0', width: 28 },
  cartItemName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#202125' },
  removeBtn: { color: '#7a7d82', fontSize: 14, paddingLeft: 8 },
  extrasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingLeft: 28, marginBottom: 4 },
  extraTag: { fontSize: 11, color: '#009de0', backgroundColor: '#e6f5fc', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  cartItemPrice: { fontSize: 13, color: '#7a7d82', paddingLeft: 28 },
  emptyCart: { textAlign: 'center', color: '#7a7d82', fontSize: 15, padding: 40 },
  cartFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#e9ecef' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#202125' },
  totalAmount: { fontSize: 16, fontWeight: '700', color: '#202125' },
  orderError: { color: '#c43228', fontSize: 13, marginBottom: 10, textAlign: 'center' },
  btn: { backgroundColor: '#009de0', borderRadius: 10, paddingVertical: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  clearBtn: { marginTop: 10, alignItems: 'center', paddingVertical: 8 },
  clearBtnText: { color: '#7a7d82', fontSize: 13 },
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { fontSize: 56, color: '#16a34a', marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#202125', marginBottom: 8 },
  successSub: { fontSize: 14, color: '#7a7d82', textAlign: 'center', marginBottom: 32 },
});
