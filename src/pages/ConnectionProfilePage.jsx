import { useMemo, useState } from 'react'

const profiles = [
  {
    name: 'MySQL Database Old',
    source: 'MySQL',
    checks: [true, true, false, true, true],
    enabled: true,
    uses: 'View Uses',
    updated: 'a day ago',
    updatedBy: 'DatafuseAI Demo Account'
  },
  {
    name: 'Postgres Database Old',
    source: 'PostgreSQL',
    checks: [true, true, true, true, true],
    enabled: true,
    uses: 'View Uses',
    updated: '13 days ago',
    updatedBy: 'DatafuseAI Demo Account'
  },
  {
    name: 'MySQL_TPCH',
    source: 'MySQL',
    checks: [true, false, true, false, true],
    enabled: false,
    uses: 'View Uses',
    updated: '16 days ago',
    updatedBy: 'DatafuseAI Demo Account'
  },
  {
    name: 'Postgres_TPCH',
    source: 'PostgreSQL',
    checks: [true, true, true, true, true],
    enabled: true,
    uses: 'View Uses',
    updated: '21 days ago',
    updatedBy: 'DatafuseAI Demo Account'
  },
  {
    name: 'Hotel Booking Demand',
    source: 'Upload',
    checks: [true, true, true, true, true],
    enabled: true,
    uses: 'View Uses',
    updated: '2 months ago',
    updatedBy: 'DatafuseAI Demo Account'
  }
]

const sourceOptions = [
  'BigQuery',
  'Cassandra',
  'Couchbase',
  'MongoDB',
  'MSSQL',
  'Oracle',
  'PostgreSQL',
  'MySQL',
  'Snowflake',
  'Redshift'
]

const sourceFields = {
  PostgreSQL: {
    params: ['Host', 'Port', 'Database', 'Schema', 'Username', 'Password'],
    advanced: ['SSL Mode', 'Connection Timeout', 'Statement Timeout']
  },
  MySQL: {
    params: ['Host', 'Port', 'Database', 'Username', 'Password'],
    advanced: ['SSL Mode', 'Charset', 'Timezone']
  },
  Snowflake: {
    params: ['Account', 'Warehouse', 'Database', 'Schema', 'Username', 'Password'],
    advanced: ['Role', 'Authenticator', 'Client Session Keep Alive']
  }
}

export default function ConnectionProfilePage() {
  const [showAddProfile, setShowAddProfile] = useState(false)
  const [selectedSource, setSelectedSource] = useState('')
  const [expandParams, setExpandParams] = useState(true)
  const [expandAdvanced, setExpandAdvanced] = useState(false)

  const currentFields = useMemo(() => {
    if (!selectedSource) return null
    return (
      sourceFields[selectedSource] || {
        params: ['Host', 'Port', 'Database', 'Username', 'Password'],
        advanced: ['SSL Mode', 'Connection Timeout']
      }
    )
  }, [selectedSource])

  return (
    <div className="connection-page">
      <header className="connection-header">
        <div>
          <p className="connection-eyebrow">Workspace</p>
          <h1>Connection Profiles</h1>
          <p className="connection-subtitle">
            Review, test, and manage source or destination connections.
          </p>
        </div>
        <div className="connection-actions">
          <button className="ghost-button" type="button">
            Test Connection
          </button>
          <button className="ghost-button" type="button">
            Action
          </button>
          <button className="ghost-button" type="button">
            Export
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setShowAddProfile(true)}
          >
            Add Profile
          </button>
        </div>
      </header>

      {!showAddProfile ? (
        <section className="connection-card">
          <div className="connection-toolbar">
            <div className="connection-search">
              <span>🔎</span>
              <input type="text" placeholder="Search connections..." />
            </div>
            <select className="connection-filter" defaultValue="all">
              <option value="all">All States</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            <div className="connection-meta">
              <span>1–5 of 5</span>
              <button className="ghost-button" type="button">
                ◀
              </button>
              <button className="ghost-button" type="button">
                ▶
              </button>
            </div>
          </div>

          <div className="connection-table">
            <div className="connection-row connection-head">
              <span></span>
              <span>Profile Name</span>
              <span>Source</span>
              <span>Connection Check</span>
              <span>Status</span>
              <span>Uses</span>
              <span>Last Modified</span>
              <span>Modified By</span>
            </div>
            {profiles.map((profile) => (
              <div className="connection-row" key={profile.name}>
                <span>
                  <input type="checkbox" />
                </span>
                <span className="connection-name">{profile.name}</span>
                <span className="connection-source">{profile.source}</span>
                <span className="connection-checks">
                  {profile.checks.map((ok, idx) => (
                    <span
                      className={`check-dot ${ok ? 'is-ok' : 'is-bad'}`}
                      key={`${profile.name}-${idx}`}
                    ></span>
                  ))}
                </span>
                <span>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked={profile.enabled} />
                    <span className="toggle-pill"></span>
                  </label>
                </span>
                <span className="connection-link">{profile.uses}</span>
                <span>{profile.updated}</span>
                <span>{profile.updatedBy}</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="profile-form-card">
          <div className="profile-breadcrumb">
            <button type="button" onClick={() => setShowAddProfile(false)}>
              Connection Profile
            </button>
            <span>›</span>
            <span>Add Profile</span>
          </div>
          <div className="profile-form">
            <div className="profile-form-header">
              <h2>Add Profile</h2>
              <p>Define a new connection and its driver settings.</p>
            </div>

            <div className="profile-grid">
              <label>
                <span>Profile Name *</span>
                <input type="text" placeholder="Enter profile name" />
                <em>Profile name is required</em>
              </label>
              <label>
                <span>Source *</span>
                <select
                  value={selectedSource}
                  onChange={(event) => {
                    setSelectedSource(event.target.value)
                    setExpandParams(true)
                  }}
                >
                  <option value="">Select Source</option>
                  {sourceOptions.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              {/* <label>
                <span>Path</span>
                <input type="text" placeholder="demo@datastudio.ai > Connection Profile" />
              </label> */}
              {/* <label>
                <span>Driver *</span>
                <div className="profile-row">
                  <select defaultValue="">
                    <option value="">Select Driver</option>
                    <option value="driver-1">Default Driver</option>
                  </select>
                  <button className="ghost-button" type="button">
                    ↻
                  </button>
                </div>
                <button className="ghost-link" type="button">
                  + Create new driver
                </button>
              </label> */}
              <label>
                <span>Driver Class *</span>
                <input type="text" placeholder="com.database.jdbc.Driver" />
              </label>
            </div>

            {selectedSource && (
              <div className="profile-panels">
                <div className="profile-panel">
                  <button
                    className="profile-panel-toggle"
                    type="button"
                    onClick={() => setExpandParams((prev) => !prev)}
                  >
                    <div>
                      <h3>Connection Parameters</h3>
                      <p>Source-specific credentials and endpoint settings.</p>
                    </div>
                    <span>{expandParams ? '−' : '+'}</span>
                  </button>
                  {expandParams && currentFields && (
                    <div className="profile-panel-body">
                      {currentFields.params.map((field) => (
                        <label key={field}>
                          <span>{field}</span>
                          <input type="text" placeholder={field} />
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="profile-panel">
                  <button
                    className="profile-panel-toggle"
                    type="button"
                    onClick={() => setExpandAdvanced((prev) => !prev)}
                  >
                    <div>
                      <h3>Advanced Properties</h3>
                      <p>Fine tune retries, SSL, and performance options.</p>
                    </div>
                    <span>{expandAdvanced ? '−' : '+'}</span>
                  </button>
                  {expandAdvanced && currentFields && (
                    <div className="profile-panel-body">
                      {currentFields.advanced.map((field) => (
                        <label key={field}>
                          <span>{field}</span>
                          <input type="text" placeholder={field} />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="profile-actions">
              <button
                className="ghost-button"
                type="button"
                onClick={() => setShowAddProfile(false)}
              >
                Cancel
              </button>
              <button className="ghost-button" type="button">
                Test Connection
              </button>
              <button className="primary-button" type="button">
                Save Profile
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
