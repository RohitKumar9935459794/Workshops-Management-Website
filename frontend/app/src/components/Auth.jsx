// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { registerUser, createUser } from '../services/api';
// // import './Auth.css'; // Create this CSS file

// // const Auth = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [usertype, setUsertype] = useState('admin'); // default usertype
// //   const [error, setError] = useState('');
// //   const navigate = useNavigate();

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setError('');

// //     try {
// //       const res = await loginUser(email, password);

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.msg || 'Login failed');
// //       }

// //       // Redirect on successful login
// //       navigate('/dashboard');
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };
// //   return (
// //     <div className="auth-container">
// //       <div className="auth-left">
// //         <div className="auth-image-container">
// //           <img 
// //             src="https://www.uxdt.nic.in/wp-content/uploads/2020/06/NIELIT-Preview.png" 
// //             alt="NIELIT Logo" 
// //             className="auth-image"
// //           />
// //         </div>
// //       </div>
// //       <div className="auth-right">
// //         <div className="auth-box">
// //           <h2>Workshop Management Login</h2>
// //           <form onSubmit={handleLogin}>
// //             <div className="form-group">
// //               <label>Email:</label>
// //               <input
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 required
// //               />
// //             </div>
// //             <div className="form-group">
// //               <label>Password:</label>
// //               <input
// //                 type="password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 required
// //               />
// //             </div>
// //             <div className="form-group">
// //               <label>User Type:</label>
// //               <select value={usertype} onChange={(e) => setUsertype(e.target.value)}>
// //                 <option value="admin">Admin</option>
// //                 <option value="subadmin">Subadmin</option>
// //                 <option value="student">Student</option>
// //               </select>
// //             </div>

// //             {error && <div className="error-message">{error}</div>}

// //             <button type="submit" className="login-btn">
// //               Login
// //             </button>

// //             <div className="forgot-password">
// //               <a href="/forgot-password">Forgot password?</a>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Auth;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Auth.css';

// const Auth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const res = await fetch('http://localhost:5000/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })  // ✅ Only email and password
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.msg || 'Login failed');
//       }

//       localStorage.setItem('token', data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-left">
//         <div className="auth-image-container">
//           <img
//             src="https://www.uxdt.nic.in/wp-content/uploads/2020/06/NIELIT-Preview.png"
//             alt="NIELIT Logo"
//             className="auth-image"
//           />
//         </div>
//       </div>
//       <div className="auth-right">
//         <div className="auth-box">
//           <h2>Workshop Management Login</h2>
//           <form onSubmit={handleLogin}>
//             <div className="form-group">
//               <label>Email:</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Password:</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {error && <div className="error-message">{error}</div>}
//             <button type="submit" className="login-btn">Login</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Auth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Optional: Redirect if already logged in
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) navigate('/dashboard');
//   }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const res = await fetch('http://localhost:5000/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();

//       const loginSuccess = res.ok && data.token;

//       if (loginSuccess) {
//         localStorage.setItem('token', data.token);
//         navigate('/dashboard');
//       } else {
//         throw new Error(data.msg || 'Login failed');
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="login-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
//       <h2 style={{ textAlign: 'center' }}>Login</h2>
//       {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
//       <form onSubmit={handleLogin}>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>
//         <button
//           type="submit"
//           style={{
//             width: '100%',
//             padding: '10px',
//             backgroundColor: '#007bff',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Auth;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Ensure this file contains your styles

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      const loginSuccess = res.ok && data.token;

      if (loginSuccess) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        throw new Error(data.msg || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-image-container">
          <img
            src="https://www.uxdt.nic.in/wp-content/uploads/2020/06/NIELIT-Preview.png"
            alt="NIELIT Logo"
            className="auth-image"
          />
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h2>Workshop Management Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
