import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { useSelector } from 'react-redux';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Zones from './pages/Zones';
import LostPersons from './pages/LostPersons';
import Medical from './pages/Medical';
import EmergencyExits from './pages/EmergencyExits';
import Feedback from './pages/Feedback';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <Layout>
                  <Events />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/zones"
            element={
              <PrivateRoute>
                <Layout>
                  <Zones />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/lost-persons"
            element={
              <PrivateRoute>
                <Layout>
                  <LostPersons />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/medical"
            element={
              <PrivateRoute>
                <Layout>
                  <Medical />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/emergency-exits"
            element={
              <PrivateRoute>
                <Layout>
                  <EmergencyExits />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Layout>
                  <Feedback />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
