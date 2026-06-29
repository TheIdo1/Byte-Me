import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductCard({ product, onPress, onAddToCart }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        <Text style={styles.price}>₪{product.price?.toFixed(2)}</Text>
      </View>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {onAddToCart && (
          <TouchableOpacity style={styles.addBtn} onPress={onAddToCart} activeOpacity={0.8}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    alignItems: 'center',
  },
  info: { flex: 1, marginRight: 12 },
  name: { fontSize: 15, fontWeight: '700', color: '#202125', marginBottom: 4 },
  description: { fontSize: 12, color: '#7a7d82', lineHeight: 17, marginBottom: 8 },
  price: { fontSize: 14, fontWeight: '600', color: '#202125' },
  imageWrapper: { position: 'relative', width: 90, height: 90 },
  image: { width: 90, height: 90, borderRadius: 10 },
  addBtn: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#009de0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#009de0',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  addBtnText: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 22 },
});
