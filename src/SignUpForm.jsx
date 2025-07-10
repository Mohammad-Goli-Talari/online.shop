import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignUpForm() {
    const [formData, setFormData] = useState({
    fullName: '',
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

      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full Name is required';
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
      <h2>Sing Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="info">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}
        </div>
        <div className="info">
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
          <input
            type={passwordType}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <span onClick={handlePasswordToggle} style={{ cursor: 'pointer' }}>
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