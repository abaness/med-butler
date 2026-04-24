import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Medicine from './pages/Medicine'
import MedicineAdd from './pages/MedicineAdd'
import MedicineDetail from './pages/MedicineDetail'
import MedicineInteraction from './pages/MedicineInteraction'
import Schedule from './pages/Schedule'
import Services from './pages/Services'
import Refill from './pages/Refill'
import Consultation from './pages/Consultation'
import Prescription from './pages/Prescription'
import Family from './pages/Family'
import Profile from './pages/Profile'
import Chat from './pages/Chat'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/medicine" element={<Medicine />} />
        <Route path="/medicine/add" element={<MedicineAdd />} />
        <Route path="/medicine/interaction" element={<MedicineInteraction />} />
        <Route path="/medicine/:id" element={<MedicineDetail />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/refill" element={<Refill />} />
        <Route path="/services/consult" element={<Consultation />} />
        <Route path="/services/prescription" element={<Prescription />} />
        <Route path="/family" element={<Family />} />
        <Route path="/me" element={<Profile />} />
      </Route>
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
