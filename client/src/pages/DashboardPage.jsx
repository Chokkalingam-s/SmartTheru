import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

import DistrictAdminDashboard from '../components/Dashboard/DistrictAdminDashboard';
import WardAdminDashboard from '../components/Dashboard/WardAdminDashboard';
import CollectorDashboard from '../components/Dashboard/CollectorDashboard';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case 'District Admin':
      return <DistrictAdminDashboard />;
    case 'Ward Admin':
      return <WardAdminDashboard />;
    case 'Collector':
      return <CollectorDashboard />;
    default:
      return <div>Unauthorized</div>;
  }
};

export default DashboardPage;
