import React, {useState} from 'react'
import AdminLayout from '../Components/adminlayout.jsx'
import DashboardContent from '../Components/admindashboard.jsx'
import AnalyticsContent from '../Components/adminanalytics.jsx'
import AdminProjectsContent from '../Components/adminprojects.jsx'
import AdminTasksContent from '../Components/admintasks.jsx'
import AdminClientContent from '../Components/adminclients.jsx'
import AdminSettingsContent from '../Components/adminsettings.jsx'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardContent />
      case 'Analytics': return <AnalyticsContent />
      case 'Projects': return <AdminProjectsContent />
      case 'Tasks': return <AdminTasksContent />
      case 'Clients': return <AdminClientContent />
      case 'Settings': return <AdminSettingsContent />
      default: return <DashboardContent />
    }
  }
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  )
}

export default Admin