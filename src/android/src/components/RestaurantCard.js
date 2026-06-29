import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function RestaurantCard({ restaurant, onPress }) {
  const { name, imageUrl, rating, deliveryTime, deliveryFee, tags, isSponsored, promotion } = restaurant;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {promotion && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>💡 {promotion}</Text>
          </View>
        )}
        {isSponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>Sponsored</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          {deliveryTime != null && (
            <View style={styles.timeBadge}>
              <Text style={styles.timeText}>{deliveryTime}</Text>
            </View>
          )}
        </View>
        <Text style={styles.tags} numberOfLines={1}>
          {(tags || []).join(' · ')}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>🛵 ₪{deliveryFee} delivery</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta}>😍 {rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginRight: 12,
  },
  imageWrapper: { position: 'relative' },
  image: { width: '100%', height: 130 },
  promoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  promoText: { color: '#fff', fontSize: 11, fontWeight: '500' },
  sponsoredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#009de0',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  sponsoredText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { padding: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  name: { fontSize: 14, fontWeight: '700', color: '#202125', flex: 1, marginRight: 6 },
  timeBadge: {
    backgroundColor: '#f0f4f8',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  timeText: { fontSize: 11, color: '#202125', fontWeight: '600' },
  tags: { fontSize: 12, color: '#7a7d82', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontSize: 12, color: '#7a7d82' },
  dot: { color: '#c8ccd0', fontSize: 12 },
});
