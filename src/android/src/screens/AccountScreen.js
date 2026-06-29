import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function AccountScreen({ navigation }) {
  const { user, isOwner, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  async function handleSignOut() {
    await signOut();
  }

  function MenuItem({ icon, label, onPress, danger }) {
    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40, paddingTop: insets.top + 16 }}>
      {/* Avatar / profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user ? (user.firstName?.[0] ?? user.username?.[0] ?? '?').toUpperCase() : '?'}
          </Text>
        </View>
        <View>
          <Text style={styles.displayName}>
            {user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username : 'Guest'}
          </Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>
      </View>

      {/* Owner section */}
      {isOwner && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Restaurant Owner</Text>
          <View style={styles.card}>
            <MenuItem icon="🏪" label="My Restaurants" onPress={() => navigation.navigate('MyRestaurants')} />
            <View style={styles.divider} />
            <MenuItem icon="➕" label="Add Restaurant"  onPress={() => navigation.navigate('AddRestaurant')} />
          </View>
        </View>
      )}

      {/* Account section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          <MenuItem icon="📦" label="My Orders" onPress={() => navigation.navigate('Orders')} />
        </View>
      </View>

      {/* Sign out */}
      <View style={styles.section}>
        <View style={styles.card}>
          <MenuItem icon="🚪" label="Sign out" onPress={handleSignOut} danger />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#009de0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '800' },
  displayName: { fontSize: 20, fontWeight: '700', color: '#202125' },
  email: { fontSize: 13, color: '#7a7d82', marginTop: 2 },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7a7d82',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  menuIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: '#202125', fontWeight: '500' },
  menuLabelDanger: { color: '#c43228' },
  chevron: { fontSize: 20, color: '#c8ccd0', fontWeight: '300' },
  divider: { height: 1, backgroundColor: '#f0f4f8', marginLeft: 56 },
});
