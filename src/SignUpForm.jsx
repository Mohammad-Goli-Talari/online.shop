import React, { useState } from 'react';

function SignUpForm() {
    const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="container">
      <h2>ایجاد حساب کاربری</h2>
      <form onSubmit={handleSubmit}>
        <div className="info">
          <label htmlFor="fullName">نام و نام خانوادگی:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="info">
          <label htmlFor="email">ایمیل:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="info">
          <label htmlFor="password">رمز ورود:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">ورود</button>
      </form>
    </div>
  );
}

export default SignUpForm;