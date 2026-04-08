import { useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import ConnectionProfilePage from './pages/ConnectionProfilePage'
import DashboardPage from './pages/DashboardPage'
import EnginePage from './pages/EnginePage'
import JobPage from './pages/JobPage'
import PipelinePage from './pages/PipelinePage'
import QueryPage from './pages/QueryPage'

const railItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },

  {
    id: 'connectionprofile',
    label: 'Connection Profile',
    path: '/connection_profile'
  },
  { id: 'pipeline', label: 'Pipeline', path: '/pipeline/123' },
  { id: 'query', label: 'Query', path: '/query/123' },
  { id: 'job', label: 'Job', path: '/job/123' },
  { id: 'engine', label: 'Engine', path: '/engine' }
]

export default function App() {
  const [railExpanded, setRailExpanded] = useState(false)

  return (
    <div className={`app ${railExpanded ? 'is-rail-expanded' : ''}`}>
      <nav className={`rail ${railExpanded ? 'is-expanded' : ''}`}>
        <div className="rail-header">
          <div className="rail-logo">ELT</div>
          <button
            className="rail-toggle"
            type="button"
            aria-label={railExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-pressed={railExpanded}
            onClick={() => setRailExpanded((prev) => !prev)}
          >
            <span className="rail-toggle-icon">{railExpanded ? '<' : '>'}</span>
          </button>
        </div>
        <div className="rail-stack">
          {railItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rail-button ${isActive ? 'is-active' : ''}`
              }
              key={item.id}
              to={item.path}
              aria-label={item.label}
              end={item.path === '/dashboard'}
            >
              <span className={`rail-icon rail-${item.id}`}></span>
              <span className="rail-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="rail-footer">
          <button className="rail-button" type="button" aria-label="Help">
            <span className="rail-icon rail-help"></span>
          </button>
          <div className="rail-avatar">RK</div>
        </div>
      </nav>

      <div className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pipeline/:id" element={<PipelinePage />} />
          <Route path="/connection_profile" element={<ConnectionProfilePage />} />
          <Route path="/query/:id" element={<QueryPage />} />
          <Route path="/job/:id" element={<JobPage />} />
          <Route path="/engine" element={<EnginePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  )
}
