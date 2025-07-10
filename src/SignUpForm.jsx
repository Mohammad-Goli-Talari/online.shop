import React, { useState } from 'react';

function SignUpForm() {
    const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
      e.preventDefault();

      let isValid = true;
      if (!formData.fullName.trim()) {
        alert('Full Name is required.');
        isValid = false;
      }
      if (!emailRegex.test(formData.email)) {
        alert('Invalid email format.');
        isValid = false;
      }
      if (!passwordRegex.test(formData.password)) {
        alert('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
        isValid = false;
      }

      if (isValid) {
        console.log('Form data submitted:', formData);
      }
    };

  return (
    <div className="container">
      <h2>ایجاد حساب کاربری</h2>
      <form onSubmit={handleSubmit}>
        <div className="info">
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="نام و نام خانوادگی"
            required
          />
        </div>
        <div className="info">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ایمیل"
            required
          />
        </div>
        <div className="info">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="رمز"
            required
          />
        </div>
        <button type="submit">ثبت نام</button>
      </form>
    </div>
  );
}

export default SignUpForm;