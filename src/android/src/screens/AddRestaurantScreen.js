import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Switch,
} from 'react-native';
import { createRestaurant } from '../api/restaurantsApi';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES_DATA } from '../components/CategoryBar';

const INITIAL = {
  name: '', description: '', category: '', subcategories: '',
  phone: '', email: '', image: '', rating: '', promotionalMessage: '',
  isSponsored: false,
  address: { city: '', street: '', houseNum: '', floor: '', lat: '', long: '' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-]{7,15}$/;
const ADDR_FIELDS = ['city', 'street', 'houseNum', 'floor', 'lat', 'long'];

function validate(form) {
  const e = {};
  if (!form.name.trim())   e.name     = 'Required';
  if (!form.category)      e.category = 'Required';
  if (!form.phone.trim())  e.phone    = 'Required';
  else if (!PHONE_RE.test(form.phone.trim())) e.phone = 'Invalid phone';
  if (!form.email.trim())  e.email    = 'Required';
  else if (!EMAIL_RE.test(form.email)) e.email = 'Invalid email';
  if (!form.image.trim())  e.image    = 'Required';
  if (!form.address.city.trim())   e.city   = 'Required';
  if (!form.address.street.trim()) e.street = 'Required';
  const hn = parseInt(form.address.houseNum, 10);
  if (!form.address.houseNum) e.houseNum = 'Required';
  else if (isNaN(hn) || hn < 1) e.houseNum = 'Must be ≥ 1';
  const fl = parseInt(form.address.floor, 10);
  if (form.address.floor === '') e.floor = 'Required';
  else if (isNaN(fl) || fl < 0) e.floor = 'Must be ≥ 0';
  const rating = parseFloat(form.rating);
  if (!form.rating) e.rating = 'Required';
  else if (isNaN(rating) || rating < 1 || rating > 10) e.rating = '1–10';
  return e;
}

export default function AddRestaurantScreen({ navigation }) {
  const { user } = useAuth();
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);

  function setField(name, value) {
    const isAddr = ADDR_FIELDS.includes(name);
    const newForm = isAddr
      ? { ...form, address: { ...form.address, [name]: value } }
      : { ...form, [name]: value };
    setForm(newForm);
    if (touched[name]) setErrors(validate(newForm));
  }

  function markTouched(name) {
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors(validate(form));
  }

  function fieldValue(name) {
    return ADDR_FIELDS.includes(name) ? form.address[name] : form[name];
  }

  async function handleSubmit() {
    const allFields = ['name','category','phone','email','image','rating','city','street','houseNum','floor'];
    setTouched(Object.fromEntries(allFields.map((k) => [k, true])));
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError('');
    try {
      const created = await createRestaurant({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        subcategories: form.subcategories.split(',').map((s) => s.trim()).filter(Boolean),
        phone: form.phone.trim(),
        email: form.email.trim(),
        image: form.image.trim(),
        promotionalMessage: form.promotionalMessage.trim(),
        rating: parseFloat(parseFloat(form.rating).toFixed(1)),
        isSponsored: form.isSponsored,
        authorizedUsers: [user?.id],
        address: {
          city: form.address.city.trim(),
          street: form.address.street.trim(),
          houseNum: parseInt(form.address.houseNum, 10),
          floor: parseInt(form.address.floor, 10),
          lat: form.address.lat ? parseFloat(form.address.lat) : undefined,
          long: form.address.long ? parseFloat(form.address.long) : undefined,
        },
      });
      navigation.navigate('ManageRestaurant', { restaurantId: created.id });
    } catch (err) {
      setServerError(err.message || 'Failed to create restaurant.');
    } finally {
      setLoading(false);
    }
  }

  function Field({ name, label, placeholder, keyboardType, required }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}{required ? <Text style={styles.req}> *</Text> : null}</Text>
        <TextInput
          style={[styles.input, touched[name] && errors[name] && styles.inputError]}
          value={fieldValue(name)}
          onChangeText={(v) => setField(name, v)}
          onBlur={() => markTouched(name)}
          placeholder={placeholder}
          placeholderTextColor="#b0b4ba"
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {touched[name] && errors[name] && <Text style={styles.fieldError}>{errors[name]}</Text>}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {!!serverError && <View style={styles.errorBox}><Text style={styles.errorText}>{serverError}</Text></View>}

        <Text style={styles.section}>Basic Info</Text>
        <Field name="name" label="Restaurant name" placeholder="Byte Burgers" required />
        <Field name="description" label="Description" placeholder="Short tagline" />

        {/* Category picker */}
        <View style={styles.field}>
          <Text style={styles.label}>Category <Text style={styles.req}>*</Text></Text>
          <TouchableOpacity
            style={[styles.input, styles.pickerBtn, touched.category && errors.category && styles.inputError]}
            onPress={() => setShowCatPicker(!showCatPicker)}
          >
            <Text style={{ color: form.category ? '#202125' : '#b0b4ba', fontSize: 15 }}>
              {form.category || 'Select category'}
            </Text>
          </TouchableOpacity>
          {touched.category && errors.category && <Text style={styles.fieldError}>{errors.category}</Text>}
          {showCatPicker && (
            <View style={styles.catList}>
              {CATEGORIES_DATA.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.catOption, form.category === c.name && styles.catOptionSelected]}
                  onPress={() => { setField('category', c.name); setShowCatPicker(false); }}
                >
                  <Text style={{ fontSize: 14, color: form.category === c.name ? '#009de0' : '#202125' }}>
                    {c.emoji} {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Field name="subcategories" label="Subcategories (comma-separated)" placeholder="Pizza, Pasta, Salads" />
        <Field name="image" label="Image URL" placeholder="https://..." required />
        <Field name="rating" label="Rating (1–10)" placeholder="8.5" keyboardType="decimal-pad" required />
        <Field name="promotionalMessage" label="Promotional message" placeholder="Free delivery today!" />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Sponsored</Text>
          <Switch value={form.isSponsored} onValueChange={(v) => setForm({ ...form, isSponsored: v })} trackColor={{ true: '#009de0' }} />
        </View>

        <View style={styles.divider} />
        <Text style={styles.section}>Contact</Text>
        <Field name="phone" label="Phone" placeholder="+972 50 000 0000" keyboardType="phone-pad" required />
        <Field name="email" label="Email" placeholder="restaurant@example.com" keyboardType="email-address" required />

        <View style={styles.divider} />
        <Text style={styles.section}>Address</Text>
        <View style={styles.row}>
          <View style={styles.half}><Field name="city"    label="City"    placeholder="Tel Aviv"    required /></View>
          <View style={styles.half}><Field name="street"  label="Street"  placeholder="Dizengoff"   required /></View>
        </View>
        <View style={styles.row}>
          <View style={styles.half}><Field name="houseNum" label="House #" placeholder="12" keyboardType="numeric" required /></View>
          <View style={styles.half}><Field name="floor"    label="Floor"   placeholder="0"  keyboardType="numeric" required /></View>
        </View>
        <View style={styles.row}>
          <View style={styles.half}><Field name="lat"  label="Latitude"  placeholder="31.7683" keyboardType="decimal-pad" /></View>
          <View style={styles.half}><Field name="long" label="Longitude" placeholder="35.2137" keyboardType="decimal-pad" /></View>
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Restaurant</Text>}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f7fafc' },
  container: { padding: 20 },
  section: { fontSize: 13, fontWeight: '700', color: '#7a7d82', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#e9ecef', marginVertical: 20 },
  errorBox: { backgroundColor: '#fde8e8', borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { color: '#c43228', fontSize: 13 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#202125', marginBottom: 5 },
  req: { color: '#c43228' },
  input: {
    height: 46, borderWidth: 1.5, borderColor: '#e9ecef', borderRadius: 10,
    paddingHorizontal: 12, fontSize: 15, color: '#202125', backgroundColor: '#fafbfc',
    justifyContent: 'center',
  },
  inputError: { borderColor: '#c43228' },
  fieldError: { color: '#c43228', fontSize: 11, marginTop: 3 },
  pickerBtn: { flexDirection: 'row', alignItems: 'center' },
  catList: { borderWidth: 1, borderColor: '#e9ecef', borderRadius: 10, marginTop: 4, overflow: 'hidden' },
  catOption: { paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#f0f4f8' },
  catOptionSelected: { backgroundColor: '#e6f5fc' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, marginBottom: 14 },
  toggleLabel: { fontSize: 15, color: '#202125', fontWeight: '500' },
  btn: { backgroundColor: '#009de0', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
