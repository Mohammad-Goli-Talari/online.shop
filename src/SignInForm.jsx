import React from 'react';
import { Link } from 'react-router-dom';

const SignInForm = () => {
  return (
    <>
      <div>
        <h1>Sign in to your account</h1>
        <p>Don’t have an account? <Link className="Link" to="/">Get started</Link></p>
      </div>
    </>
  );
}

export default SignInForm;