const summaryCards = [
  {
    title: 'Job',
    tone: 'job',
    stats: [
      { label: 'Total', value: '9' },
      { label: 'Running', value: '8' },
      { label: 'Active', value: '1' },
      { label: 'Failed', value: '0' }
    ]
  },
  {
    title: 'Pipeline',
    tone: 'pipeline',
    stats: [
      { label: 'Total', value: '38' },
      { label: 'Failed', value: '1' }
    ]
  },
  {
    title: 'Connection Profile',
    tone: 'connection',
    stats: [
      { label: 'Total', value: '5' },
      { label: 'Active', value: '5' },
      { label: 'Success', value: '5' },
      { label: 'Failed', value: '0' }
    ]
  }
]

const jobBars = [
  { label: 'Apr-2', height: 62 },
  { label: 'Apr-3', height: 62 },
  { label: 'Apr-4', height: 62 },
  { label: 'Apr-5', height: 62 },
  { label: 'Apr-6', height: 62 },
  { label: 'Apr-7', height: 62 },
  { label: 'Apr-8', height: 62 }
]

const pipelineBars = [
  { label: 'Apr-2', height: 18 },
  { label: 'Apr-3', height: 30 },
  { label: 'Apr-4', height: 18 },
  { label: 'Apr-5', height: 16 },
  { label: 'Apr-6', height: 40 },
  { label: 'Apr-7', height: 88 },
  { label: 'Apr-8', height: 22 }
]

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <p className="dashboard-eyebrow">Welcome Back</p>
        <h1 className="dashboard-title">Hello, DatafuseAI Demo Account</h1>
      </header>

      <section className="dashboard-top">
        {summaryCards.map((card) => (
          <div className={`summary-card summary-${card.tone}`} key={card.title}>
            <div className="summary-header">
              <span className="summary-icon" />
              <h3>{card.title}</h3>
            </div>
            <div className="summary-stats">
              {card.stats.map((stat) => (
                <div className="summary-stat" key={`${card.title}-${stat.label}`}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="usage-stack">
          <div className="usage-card">
            <div>
              <p>Disk Usage</p>
              <strong>45.8%</strong>
            </div>
            <div className="usage-bar">
              <span style={{ width: '45%' }}></span>
            </div>
            <small>22.1 / 48.3 GB</small>
          </div>
          <div className="usage-card">
            <div>
              <p>CPU Usage</p>
              <strong>76.2%</strong>
            </div>
            <div className="usage-bar">
              <span style={{ width: '76%' }}></span>
            </div>
            <small>Total Cores: 2</small>
          </div>
          <div className="usage-card">
            <div>
              <p>Memory Usage</p>
              <strong>36.7%</strong>
            </div>
            <div className="usage-bar">
              <span style={{ width: '37%' }}></span>
            </div>
            <small>24.7 / 77 GB</small>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Job Runs</h3>
            <button className="panel-select" type="button">
              7 days
            </button>
          </div>
          <div className="bar-chart">
            {jobBars.map((bar) => (
              <div className="bar" key={bar.label}>
                <span style={{ height: `${bar.height}%` }}></span>
                <label>{bar.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Pipeline Runs</h3>
            <button className="panel-select" type="button">
              7 days
            </button>
          </div>
          <div className="bar-chart">
            {pipelineBars.map((bar) => (
              <div className="bar" key={bar.label}>
                <span style={{ height: `${bar.height}%` }}></span>
                <label>{bar.label}</label>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Daily Query Runs</h3>
            <button className="panel-select" type="button">
              7 days
            </button>
          </div>
          <div className="panel-placeholder">Chart placeholder</div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Connection Profile</h3>
            <button className="panel-select" type="button">
              7 days
            </button>
          </div>
          <div className="panel-placeholder">Chart placeholder</div>
        </div>
      </section>
    </div>
  )
}
