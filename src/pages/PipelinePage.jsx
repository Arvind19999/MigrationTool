import FlowCanvas from '../components/FlowCanvas'
import PalettePanel from '../components/PalettePanel'

const stats = [
  { label: 'Active Jobs', value: '12' },
  { label: 'Last Run', value: '6m ago' },
  { label: 'Latency', value: '1.3s' }
]

export default function PipelinePage() {
  return (
    <>
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
    </>
  )
}
