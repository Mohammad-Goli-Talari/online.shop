import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
  // const navigate = useNavigate();

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
    <div className="container">
      <h2>Get started absolutely free</h2>
      <p>Already have an account? <Link to="/auth/sign-in">Get started</Link></p>
      <form onSubmit={handleSubmit}>
        <div className="info">
          <label htmlFor="firstName">First Name:</label>
          <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
          {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
        </div>
        <div className="info">
          <label htmlFor="lastName">Last Name:</label>
          <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
          {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
        </div>
        <div className="info">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        <div className="info">
          <label htmlFor="password">Password:</label>
          <input
            type={passwordType}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <span className="hidden-eye" onClick={handlePasswordToggle} style={{ cursor: 'pointer' }}>
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </span>
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;