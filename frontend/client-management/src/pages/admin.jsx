import React, {useState} from 'react'
import AdminLayout from '../Components/adminlayout.jsx'
import DashboardContent from '../Components/admindashboard.jsx'
import AnalyticsContent from '../Components/adminanalytics.jsx'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardContent />
      case 'Analytics': return <AnalyticsContent />
      case 'Projects': return <div>ProjectsContent</div>
      case 'Tasks': return <div>TasksContent</div>
      case 'Clients': return <div>ClientsContent</div>
      case 'Settings': return <div>SettingsContent</div>
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