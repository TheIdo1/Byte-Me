import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, ScrollView, Alert, Modal, Switch,
} from 'react-native';
import { getRestaurantById, updateRestaurant, deleteRestaurant } from '../api/restaurantsApi';
import { getRestaurantProducts, createProduct, updateProduct, deleteProduct } from '../api/productsApi';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES_DATA } from '../components/CategoryBar';

export default function ManageRestaurantScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const { user } = useAuth();

  const [tab, setTab] = useState('details');
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);

  // Edit restaurant state
  const [editForm, setEditForm]         = useState(null);
  const [editLoading, setEditLoading]   = useState(false);
  const [editError, setEditError]       = useState('');
  const [editSuccess, setEditSuccess]   = useState(false);

  // Product form state
  const [productModal, setProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm]   = useState({ name: '', price: '', description: '', image: '', category: '', isPopular: false });
  const [productError, setProductError] = useState('');
  const [productLoading, setProductLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rest, prods] = await Promise.all([
        getRestaurantById(restaurantId),
        getRestaurantProducts(restaurantId),
      ]);
      setRestaurant(rest);
      setEditForm({
        name: rest.name,
        description: rest.description ?? '',
        category: rest.category ?? '',
        phone: rest.phone ?? '',
        email: rest.email ?? '',
        image: rest.image ?? '',
        rating: String(rest.rating ?? ''),
        promotionalMessage: rest.promotionalMessage ?? '',
        isSponsored: rest.isSponsored ?? false,
      });
      setProducts(prods);
      navigation.setOptions({ title: rest.name });
    } catch {}
    finally { setLoading(false); }
  }, [restaurantId]);

  useEffect(() => { load(); }, [load]);

  async function handleSaveDetails() {
    if (!editForm.name.trim()) { setEditError('Name is required.'); return; }
    setEditLoading(true);
    setEditError('');
    setEditSuccess(false);
    try {
      const updated = await updateRestaurant(restaurantId, {
        ...editForm,
        rating: parseFloat(editForm.rating) || restaurant.rating,
      });
      setRestaurant(updated);
      setEditSuccess(true);
    } catch (err) {
      setEditError(err.message || 'Failed to update.');
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDeleteRestaurant() {
    Alert.alert(
      'Delete Restaurant',
      `Are you sure you want to delete "${restaurant?.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRestaurant(restaurantId);
              navigation.navigate('MyRestaurants');
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete restaurant.');
            }
          },
        },
      ]
    );
  }

  function openProductForm(product) {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        price: String(product.price),
        description: product.description ?? '',
        image: product.image ?? '',
        category: product.category ?? '',
        isPopular: product.isPopular ?? false,
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', price: '', description: '', image: '', category: '', isPopular: false });
    }
    setProductError('');
    setProductModal(true);
  }

  async function handleSaveProduct() {
    if (!productForm.name.trim()) { setProductError('Name is required.'); return; }
    const price = parseFloat(productForm.price);
    if (isNaN(price) || price < 0) { setProductError('Valid price required.'); return; }

    setProductLoading(true);
    setProductError('');
    try {
      const data = {
        name: productForm.name.trim(),
        price,
        description: productForm.description.trim(),
        image: productForm.image.trim(),
        category: productForm.category.trim(),
        isPopular: productForm.isPopular,
      };
      if (editingProduct) {
        await updateProduct(restaurantId, editingProduct.id || editingProduct._id, data);
      } else {
        await createProduct(restaurantId, data);
      }
      setProductModal(false);
      load();
    } catch (err) {
      setProductError(err.message || 'Failed to save product.');
    } finally {
      setProductLoading(false);
    }
  }

  async function handleDeleteProduct(product) {
    Alert.alert(
      'Delete Product',
      `Delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(restaurantId, product.id || product._id);
              load();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete product.');
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#009de0" /></View>;
  }

  function EField({ label, value, onChangeText, keyboardType, multiline }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, multiline && { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab bar */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'details' && styles.tabActive]} onPress={() => setTab('details')}>
          <Text style={[styles.tabText, tab === 'details' && styles.tabTextActive]}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'products' && styles.tabActive]} onPress={() => setTab('products')}>
          <Text style={[styles.tabText, tab === 'products' && styles.tabTextActive]}>Products ({products.length})</Text>
        </TouchableOpacity>
      </View>

      {tab === 'details' && editForm && (
        <ScrollView contentContainerStyle={styles.tabContent} keyboardShouldPersistTaps="handled">
          {!!editError   && <View style={styles.errBox}><Text style={styles.errText}>{editError}</Text></View>}
          {editSuccess   && <View style={styles.okBox}><Text style={styles.okText}>Saved successfully!</Text></View>}

          <EField label="Name"                value={editForm.name}                onChangeText={(v) => setEditForm({ ...editForm, name: v })} />
          <EField label="Description"         value={editForm.description}         onChangeText={(v) => setEditForm({ ...editForm, description: v })} multiline />
          <EField label="Phone"               value={editForm.phone}               onChangeText={(v) => setEditForm({ ...editForm, phone: v })} keyboardType="phone-pad" />
          <EField label="Email"               value={editForm.email}               onChangeText={(v) => setEditForm({ ...editForm, email: v })} keyboardType="email-address" />
          <EField label="Image URL"           value={editForm.image}               onChangeText={(v) => setEditForm({ ...editForm, image: v })} />
          <EField label="Rating (1–10)"       value={editForm.rating}              onChangeText={(v) => setEditForm({ ...editForm, rating: v })} keyboardType="decimal-pad" />
          <EField label="Promotional message" value={editForm.promotionalMessage}  onChangeText={(v) => setEditForm({ ...editForm, promotionalMessage: v })} />

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Sponsored</Text>
            <Switch value={editForm.isSponsored} onValueChange={(v) => setEditForm({ ...editForm, isSponsored: v })} trackColor={{ true: '#009de0' }} />
          </View>

          <TouchableOpacity style={[styles.btn, editLoading && { opacity: 0.6 }]} onPress={handleSaveDetails} disabled={editLoading}>
            {editLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Save Changes</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteRestaurant}>
            <Text style={styles.deleteBtnText}>Delete Restaurant</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {tab === 'products' && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          <TouchableOpacity style={styles.addProductBtn} onPress={() => openProductForm(null)}>
            <Text style={styles.addProductBtnText}>＋ Add Product</Text>
          </TouchableOpacity>

          {products.length === 0 && (
            <Text style={styles.emptyProducts}>No products yet. Tap above to add one.</Text>
          )}

          {products.map((p) => (
            <View key={p.id || p._id} style={styles.productRow}>
              {!!p.image && <Image source={{ uri: p.image }} style={styles.productThumb} resizeMode="cover" />}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{p.name}</Text>
                <Text style={styles.productMeta}>₪{p.price?.toFixed(2)} · {p.category}</Text>
                {p.isPopular && <Text style={styles.popularTag}>Popular</Text>}
              </View>
              <TouchableOpacity style={styles.editIcon} onPress={() => openProductForm(p)}>
                <Text style={{ fontSize: 16 }}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteProduct(p)}>
                <Text style={{ fontSize: 16 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Product form modal */}
      <Modal visible={productModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setProductModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingProduct ? 'Edit Product' : 'Add Product'}</Text>
            <TouchableOpacity onPress={() => setProductModal(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            {!!productError && <View style={styles.errBox}><Text style={styles.errText}>{productError}</Text></View>}
            {['name','price','description','image','category'].map((field) => (
              <View key={field} style={styles.field}>
                <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <TextInput
                  style={styles.input}
                  value={productForm[field]}
                  onChangeText={(v) => setProductForm({ ...productForm, [field]: v })}
                  keyboardType={field === 'price' ? 'decimal-pad' : 'default'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  multiline={field === 'description'}
                />
              </View>
            ))}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Popular item</Text>
              <Switch value={productForm.isPopular} onValueChange={(v) => setProductForm({ ...productForm, isPopular: v })} trackColor={{ true: '#009de0' }} />
            </View>
            <TouchableOpacity style={[styles.btn, productLoading && { opacity: 0.6 }]} onPress={handleSaveProduct} disabled={productLoading}>
              {productLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{editingProduct ? 'Save Changes' : 'Add Product'}</Text>}
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#009de0' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#7a7d82' },
  tabTextActive: { color: '#009de0' },
  tabContent: { padding: 20 },
  errBox: { backgroundColor: '#fde8e8', borderRadius: 8, padding: 12, marginBottom: 14 },
  errText: { color: '#c43228', fontSize: 13 },
  okBox: { backgroundColor: '#dcfce7', borderRadius: 8, padding: 12, marginBottom: 14 },
  okText: { color: '#16a34a', fontSize: 13 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#202125', marginBottom: 5 },
  input: { height: 46, borderWidth: 1.5, borderColor: '#e9ecef', borderRadius: 10, paddingHorizontal: 12, fontSize: 15, color: '#202125', backgroundColor: '#fafbfc' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, marginBottom: 14 },
  toggleLabel: { fontSize: 15, color: '#202125', fontWeight: '500' },
  btn: { backgroundColor: '#009de0', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteBtn: { marginTop: 12, paddingVertical: 14, alignItems: 'center', borderRadius: 10, borderWidth: 1.5, borderColor: '#c43228' },
  deleteBtnText: { color: '#c43228', fontSize: 15, fontWeight: '600' },
  addProductBtn: { borderWidth: 1.5, borderColor: '#009de0', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  addProductBtnText: { color: '#009de0', fontSize: 14, fontWeight: '700' },
  emptyProducts: { textAlign: 'center', color: '#7a7d82', fontSize: 14, marginTop: 20 },
  productRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8, gap: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  productThumb: { width: 56, height: 56, borderRadius: 8 },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '700', color: '#202125', marginBottom: 3 },
  productMeta: { fontSize: 12, color: '#7a7d82' },
  popularTag: { fontSize: 11, color: '#854d0e', backgroundColor: '#fef9c3', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1, alignSelf: 'flex-start', marginTop: 3 },
  editIcon: { padding: 6 },
  deleteIcon: { padding: 6 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#202125' },
  closeBtn: { fontSize: 18, color: '#7a7d82', padding: 4 },
});
