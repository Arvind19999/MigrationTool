import FlowCanvas from './components/FlowCanvas'
import PalettePanel from './components/PalettePanel'

const railItems = [
  { id: 'home', label: 'Studio' },
  { id: 'search', label: 'Explore' },
  { id: 'schedule', label: 'Schedules' },
  { id: 'runs', label: 'Runs' },
  { id: 'teams', label: 'Teams' },
  { id: 'settings', label: 'Settings' }
]

const stats = [
  { label: 'Active Jobs', value: '12' },
  { label: 'Last Run', value: '6m ago' },
  { label: 'Latency', value: '1.3s' }
]

export default function App() {
  return (
    <div className="app">
      <nav className="rail">
        <div className="rail-logo">ELT</div>
        <div className="rail-stack">
          {railItems.map((item, index) => (
            <button
              className={`rail-button ${index === 0 ? 'is-active' : ''}`}
              key={item.id}
              type="button"
              aria-label={item.label}
            >
              <span className={`rail-icon rail-${item.id}`}></span>
            </button>
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
        <header className="topbar">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h1 className="title">Atlas Growth Sync</h1>
          </div>
          <div className="topbar-actions">
            <div className="stats">
              {stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <p>{stat.value}</p>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <button className="primary-button" type="button">
              Run Pipeline
            </button>
          </div>
        </header>

        <div className="workspace">
          <PalettePanel />
          <section className="canvas-shell">
            <div className="canvas-header">
              <div className="tabs">
                <button className="tab is-active" type="button">
                  Flow Builder
                </button>
                <button className="tab" type="button">
                  Monitoring
                </button>
                <button className="tab" type="button">
                  Alerts
                </button>
              </div>
              <div className="canvas-actions">
                <button className="ghost-button" type="button">
                  Validate
                </button>
                <button className="ghost-button" type="button">
                  Publish
                </button>
              </div>
            </div>
            <FlowCanvas />
          </section>
        </div>

        <footer className="footer">
          <p>ELT Studio · Unified drag-and-drop pipeline design</p>
          <div className="footer-links">
            <button className="link-button" type="button">
              Docs
            </button>
            <button className="link-button" type="button">
              Support
            </button>
            <button className="link-button" type="button">
              Status
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
