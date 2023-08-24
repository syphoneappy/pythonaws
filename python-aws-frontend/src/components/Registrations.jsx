import React, { useEffect, useState } from 'react';
import './Head/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Api from './Api';
import { Link } from 'react-router-dom';

const Registrations = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const getRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Api.post('/register/', {
        username: username,
        email: email,
        password: password,
      });
      setLoading(false);

      if (response.data.success) {
        setMessage({ success: response.data.success });
      } else {
        setMessage({
         message: "Failed to create... Something wrong with your data..."
        });
      }
    } catch (error) {
      setLoading(false);
      setMessage('An error occurred during registration.',error);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const hasValidLength = newPassword.length >= 8;
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(newPassword);

    setValidPassword(hasValidLength && hasNumber && hasSpecialChar);
  };

  return (
    <div className="group4-container">
      <img
        src="https://dummybucketdjango.s3.amazonaws.com/external/rectangle11819-ex5.svg"
        alt="Rectangle11819"
        className="group4-rectangle1 col-md-6 d-none d-md-block"
      />
      <div className="group4-group4 col-md-6 d-flex align-items-center justify-content-center">
        <div className="group4-group1">
          <div className="group4-frame1">
            <div className="group4-form">
              <span className="group4-text06 col-12">
                <span className='text-center'>Create Account</span>
              </span>
              <img
                src="https://dummybucketdjango.s3.amazonaws.com/external/line11820-14va.svg"
                alt="Line11820"
                className="group4-line1"
              />
            </div>
            <div className="group4-form">
                <span className='text-center'>Already have an account. <Link to={'/'}>LogIn</Link></span>
            </div>
            <form>
              <div className="form-group">
                <label className="sr-only">
                  Username
                </label>
                <div className="input-group mb-2">
                  <div className="input-group-prepend">
                    <div className="input-group-text">@</div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="inlineFormInputGroup"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
              <div className="form-group">
                <label >Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span className="toggle-password" id="togglePassword">
                  <i className="fa fa-eye" aria-hidden="true"></i>
                </span>
              </div>
              {!validPassword && (
                <div className="alert alert-danger col-12" role="alert">
                  Password must have 8 characters, 1 number, and 1 special
                  character.
                </div>
              )}
      {loading && (
        <div className="text-center m-5">
          <div className="spinner-border text-warning" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {message.message && (
                <div>
                <p style={{ textAlign: 'center', color: 'red', margin: '3px' }}>
                  {message.message} <Link to="/">Log In</Link>
                </p>
              </div>
      )}
      {message.success && (
        <div>
          <p style={{ textAlign: 'center', color: 'green', margin: '3px' }}>
            {message.success} <Link to="/">Log In</Link>
          </p>
        </div>
      )}
      {validPassword && (
        <button className="group4-text08" onClick={getRegister}>
          <span>Register Here</span>
        </button>
      )}


            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registrations;
