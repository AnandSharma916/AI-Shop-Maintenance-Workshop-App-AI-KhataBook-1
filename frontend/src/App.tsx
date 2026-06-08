import { Routes, Route } from 'react-router-dom';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Udhari from './pages/Udhari';
import JobCards from './pages/JobCards';
import Expenses from './pages/Expenses';
import Villages from './pages/Villages';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers';
import DashboardOverview from './components/DashboardOverview';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/udhari" element={<Udhari />} />
              <Route path="/villages" element={<Villages />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/jobcards" element={<JobCards />} />
            </Routes>
          </Layout>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
