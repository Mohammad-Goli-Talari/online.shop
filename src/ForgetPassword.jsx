import React from 'react';
import { Link } from 'react-router-dom';

function ForgetPassword() {
  return (
    <>
      <div>
        <h1>Forget your password</h1>
        <p>Don’t forget your password? <Link className="Link" to="/">Get started</Link></p>
      </div>
    </>
  );
}

export default ForgetPassword;