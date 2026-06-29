import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerField({ label, value, onChange, required, error, touched }) {
  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photo library to upload an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      onChange(`data:image/jpeg;base64,${asset.base64}`);
    }
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your camera to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      onChange(`data:image/jpeg;base64,${asset.base64}`);
    }
  }

  const hasImage = !!value;
  const showError = touched && error;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}{required ? <Text style={styles.req}> *</Text> : null}
      </Text>

      {hasImage && (
        <Image source={{ uri: value }} style={styles.preview} resizeMode="cover" />
      )}

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.pickBtn, showError && styles.pickBtnError]} onPress={pickFromGallery} activeOpacity={0.8}>
          <Text style={styles.pickBtnText}>📷  Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pickBtn, showError && styles.pickBtnError]} onPress={pickFromCamera} activeOpacity={0.8}>
          <Text style={styles.pickBtnText}>📸  Camera</Text>
        </TouchableOpacity>
      </View>

      {showError && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#202125', marginBottom: 5 },
  req: { color: '#c43228' },
  preview: { width: '100%', height: 180, borderRadius: 10, marginBottom: 8 },
  btnRow: { flexDirection: 'row', gap: 10 },
  pickBtn: {
    flex: 1, height: 46, borderWidth: 1.5, borderColor: '#e9ecef',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fafbfc',
  },
  pickBtnError: { borderColor: '#c43228' },
  pickBtnText: { fontSize: 14, color: '#202125', fontWeight: '500' },
  fieldError: { color: '#c43228', fontSize: 11, marginTop: 3 },
});
