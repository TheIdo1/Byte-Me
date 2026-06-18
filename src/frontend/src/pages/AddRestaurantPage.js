// AddRestaurantPage.js
// Form for restaurant owners to list a new restaurant. Reachable from the
// header's "+ Add Restaurant" link (owners only). Submits straight to the
// POST /api/restaurants endpoint and redirects to the new restaurant's page.
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createRestaurant } from '../api/restaurantsApi';
import { CATEGORIES_DATA } from '../components/CategoryBar';
import './AddRestaurantPage.css';

const INITIAL_FORM = {
  name: '',
  description: '',
  category: '',
  subcategories: '',
  phone: '',
  email: '',
  image: '',
  rating: '',
  promotionalMessage: '',
  address: { city: '', street: '', houseNum: '', floor: '', lat: '', long: '' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-]{7,15}$/;
// Raw file size cap for uploaded photos — base64 encoding inflates this by
// ~33%, so this keeps the encoded payload well under the server's 5MB limit.
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

// Returns a map of field name → error message for every failing rule.
// An empty object means the form is valid and ready to submit.
function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Restaurant name is required.';
  if (!form.category) errs.category = 'Category is required.';
  if (!form.phone.trim()) errs.phone = 'Phone number is required.';
  else if (!PHONE_RE.test(form.phone.trim())) errs.phone = 'Enter a valid phone number.';
  if (!form.email.trim()) errs.email = 'Email is required.';
  else if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email address.';
  if (!form.image.trim()) errs.image = 'A restaurant image is required.';

  if (!form.address.city.trim()) errs.city = 'City is required.';
  if (!form.address.street.trim()) errs.street = 'Street is required.';

  const houseNum = parseInt(form.address.houseNum, 10);
  if (form.address.houseNum === '') errs.houseNum = 'House number is required.';
  else if (isNaN(houseNum) || houseNum < 1) errs.houseNum = 'Must be a positive number.';

  const floor = parseInt(form.address.floor, 10);
  if (form.address.floor === '') errs.floor = 'Floor is required.';
  else if (isNaN(floor) || floor < 0) errs.floor = 'Must be 0 or higher.';

  if (form.address.lat === '') errs.lat = 'Latitude is required.';
  else { const v = parseFloat(form.address.lat); if (isNaN(v) || v < -90 || v > 90) errs.lat = 'Must be between -90 and 90.'; }
  if (form.address.long === '') errs.long = 'Longitude is required.';
  else { const v = parseFloat(form.address.long); if (isNaN(v) || v < -180 || v > 180) errs.long = 'Must be between -180 and 180.'; }

  const rating = parseFloat(form.rating);
  if (form.rating === '') errs.rating = 'Rating is required.';
  else if (isNaN(rating) || rating < 1 || rating > 10) errs.rating = 'Must be between 1 and 10.';

  return errs;
}

export default function AddRestaurantPage({ token, user, isOwner }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // Updates form state on every keystroke. Re-validates only fields the user
  // has already visited so errors don't flash on untouched inputs.
  function handleChange(e) {
    const { name, value } = e.target;
    const isAddress = ['city', 'street', 'houseNum', 'floor', 'lat', 'long'].includes(name);
    const newForm = isAddress
      ? { ...form, address: { ...form.address, [name]: value } }
      : { ...form, [name]: value };
    setForm(newForm);
    if (touched[name]) setErrors(validate(newForm));
  }

  // Marks a field as touched when the user leaves it, then runs full validation.
  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  }

  // Validates all fields, then POSTs to the API. The logged-in user is
  // automatically recorded as the restaurant's authorized manager.
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const allFields = ['name', 'category', 'phone', 'email', 'image', 'city', 'street', 'houseNum', 'floor', 'lat', 'long'];
    setTouched(Object.fromEntries(allFields.map((k) => [k, true])));

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const restaurant = await createRestaurant({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        subcategories: form.subcategories.split(',').map((s) => s.trim()).filter(Boolean),
        phone: form.phone.trim(),
        email: form.email.trim(),
        image: form.image.trim(),
        promotionalMessage: form.promotionalMessage.trim(),
        rating: parseFloat(parseFloat(form.rating).toFixed(1)),
        authorizedUsers: [user.id],
        address: {
          city: form.address.city.trim(),
          street: form.address.street.trim(),
          houseNum: parseInt(form.address.houseNum, 10),
          floor: parseInt(form.address.floor, 10),
          lat: parseFloat(form.address.lat),
          long: parseFloat(form.address.long),
        },
      });
      navigate(`/restaurants/${restaurant.id}`);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Builds the common props for a controlled input: name, value (address fields
  // are read from the nested address object), change/blur handlers, and the
  // error class when the field has been touched and has a validation error.
  const f = (name) => ({
    name,
    value: ['city', 'street', 'houseNum', 'floor', 'lat', 'long'].includes(name)
      ? form.address[name]
      : form[name],
    onChange: handleChange,
    onBlur: handleBlur,
    className: touched[name] && errors[name] ? 'input-error' : '',
  });

  // Not logged in — there's nothing to do here until they sign in.
  if (!token) {
    return (
      <div className="add-restaurant-page">
        <div className="add-restaurant-card add-restaurant-card--guard">
          <h2>Log in to add a restaurant</h2>
          <p className="subtitle">You need a restaurant-owner account to list a new restaurant.</p>
          <div className="guard-actions">
            <Link to="/login" className="submit-btn submit-btn--link">Log in</Link>
            <Link to="/register" className="guard-secondary-link">Create an account</Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in, but the profile fetch (and isOwner flag) hasn't resolved yet.
  if (!user) return null;

  // Logged in but didn't register as a restaurant owner.
  if (!isOwner) {
    return (
      <div className="add-restaurant-page">
        <div className="add-restaurant-card add-restaurant-card--guard">
          <h2>Restaurant owners only</h2>
          <p className="subtitle">Only accounts registered as restaurant owners can add a restaurant.</p>
          <Link to="/" className="submit-btn submit-btn--link">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="add-restaurant-page">
      <div className="add-restaurant-card">
        <h2>List your restaurant</h2>
        <p className="subtitle">Tell us about your restaurant and we'll get it on Byte Me</p>

        {serverError && <div className="add-restaurant-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="add-restaurant-form" noValidate>

          <p className="section-title">Restaurant info</p>
          <div className="field-group">
            <div className="field">
              <label>Name <span className="required">*</span></label>
              <input type="text" {...f('name')} placeholder="Joe's Pizza" />
              {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="field">
              <label>Description</label>
              <textarea {...f('description')} placeholder="A short description of your restaurant" rows={3} />
            </div>
            <div className="field">
              <label>Category <span className="required">*</span></label>
              <select {...f('category')}>
                <option value="">Select a category</option>
                {CATEGORIES_DATA.map((c) => (
                  <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
                ))}
              </select>
              {touched.category && errors.category && <span className="field-error">{errors.category}</span>}
            </div>
            <div className="field">
              <label>Subcategories / tags</label>
              <input type="text" {...f('subcategories')} placeholder="Pizza, Pasta, Vegan (comma separated)" />
            </div>

            <div className="field">
              <label>Restaurant image URL <span className="required">*</span></label>
              <input type="text" {...f('image')} placeholder="https://example.com/photo.jpg" />

              {form.image && (
                <img src={form.image} alt="Restaurant preview" className="image-preview" />
              )}
              {touched.image && errors.image && <span className="field-error">{errors.image}</span>}
            </div>

            <div className="field">
              <label>Rating (1-10) <span className="required">*</span></label>
              <input
                type="number"
                {...f('rating')}
                placeholder="8.5"
                min="1"
                max="10"
                step="0.1"
              />
              {touched.rating && errors.rating && <span className="field-error">{errors.rating}</span>}
            </div>

          </div>

          <div className="divider" />

          <p className="section-title">Contact</p>
          <div className="field-group">
            <div className="field-row">
              <div className="field">
                <label>Phone <span className="required">*</span></label>
                <input type="tel" {...f('phone')} placeholder="+972 50 000 0000" />
                {touched.phone && errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
              <div className="field">
                <label>Email <span className="required">*</span></label>
                <input type="email" {...f('email')} placeholder="contact@restaurant.com" />
                {touched.email && errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>
          </div>

          <div className="divider" />

          <p className="section-title">Address</p>
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

          <p className="section-title">Promotion (optional)</p>
          <div className="field-group">
            <div className="field">
              <label>Promotional message</label>
              <input type="text" {...f('promotionalMessage')} placeholder="Try Us" />
            </div>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Creating restaurant…' : 'Create restaurant'}
          </button>
        </form>
      </div>
    </div>
  );
}
