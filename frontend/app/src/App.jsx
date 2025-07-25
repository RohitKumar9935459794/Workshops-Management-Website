// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import Auth from './components/Auth';
// import Dashboard from './components/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import Workshops from './components/Workshops';
// import AddWorkshop from './components/AddWorkshop';
// import UploadParticipants from './components/UploadParticipants';  // Keep this if you're using it
// import Navbar from './components/Navbar';
// import WorkshopSuccess from './components/WorkshopSuccess';
// import WorkshopParticipant from './components/WorkshopParticipant';
//  import './App.css';
// import ParticipantTable from './components/ParticipantTable';

//   function App() {
//    return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Auth />} />
        
//         <Route element={(
//           <div className="app-layout">
//             <Navbar />
//             <div className="main-content">
//               <ProtectedRoute>
//                 <Outlet />
//               </ProtectedRoute>
//             </div>
//           </div>
//         )}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/workshops" element={<Workshops />} />
//           <Route path="/add-workshop" element={<AddWorkshop />} />
//           <Route path="/workshop-success" element={<WorkshopSuccess />} />
//           <Route path="/upload-participants" element={<UploadParticipants />} />
//           <Route path="/participant-reports" element={<ParticipantTable/>} />
//           <Route path="/workshops/:workshop_id/participants" element={<WorkshopParticipant />} />

//         </Route>
        
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Workshops from './components/Workshops';
import AddWorkshop from './components/AddWorkshop';
import UploadParticipants from './components/UploadParticipants';
import Navbar from './components/Navbar';
import WorkshopSuccess from './components/WorkshopSuccess';
import WorkshopParticipant from './components/WorkshopParticipant';
import './App.css';
import ParticipantTable from './components/ParticipantTable';
import Header from './components/Header';
import Footer from './components/Footer';
import RegisterUser from './components/RegisterUser'; // adjust path as needed

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className={`app-container ${isMenuOpen ? 'menu-open' : ''}`}>
        <Routes>
          <Route path="/login" element={null} />
          <Route path="*" element={
            <>
              <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Navbar activeTab={activeTab} setActiveTab={setActiveTab} className={isMenuOpen ? 'open' : ''} />
            </>
           } />
        </Routes>

        <div className="content-wrapper">
          <Routes>
            <Route path="/login" element={<Auth />} />
            
            <Route element={(
              <div className="app-layout">
                <div className="main-content">
                  <ProtectedRoute>
                    <Outlet />
                  </ProtectedRoute>
                </div>
              </div>
            )}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/add-workshop" element={<AddWorkshop />} />
              <Route path="/workshop-success" element={<WorkshopSuccess />} />
              <Route path="/upload-participants" element={<UploadParticipants />} />
              <Route path="/participant-reports" element={<ParticipantTable />} />
              <Route path="/workshops/:workshop_id/participants" element={<WorkshopParticipant />} />
               <Route path="/register" element={<RegisterUser />} /> 
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>

        <Routes>
          <Route path="/login" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;