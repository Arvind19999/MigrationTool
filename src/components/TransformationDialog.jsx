import { useState } from 'react'

const pivotFields = {
  groupBy: ['region', 'segment'],
  pivotKey: 'order_month',
  values: [
    { field: 'revenue', agg: 'Sum' },
    { field: 'orders', agg: 'Count' }
  ]
}

const unpivotFields = {
  groupBy: ['customer_id', 'region'],
  labelColumn: 'Metric',
  valueColumn: 'Value',
  selected: ['orders', 'revenue', 'discount']
}

const columns = [
  'customer_id',
  'region',
  'segment',
  'order_month',
  'revenue',
  'orders',
  'status',
  'created_at'
]

export default function TransformationDialog({ open, type, node, onClose }) {
  if (!open) return null

  const title = type === 'pivot' ? 'Pivot' : type === 'unpivot' ? 'Unpivot' : 'Filter'
  const [expressionTokens, setExpressionTokens] = useState(['name', 'contact', '>'])
  const [inputValue, setInputValue] = useState('')
  const [showInput, setShowInput] = useState(true)

  const operators = [
    '=',
    '!=',
    '>',
    '<',
    '>=',
    '<=',
    'IN',
    'NOT IN',
    'LIKE',
    'AND',
    'OR'
  ]

  const inputTokens = ['Input']

  const handleDragStart = (event, token) => {
    event.dataTransfer.setData('text/plain', token)
    event.dataTransfer.effectAllowed = 'copy'
  }

  const handleExpressionDrop = (event) => {
    event.preventDefault()
    const token = event.dataTransfer.getData('text/plain')
    if (!token) return
    if (token === 'Input') {
      setShowInput(true)
      return
    }
    setExpressionTokens((prev) => [...prev, token])
  }

  const removeToken = (index) => {
    setExpressionTokens((prev) => prev.filter((_, idx) => idx !== index))
  }

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true">
      <div className="dialog-card dialog-compact">
        <div className="dialog-header">
          <div>
            <p className="dialog-title">{title} Transformation</p>
            <p className="dialog-subtitle">{node?.label || 'Transform'} settings</p>
          </div>
          <div className="dialog-actions">
            <button className="icon-button" type="button" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {type === 'pivot' ? (
          <div className="dialog-body">
            <div className="pivot-layout">
              <div className="pivot-left">
                <div className="dialog-search">
                  <input type="text" placeholder="Search columns..." />
                </div>
                <div className="pivot-list">
                  {columns.map((col) => (
                    <label className="pivot-item" key={col}>
                      <input type="checkbox" defaultChecked={col === 'region'} />
                      <span>{col}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pivot-right">
                <div className="pivot-card">
                  <h4>Group By</h4>
                  <div className="chip-row">
                    {pivotFields.groupBy.map((field) => (
                      <span className="chip" key={field}>
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pivot-card">
                  <h4>Pivot Column</h4>
                  <select defaultValue={pivotFields.pivotKey}>
                    {columns.map((col) => (
                      <option key={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div className="pivot-card">
                  <h4>Values</h4>
                  {pivotFields.values.map((item) => (
                    <div className="pivot-value" key={item.field}>
                      <select defaultValue={item.field}>
                        {columns.map((col) => (
                          <option key={col}>{col}</option>
                        ))}
                      </select>
                      <select defaultValue={item.agg}>
                        <option>Sum</option>
                        <option>Count</option>
                        <option>Avg</option>
                        <option>Max</option>
                      </select>
                    </div>
                  ))}
                  <button className="ghost-button" type="button">
                    + Add value
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : type === 'unpivot' ? (
          <div className="dialog-body">
            <div className="unpivot-layout">
              <div className="unpivot-left">
                <div className="dialog-search">
                  <input type="text" placeholder="Search columns..." />
                </div>
                <div className="unpivot-list">
                  {columns.map((col) => (
                    <label className="pivot-item" key={col}>
                      <input
                        type="checkbox"
                        defaultChecked={unpivotFields.selected.includes(col)}
                      />
                      <span>{col}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="unpivot-center">
                <div className="pivot-card">
                  <h4>Group By Columns</h4>
                  <div className="chip-row">
                    {unpivotFields.groupBy.map((field) => (
                      <span className="chip" key={field}>
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pivot-card">
                  <h4>Unpivot Settings</h4>
                  <label className="unpivot-field">
                    <span>Pivot Key</span>
                    <input type="text" defaultValue={unpivotFields.labelColumn} />
                  </label>
                  <label className="unpivot-field">
                    <span>Value Key</span>
                    <input type="text" defaultValue={unpivotFields.valueColumn} />
                  </label>
                </div>
              </div>
              <div className="unpivot-right">
                <div className="pivot-card">
                  <h4>Pivot Values Selected</h4>
                  <div className="chip-row">
                    {unpivotFields.selected.map((field) => (
                      <span className="chip chip-input" key={field}>
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="dialog-body">
            <div className="filter-top">
              <label>
                <span>Input Dataset</span>
                <select>
                  <option>Route + Filter</option>
                  <option>Customer Staging</option>
                </select>
              </label>
              <label>
                <span>Mode</span>
                <select>
                  <option>Keep Matching</option>
                  <option>Exclude Matching</option>
                </select>
              </label>
            </div>
            <div className="filter-layout">
              <div className="filter-left">
                <div className="filter-section">
                  <div className="filter-section-title">Available Field</div>
                  <div className="dialog-search">
                    <input type="text" placeholder="Search fields..." />
                  </div>
                  <div className="filter-columns">
                    {columns.map((col) => (
                      <span
                        className="chip is-draggable"
                        key={col}
                        draggable
                        onDragStart={(event) => handleDragStart(event, col)}
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="filter-section">
                  <div className="filter-section-title">Operator</div>
                  <div className="filter-columns">
                    {operators.map((op) => (
                      <span
                        className="chip chip-operator is-draggable"
                        key={op}
                        draggable
                        onDragStart={(event) => handleDragStart(event, op)}
                      >
                        {op}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="filter-section">
                  <div className="filter-section-title">Input</div>
                  <input
                    className="input-inline"
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="type value"
                  />
                  <div className="chip-row">
                    {inputTokens.map((token) => (
                      <span
                        className="chip chip-input is-draggable"
                        key={token}
                        draggable
                        onDragStart={(event) => handleDragStart(event, token)}
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="filter-right">
                <p className="filter-label">Expression</p>
                <div
                  className="expression-line"
                  onDrop={handleExpressionDrop}
                  onDragOver={(event) => event.preventDefault()}
                >
                  {expressionTokens.length === 0 && (
                    <span className="expression-placeholder">
                      Drag fields and operators here...
                    </span>
                  )}
                  {expressionTokens.map((token, idx) => (
                    <button
                      className="expression-token"
                      key={`${token}-${idx}`}
                      type="button"
                      onClick={() => removeToken(idx)}
                      title="Remove"
                    >
                      {token}
                      <span className="token-remove">×</span>
                    </button>
                  ))}
                  {showInput && (
                    <div className="expression-input-wrap">
                      <input
                        className="expression-input"
                        type="text"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        placeholder="input"
                      />
                      <button
                        className="token-clear"
                        type="button"
                        onClick={() => setShowInput(false)}
                        title="Remove input"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <p className="filter-help">
                  Tip: drag fields/operators, then enter any input value.
                </p>
              </div>
            </div>
          </div>
        )}

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
