import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';

function SignUpForm() {
    const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [passwordType, setPasswordType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

    const validateForm = () => {
      let newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required.';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required.';
    }
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        newErrors.email = 'Valid Email is required';
      }
      if (!formData.password.trim() || !passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
        console.log('Form Submitted:', formData);
        // Add your submission logic here (e.g., API call)
      } else {
        console.log('Form has errors');
      }
    };

  return (
    <>
      <div className="container">
        <div className="img-container">
          <h1>Manage the job</h1>
          <p>More effectively with optimized workflows.</p>
        </div>
        <div className="register-container">
          <div className="title">
            <h3>Get started absolutely free</h3>
            <p className="signin-link">Already have an account? <Link className="Link" to="/signin">Get started</Link></p>
          </div>
          <div className="form">
            <form onSubmit={handleSubmit}>
              <div className="full-name">
                <fieldset>
                  <legend>First name</legend>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
                </fieldset>
                <fieldset>
                  <legend>Last name</legend>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
                </fieldset>
              </div>
              <div className="email">
                <fieldset>
                  <legend>Email address</legend>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                </fieldset>
              </div>
              <div className="password">
                <fieldset>
                  <legend>Password</legend>
                  <input
                    type={passwordType}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="8+ characters"
                    required
                  />
                  <span className="hidden-eye" onClick={handlePasswordToggle} style={{ cursor: 'pointer' }}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </span>
                  {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                </fieldset>
              </div>
              <button type="submit">Create account</button>
            </form>
          </div>
        </div>
      </div> 
    </>
  );
}

export default SignUpForm;