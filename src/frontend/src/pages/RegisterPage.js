import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';
import './RegisterPage.css';

const INITIAL_FORM = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  isRestaurantOwner: false,
  address: { city: '', street: '', houseNum: '', floor: '', lat: '', long: '' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-]{7,15}$/;

function validate(form) {
  const errs = {};
  if (!form.firstName.trim())               errs.firstName = 'First name is required.';
  if (!form.lastName.trim())                errs.lastName  = 'Last name is required.';
  if (!form.email.trim())                   errs.email     = 'Email is required.';
  else if (!EMAIL_RE.test(form.email))      errs.email     = 'Enter a valid email address.';
  if (!form.phone.trim())                   errs.phone     = 'Phone number is required.';
  else if (!PHONE_RE.test(form.phone.trim())) errs.phone   = 'Enter a valid phone number.';
  if (!form.username.trim())                errs.username  = 'Username is required.';
  if (!form.password)                       errs.password  = 'Password is required.';
  else if (form.password.length < 6)        errs.password  = 'Password must be at least 6 characters.';
  if (!form.address.city.trim())            errs.city      = 'City is required.';
  if (!form.address.street.trim())          errs.street    = 'Street is required.';

  const houseNum = parseInt(form.address.houseNum, 10);
  if (form.address.houseNum === '')         errs.houseNum  = 'House number is required.';
  else if (isNaN(houseNum) || houseNum < 1) errs.houseNum  = 'Must be a positive number.';

  const floor = parseInt(form.address.floor, 10);
  if (form.address.floor === '')            errs.floor     = 'Floor is required.';
  else if (isNaN(floor) || floor < 0)       errs.floor     = 'Must be 0 or higher.';

  if (form.address.lat === '')              errs.lat  = 'Latitude is required.';
  else { const v = parseFloat(form.address.lat);  if (isNaN(v) || v < -90  || v > 90)  errs.lat  = 'Must be between -90 and 90.'; }
  if (form.address.long === '')             errs.long = 'Longitude is required.';
  else { const v = parseFloat(form.address.long); if (isNaN(v) || v < -180 || v > 180) errs.long = 'Must be between -180 and 180.'; }

  return errs;
}

export default function RegisterPage() {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, checked } = e.target;
    const isAddress = ['city', 'street', 'houseNum', 'floor', 'lat', 'long'].includes(name);
    let newForm;
    if (name === 'isRestaurantOwner') {
      newForm = { ...form, isRestaurantOwner: checked };
    } else if (isAddress) {
      newForm = { ...form, address: { ...form.address, [name]: value } };
    } else {
      newForm = { ...form, [name]: value };
    }
    setForm(newForm);
    if (touched[name]) setErrors(validate(newForm));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const allFields = ['firstName','lastName','email','phone','username','password','city','street','houseNum','floor','lat','long'];
    setTouched(Object.fromEntries(allFields.map((k) => [k, true])));

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
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
      navigate('/login');
    } catch (err) {
      if (err.field) {
        setErrors((prev) => ({ ...prev, [err.field]: err.message }));
        setTouched((prev) => ({ ...prev, [err.field]: true }));
      } else {
        setServerError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const f = (name) => ({
    name,
    value: ['city','street','houseNum','floor','lat','long'].includes(name)
      ? form.address[name]
      : form[name],
    onChange: handleChange,
    onBlur:   handleBlur,
    className: touched[name] && errors[name] ? 'input-error' : '',
  });

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Create account</h2>
        <p className="subtitle">Join Byte Me and start ordering</p>

        {serverError && <div className="register-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="register-form" noValidate>

          <p className="section-title">Personal info</p>
          <div className="field-group">
            <div className="field-row">
              <div className="field">
                <label>First name <span className="required">*</span></label>
                <input type="text" {...f('firstName')} placeholder="John" />
                {touched.firstName && errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="field">
                <label>Last name <span className="required">*</span></label>
                <input type="text" {...f('lastName')} placeholder="Doe" />
                {touched.lastName && errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>
            <div className="field">
              <label>Email <span className="required">*</span></label>
              <input type="email" {...f('email')} placeholder="john@example.com" />
              {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="field">
              <label>Phone number <span className="required">*</span></label>
              <input type="tel" {...f('phone')} placeholder="+972 50 000 0000" />
              {touched.phone && errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="divider" />

          <p className="section-title">Account</p>
          <div className="field-group">
            <div className="field">
              <label>Username <span className="required">*</span></label>
              <input type="text" {...f('username')} placeholder="johndoe" />
              {touched.username && errors.username && <span className="field-error">{errors.username}</span>}
            </div>
            <div className="field">
              <label>Password <span className="required">*</span></label>
              <input type="password" {...f('password')} placeholder="••••••••" />
              {touched.password && errors.password && <span className="field-error">{errors.password}</span>}
            </div>
          </div>

          <div className="divider" />

          <p className="section-title">Delivery address</p>
          <div className="field-group">
            <div className="field-row">
              <div className="field">
                <label>City <span className="required">*</span></label>
                <input type="text" {...f('city')} placeholder="Tel Aviv" />
                {touched.city && errors.city && <span className="field-error">{errors.city}</span>}
              </div>
              <div className="field">
                <label>Street <span className="required">*</span></label>
                <input type="text" {...f('street')} placeholder="Dizengoff St" />
                {touched.street && errors.street && <span className="field-error">{errors.street}</span>}
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>House number <span className="required">*</span></label>
                <input type="number" {...f('houseNum')} placeholder="12" min="1" />
                {touched.houseNum && errors.houseNum && <span className="field-error">{errors.houseNum}</span>}
              </div>
              <div className="field">
                <label>Floor <span className="required">*</span></label>
                <input type="number" {...f('floor')} placeholder="0" min="0" />
                {touched.floor && errors.floor && <span className="field-error">{errors.floor}</span>}
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Latitude <span className="required">*</span></label>
                <input type="number" {...f('lat')} placeholder="31.7683" step="any" />
                {touched.lat && errors.lat && <span className="field-error">{errors.lat}</span>}
              </div>
              <div className="field">
                <label>Longitude <span className="required">*</span></label>
                <input type="number" {...f('long')} placeholder="35.2137" step="any" />
                {touched.long && errors.long && <span className="field-error">{errors.long}</span>}
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="restaurant-owner-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isRestaurantOwner"
                checked={form.isRestaurantOwner}
                onChange={handleChange}
              />
              <span>I am a restaurant owner</span>
            </label>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
