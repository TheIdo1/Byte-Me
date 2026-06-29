import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export const CATEGORIES_DATA = [
  { id: 'cat-1',  name: 'Israeli',       emoji: '🧆' },
  { id: 'cat-2',  name: 'Italian',       emoji: '🍕' },
  { id: 'cat-3',  name: 'Asian',         emoji: '🍜' },
  { id: 'cat-4',  name: 'Burgers',       emoji: '🍔' },
  { id: 'cat-5',  name: 'Mediterranean', emoji: '🥙' },
  { id: 'cat-6',  name: 'Cafe',          emoji: '☕' },
  { id: 'cat-7',  name: 'Vegan',         emoji: '🥗' },
  { id: 'cat-8',  name: 'Grill',         emoji: '🥩' },
  { id: 'cat-9',  name: 'Street Food',   emoji: '🌭' },
  { id: 'cat-10', name: 'Kosher',        emoji: '🍽️' },
  { id: 'cat-11', name: 'Mexican',       emoji: '🌮' },
  { id: 'cat-12', name: 'Seafood',       emoji: '🦐' },
  { id: 'cat-13', name: 'Fine Dining',   emoji: '🍷' },
  { id: 'cat-14', name: 'Desserts',      emoji: '🍰' },
  { id: 'cat-15', name: 'Bars & Pubs',   emoji: '🍻' },
];

export default function CategoryBar({ onSelectCategory, selectedCategory }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      style={styles.bar}
    >
      {CATEGORIES_DATA.map((cat) => {
        const active = selectedCategory === cat.name;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onSelectCategory?.(active ? null : cat.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{cat.emoji}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  scroll: { paddingHorizontal: 12, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f4f8',
    gap: 6,
  },
  chipActive: { backgroundColor: '#e6f5fc', borderWidth: 1.5, borderColor: '#009de0' },
  emoji: { fontSize: 16 },
  label: { fontSize: 13, fontWeight: '500', color: '#202125' },
  labelActive: { color: '#009de0', fontWeight: '700' },
});
