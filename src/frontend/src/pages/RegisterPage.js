// Registration page. Collects all fields required by POST /api/users and
// redirects to /login on success.
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
  address: { city: '', street: '', houseNum: '', floor: '' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns a map of field name → error message for every failing rule.
// An empty object means the form is valid.
function validate(form) {
  const errs = {};
  if (!form.firstName.trim())               errs.firstName = 'First name is required.';
  if (!form.lastName.trim())                errs.lastName  = 'Last name is required.';
  if (!form.email.trim())                   errs.email     = 'Email is required.';
  else if (!EMAIL_RE.test(form.email))      errs.email     = 'Enter a valid email address.';
  if (!form.username.trim())                errs.username  = 'Username is required.';
  if (!form.password)                       errs.password  = 'Password is required.';
  else if (form.password.length < 6)        errs.password  = 'Password must be at least 6 characters.';
  if (!form.address.city.trim())            errs.city      = 'City is required.';
  if (!form.address.street.trim())          errs.street    = 'Street is required.';

  // houseNum / floor are kept as strings in state so empty string can be detected;
  // they are parsed to integers before submission.
  const houseNum = parseInt(form.address.houseNum, 10);
  if (form.address.houseNum === '')         errs.houseNum  = 'House number is required.';
  else if (isNaN(houseNum) || houseNum < 1) errs.houseNum  = 'Must be a positive number.';

  const floor = parseInt(form.address.floor, 10);
  if (form.address.floor === '')            errs.floor     = 'Floor is required.';
  else if (isNaN(floor) || floor < 0)       errs.floor     = 'Must be 0 or higher.';

  return errs;
}

export default function RegisterPage() {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  // touched tracks which fields the user has interacted with so errors are
  // only shown after the user has visited a field, not on initial render.
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    const isAddress = ['city', 'street', 'houseNum', 'floor'].includes(name);
    const newForm = isAddress
      ? { ...form, address: { ...form.address, [name]: value } }
      : { ...form, [name]: value };
    setForm(newForm);
    // Re-validate live only for fields the user has already visited.
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

    // Mark every field as touched so all errors become visible on submit.
    const allTouched = Object.fromEntries(
      ['firstName','lastName','email','username','password','city','street','houseNum','floor']
        .map((k) => [k, true])
    );
    setTouched(allTouched);

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
        },
      });
      navigate('/login');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Builds the common props for each input: name, value (address fields are
  // nested), change/blur handlers, and the error class when invalid.
  const f = (name) => ({
    name,
    value: ['city','street','houseNum','floor'].includes(name)
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
