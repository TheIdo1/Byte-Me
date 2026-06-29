import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Switch,
} from 'react-native';
import { register } from '../api/authApi';

const INITIAL_FORM = {
  username: '', password: '', firstName: '', lastName: '',
  email: '', phone: '', isRestaurantOwner: false,
  address: { city: '', street: '', houseNum: '', floor: '', lat: '', long: '' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-]{7,15}$/;

function validate(form) {
  const e = {};
  if (!form.firstName.trim())                 e.firstName = 'Required';
  if (!form.lastName.trim())                  e.lastName  = 'Required';
  if (!form.email.trim())                     e.email     = 'Required';
  else if (!EMAIL_RE.test(form.email))        e.email     = 'Invalid email';
  if (!form.phone.trim())                     e.phone     = 'Required';
  else if (!PHONE_RE.test(form.phone.trim())) e.phone     = 'Invalid phone';
  if (!form.username.trim())                  e.username  = 'Required';
  if (!form.password)                              e.password = 'Required';
  else if (form.password.length < 8)              e.password = 'Min 8 characters';
  else if (!/[a-zA-Z]/.test(form.password))       e.password = 'Must contain a letter';
  else if (!/[0-9]/.test(form.password))          e.password = 'Must contain a number';
  else if (!/[^a-zA-Z0-9]/.test(form.password))  e.password = 'Must contain a special character';
  if (!form.address.city.trim())              e.city      = 'Required';
  if (!form.address.street.trim())            e.street    = 'Required';
  const hn = parseInt(form.address.houseNum, 10);
  if (!form.address.houseNum)                 e.houseNum  = 'Required';
  else if (isNaN(hn) || hn < 1)              e.houseNum  = 'Must be ≥ 1';
  const fl = parseInt(form.address.floor, 10);
  if (form.address.floor === '')              e.floor     = 'Required';
  else if (isNaN(fl) || fl < 0)              e.floor     = 'Must be ≥ 0';
  if (!form.address.lat)                      e.lat       = 'Required';
  else { const v = parseFloat(form.address.lat); if (isNaN(v) || v < -90 || v > 90) e.lat = '-90 to 90'; }
  if (!form.address.long)                     e.long      = 'Required';
  else { const v = parseFloat(form.address.long); if (isNaN(v) || v < -180 || v > 180) e.long = '-180 to 180'; }
  return e;
}

const ADDRESS_FIELDS = ['city', 'street', 'houseNum', 'floor', 'lat', 'long'];

function Field({ name, label, placeholder, keyboardType, secureTextEntry, value, error, touched, onChangeText, onBlur }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label} <Text style={styles.req}>*</Text></Text>
      <TextInput
        style={[styles.input, touched && error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#b0b4ba"
        keyboardType={keyboardType ?? 'default'}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {touched && error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

function Section({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

export default function RegisterScreen({ navigation }) {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function setField(name, value) {
    const isAddr = ADDRESS_FIELDS.includes(name);
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

  async function handleSubmit() {
    const allFields = ['firstName','lastName','email','phone','username','password','city','street','houseNum','floor','lat','long'];
    setTouched(Object.fromEntries(allFields.map((k) => [k, true])));
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setServerError('');
    try {
      await register({
        ...form,
        address: {
          ...form.address,
          houseNum: parseInt(form.address.houseNum, 10),
          floor:    parseInt(form.address.floor, 10),
          lat:      parseFloat(form.address.lat),
          long:     parseFloat(form.address.long),
        },
      });
      navigation.replace('Login');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.subheading}>Join Byte Me and start ordering</Text>

        {!!serverError && <View style={styles.errorBox}><Text style={styles.errorText}>{serverError}</Text></View>}

        <Section title="Personal Info" />
        <View style={styles.row}>
          <View style={styles.half}><Field name="firstName" label="First name" placeholder="John" value={form.firstName} error={errors.firstName} touched={touched.firstName} onChangeText={(v) => setField('firstName', v)} onBlur={() => markTouched('firstName')} /></View>
          <View style={styles.half}><Field name="lastName"  label="Last name"  placeholder="Doe"  value={form.lastName}  error={errors.lastName}  touched={touched.lastName}  onChangeText={(v) => setField('lastName', v)}  onBlur={() => markTouched('lastName')}  /></View>
        </View>
        <Field name="email" label="Email" placeholder="john@example.com" keyboardType="email-address" value={form.email} error={errors.email} touched={touched.email} onChangeText={(v) => setField('email', v)} onBlur={() => markTouched('email')} />
        <Field name="phone" label="Phone" placeholder="+972 50 000 0000" keyboardType="phone-pad" value={form.phone} error={errors.phone} touched={touched.phone} onChangeText={(v) => setField('phone', v)} onBlur={() => markTouched('phone')} />

        <View style={styles.divider} />
        <Section title="Account" />
        <Field name="username" label="Username" placeholder="johndoe" value={form.username} error={errors.username} touched={touched.username} onChangeText={(v) => setField('username', v)} onBlur={() => markTouched('username')} />
        <Field name="password" label="Password" placeholder="Min 8 chars, letter, number, symbol" secureTextEntry value={form.password} error={errors.password} touched={touched.password} onChangeText={(v) => setField('password', v)} onBlur={() => markTouched('password')} />

        <View style={styles.divider} />
        <Section title="Delivery Address" />
        <View style={styles.row}>
          <View style={styles.half}><Field name="city"   label="City"   placeholder="Tel Aviv"     value={form.address.city}   error={errors.city}   touched={touched.city}   onChangeText={(v) => setField('city', v)}   onBlur={() => markTouched('city')}   /></View>
          <View style={styles.half}><Field name="street" label="Street" placeholder="Dizengoff St" value={form.address.street} error={errors.street} touched={touched.street} onChangeText={(v) => setField('street', v)} onBlur={() => markTouched('street')} /></View>
        </View>
        <View style={styles.row}>
          <View style={styles.half}><Field name="houseNum" label="House #" placeholder="12" keyboardType="numeric" value={form.address.houseNum} error={errors.houseNum} touched={touched.houseNum} onChangeText={(v) => setField('houseNum', v)} onBlur={() => markTouched('houseNum')} /></View>
          <View style={styles.half}><Field name="floor"    label="Floor"   placeholder="0"  keyboardType="numeric" value={form.address.floor}    error={errors.floor}    touched={touched.floor}    onChangeText={(v) => setField('floor', v)}    onBlur={() => markTouched('floor')}    /></View>
        </View>
        <View style={styles.row}>
          <View style={styles.half}><Field name="lat"  label="Latitude"  placeholder="31.7683" keyboardType="decimal-pad" value={form.address.lat}  error={errors.lat}  touched={touched.lat}  onChangeText={(v) => setField('lat', v)}  onBlur={() => markTouched('lat')}  /></View>
          <View style={styles.half}><Field name="long" label="Longitude" placeholder="35.2137" keyboardType="decimal-pad" value={form.address.long} error={errors.long} touched={touched.long} onChangeText={(v) => setField('long', v)} onBlur={() => markTouched('long')} /></View>
        </View>

        <View style={styles.divider} />
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>I am a restaurant owner</Text>
          <Switch
            value={form.isRestaurantOwner}
            onValueChange={(v) => setForm({ ...form, isRestaurantOwner: v })}
            trackColor={{ true: '#009de0' }}
          />
        </View>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Create account</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f7fafc' },
  container: { padding: 24, paddingBottom: 48 },
  heading: { fontSize: 26, fontWeight: '800', color: '#202125', marginBottom: 4, marginTop: 16 },
  subheading: { fontSize: 14, color: '#7a7d82', marginBottom: 24 },
  errorBox: { backgroundColor: '#fde8e8', borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { color: '#c43228', fontSize: 13 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#7a7d82', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#e9ecef', marginVertical: 20 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#202125', marginBottom: 5 },
  req: { color: '#c43228' },
  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#e9ecef',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#202125',
    backgroundColor: '#fafbfc',
  },
  inputError: { borderColor: '#c43228' },
  fieldError: { color: '#c43228', fontSize: 11, marginTop: 3 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingVertical: 4 },
  toggleLabel: { fontSize: 15, color: '#202125', fontWeight: '500' },
  btn: {
    height: 50,
    backgroundColor: '#009de0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#7a7d82', fontSize: 13 },
  link: { color: '#009de0', fontSize: 13, fontWeight: '600' },
});
