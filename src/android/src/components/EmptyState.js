import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ icon = '🍽️', title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '600', color: '#202125', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#7a7d82', textAlign: 'center', lineHeight: 20 },
});
