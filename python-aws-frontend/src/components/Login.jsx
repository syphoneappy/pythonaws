import React ,{useState, useEffect} from 'react'
import './Head/index.css'
import { Link , useNavigate} from 'react-router-dom';
import { CircularProgress} from '@mui/material';
import Api from './Api';
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('AuthToken');
    if (authToken) {
      try {
        Api.get('/validate/', {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        })
          .then(() => {
            setLoggedIn(true);
            navigate('/dashboard');
          })
          .catch(() => {
            localStorage.removeItem('AuthToken');
            setLoggedIn(false);
          });
      } catch (error) {
        console.error(error);
        localStorage.removeItem('AuthToken');
        setLoggedIn(false);
      }
    }
  }, [navigate]);

  const getLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Api.post('/login/', {
        username: username,
        password: password,
      });
      setLoading(false);
      localStorage.setItem('AuthToken', response.data.token);
      setLoggedIn(true);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage('Invalid username or password... or server error');
    }
  };

  return (
    <div className="container-fluid text-center">
      <div className="row ">
        <img
          src="https://dummybucketdjango.s3.amazonaws.com/external/rectangle11819-ex5.svg"
          alt="Rectangle11819"
          className="group4-rectangle1 col-md-6 d-none d-md-block m-0"
        />
        <div className="group4-group4 col-md-6 d-flex align-items-center justify-content-center">
          <div className="group4-group1">
            <div className="group4-frame1">
              <div className="group4-form">
                <span className="group4-text06 text-center"> 
                  <span>LogIn to Account</span>
                </span>
                <img
                  src="https://dummybucketdjango.s3.amazonaws.com/external/line11820-14va.svg"
                  alt="Line11820"
                  className="group4-line1"
                />
              </div>
              <div className="group4-form">
                <span className='text-center'>New Here. &nbsp; <Link to={'/register'}>Register</Link></span>
            </div>
            
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
            <div className="form-group">
              <label >Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="toggle-password" id="togglePassword">
                <i className="fa fa-eye" aria-hidden="true"></i>
              </span>
            </div>
            {message && <div className="text-danger">{message}</div>}
            {loading && (
        <div className="text-center">
          <CircularProgress size={60} color="primary" />
        </div>
      )}
            <button className="group4-text08 justify-content-center" onClick={getLogin}>
              <span>Login Here</span>
            </button>
       
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login