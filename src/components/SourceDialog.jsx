const tables = [
  {
    name: 'CUSTOMER',
    fields: ['ID', 'CREATED_AT', 'PICKUP_VOLUME', 'TAG', 'IS_VALID', 'APPROACH']
  },
  { name: 'ORDERS', fields: ['ORDER_ID', 'TOTAL', 'STATUS', 'CREATED_AT'] },
  { name: 'REGION', fields: ['REGION_ID', 'NAME', 'COUNTRY'] },
  { name: 'VIEW', fields: ['LAST_REFRESH', 'OWNER'] }
]

const columns = Array.from({ length: 10 }).map((_, index) => ({
  name: `TM_Supplier_${index + 1}`,
  alias: 'TM_Supplier',
  type: 'Decimal'
}))

export default function SourceDialog({ open, node, onClose }) {
  if (!open) return null
  const isSink = node?.kind === 'sink'
  const sinkColumns =
    node?.columns || [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'string' },
      { name: 'dob', type: 'date' }
    ]

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true">
      <div className="dialog-card">
        <div className="dialog-header">
          <div>
            <p className="dialog-title">
              {node?.label || 'RDBMS'} {isSink ? 'Sink' : 'Source'}
            </p>
            <p className="dialog-subtitle">
              {isSink
                ? 'Configure destination connection and load mapping.'
                : 'Configure connection and table mapping.'}
            </p>
          </div>
          <div className="dialog-actions">
            <button className="icon-button" type="button">
              ⤢
            </button>
            <button className="icon-button" type="button" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="dialog-body">
          {isSink ? (
            <>
              <div className="dialog-form">
                <label>
                  <span>Profile</span>
                  <select>
                    <option>Select</option>
                    <option>Production</option>
                    <option>Staging</option>
                  </select>
                </label>
                <label>
                  <span>Destination</span>
                  <input type="text" placeholder="warehouse_db" />
                </label>
                <label>
                  <span>Database</span>
                  <select>
                    <option>Select</option>
                    <option>warehouse</option>
                    <option>analytics</option>
                  </select>
                </label>
                <label>
                  <span>Schemas</span>
                  <select>
                    <option>Select</option>
                    <option>public</option>
                    <option>sales</option>
                  </select>
                </label>
                <label>
                  <span>Table Name</span>
                  <input type="text" placeholder="customer_results" />
                </label>
                <label className="dialog-checkbox">
                  <input type="checkbox" defaultChecked />
                  Override Table Name
                </label>
                <label>
                  <span>Table Strategy</span>
                  <select defaultValue="overwrite">
                    <option value="overwrite">Overwrite</option>
                    <option value="append">Append</option>
                    <option value="upsert">Upsert</option>
                  </select>
                </label>
                <button className="ghost-button dialog-gear" type="button">
                  ⚙
                </button>
              </div>

              <div className="dialog-table">
                <div className="dialog-table-header">
                  <div>
                    <h4>Incoming Columns</h4>
                    <p>Columns inferred from the connected node.</p>
                  </div>
                  <div className="dialog-table-actions">
                    <button className="ghost-button" type="button">
                      ?
                    </button>
                    <button className="ghost-button" type="button">
                      ⤢
                    </button>
                  </div>
                </div>
                <div className="dialog-search">
                  <input type="text" placeholder="Search columns..." />
                </div>
                <div className="table">
                  <div className="table-row table-head">
                    <span></span>
                    <span>Column Name</span>
                    <span>Data Type</span>
                  </div>
                  {sinkColumns.map((col, idx) => (
                    <div className="table-row" key={`${col.name}-${idx}`}>
                      <span>
                        <input type="checkbox" defaultChecked />
                      </span>
                      <span>{col.name}</span>
                      <span>
                        <select defaultValue={col.type}>
                          <option>int</option>
                          <option>string</option>
                          <option>date</option>
                          <option>decimal</option>
                        </select>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="dialog-form">
                <label>
                  <span>Profile</span>
                  <select>
                    <option>Select</option>
                    <option>Production</option>
                    <option>Staging</option>
                  </select>
                </label>
                <label>
                  <span>Source</span>
                  <input type="text" placeholder="customer_db" />
                </label>
                <label>
                  <span>Database</span>
                  <select>
                    <option>Select</option>
                    <option>warehouse</option>
                    <option>analytics</option>
                  </select>
                </label>
                <label>
                  <span>Schemas</span>
                  <select>
                    <option>Select</option>
                    <option>public</option>
                    <option>sales</option>
                  </select>
                </label>
                <button className="ghost-button dialog-gear" type="button">
                  ⚙
                </button>
              </div>

              <div className="dialog-tabs">
                <label className="radio">
                  <input type="radio" name="source-tab" defaultChecked />
                  Table
                </label>
                <label className="radio">
                  <input type="radio" name="source-tab" />
                  Query
                </label>
                <label className="radio">
                  <input type="radio" name="source-tab" />
                  Saved Queries
                </label>
              </div>

              <div className="dialog-grid">
                <div className="dialog-list">
                  <div className="dialog-search">
                    <input type="text" placeholder="Search tables..." />
                  </div>
                  {tables.map((table) => (
                    <div className="dialog-list-item" key={table.name}>
                      <div className="dialog-list-title">{table.name}</div>
                      <div className="dialog-tags">
                        {table.fields.slice(0, 3).map((field) => (
                          <span className="tag" key={field}>
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dialog-table">
                  <div className="dialog-table-header">
                    <div>
                      <h4>Customer Table</h4>
                      <p>Map columns and aliases for ingestion.</p>
                    </div>
                    <div className="dialog-table-actions">
                      <button className="ghost-button" type="button">
                        ?
                      </button>
                      <button className="ghost-button" type="button">
                        ⤢
                      </button>
                    </div>
                  </div>
                  <div className="dialog-search">
                    <input type="text" placeholder="Search columns..." />
                  </div>
                  <div className="table">
                    <div className="table-row table-head">
                      <span></span>
                      <span>Column Name</span>
                      <span>Alias</span>
                      <span>Data Type</span>
                    </div>
                    {columns.map((col, idx) => (
                      <div className="table-row" key={`${col.name}-${idx}`}>
                        <span>
                          <input type="checkbox" defaultChecked={idx < 4} />
                        </span>
                        <span>{col.name}</span>
                        <span>
                          <input type="text" defaultValue={col.alias} />
                        </span>
                        <span>
                          <select defaultValue={col.type}>
                            <option>Decimal</option>
                            <option>String</option>
                            <option>Date</option>
                          </select>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="dialog-footer">
          <button className="ghost-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={onClose}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
