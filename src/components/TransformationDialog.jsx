import { useEffect, useRef, useState } from 'react'

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

const unionSources = [
  {
    name: 'TM_Supplier',
    columns: ['id', 'customer', 'region', 'orders', 'status']
  },
  {
    name: 'TM_Supplier_2',
    columns: ['id', 'customer', 'region', 'orders', 'status']
  },
  {
    name: 'TM_Supplier_3',
    columns: ['id', 'customer', 'region', 'orders', 'status']
  }
]

const unionOutput = ['id', 'customer', 'region', 'orders', 'status']

const derivedFunctions = {
  'String Functions': ['Length', 'Concat', 'Lower', 'Upper', 'Trim', 'Replace'],
  'Numeric Functions': ['Abs', 'Round', 'Ceil', 'Floor', 'Pow', 'Sqrt'],
  'Date/Time Functions': ['Now', 'DateAdd', 'DateDiff', 'Year', 'Month', 'Day'],
  'Case Expressions': ['Case', 'When', 'Then', 'Else', 'End']
}

const derivedOperators = ['+', '-', '*', '/', '=', '!=', '>', '<', '>=', '<=', 'AND', 'OR']

const derivedDataTypes = ['String', 'Integer', 'Decimal', 'Date', 'Timestamp']

const aggregateColumns = [
  { name: 'c_custkey', type: 'Int' },
  { name: 'c_name', type: 'String' },
  { name: 'c_address', type: 'String' },
  { name: 'c_nationkey', type: 'Int' },
  { name: 'c_phone', type: 'String' },
  { name: 'c_acctbal', type: 'Decimal' },
  { name: 'c_mktsegment', type: 'String' },
  { name: 'c_comment', type: 'String' }
]

const aggregateFunctions = [
  'min',
  'max',
  'mean',
  'count',
  'sum',
  'sum distinct',
  'variance',
  'variance sample',
  'standard deviation',
  'standard deviation sample',
  'skewness'
]

const splitOperators = [
  '=',
  '!=',
  '>',
  '<',
  '>=',
  '<=',
  '+',
  '-',
  '*',
  '/',
  '%',
  '(',
  ')',
  'AND',
  'OR',
  'NOT',
  'IN',
  'LIKE',
  'NOT LIKE',
  'IS NULL',
  'IS NOT NULL'
]

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

  const title =
    type === 'pivot'
      ? 'Pivot'
      : type === 'unpivot'
        ? 'Unpivot'
        : type === 'union'
          ? 'Union'
          : type === 'derived'
            ? 'Derived Column'
            : type === 'aggregate'
              ? 'Aggregate'
              : type === 'split'
                ? 'Split'
              : type === 'route'
                ? 'Route'
                : 'Filter'
  const [filterInputDraft, setFilterInputDraft] = useState('')
  const [filterItems, setFilterItems] = useState([
    { id: 1, type: 'token', value: 'name' },
    { id: 2, type: 'token', value: 'contact' },
    { id: 3, type: 'token', value: '>' }
  ])
  const [filterFocusId, setFilterFocusId] = useState(null)
  const filterInputRefs = useRef({})
  const [routes, setRoutes] = useState([
    { id: 1, name: 'Route A', items: [], inputDraft: '' },
    { id: 2, name: 'Route B', items: [], inputDraft: '' }
  ])
  const [activeRoute, setActiveRoute] = useState(0)
  const [expressions, setExpressions] = useState([])
  const [derivedColumns, setDerivedColumns] = useState([
    { id: 1, name: 'total_revenue', alias: 'total_revenue', dataType: 'Decimal', expr: 'sum(revenue)' },
    { id: 2, name: 'customer_tier', alias: 'customer_tier', dataType: 'String', expr: "case when revenue > 1000 then 'Gold' end" }
  ])
  const [showDerivedForm, setShowDerivedForm] = useState(false)
  const [derivedName, setDerivedName] = useState('')
  const [derivedType, setDerivedType] = useState('String')
  const [derivedInputDraft, setDerivedInputDraft] = useState('')
  const [derivedItems, setDerivedItems] = useState([])
  const [derivedFocusId, setDerivedFocusId] = useState(null)
  const derivedInputRefs = useRef({})
  const [splitInputDraft, setSplitInputDraft] = useState('')
  const [splitItems, setSplitItems] = useState([
    { id: 1, type: 'token', value: 'c_custkey' },
    { id: 2, type: 'token', value: '>=' }
  ])
  const [splitFocusId, setSplitFocusId] = useState(null)
  const splitInputRefs = useRef({})
  const [aggregateRows, setAggregateRows] = useState(
    aggregateColumns.map((col, index) => ({
      id: index + 1,
      name: col.name,
      type: col.type,
      alias: col.name,
      agg: 'Select'
    }))
  )

  useEffect(() => {
    if (splitFocusId && splitInputRefs.current[splitFocusId]) {
      splitInputRefs.current[splitFocusId].focus()
      setSplitFocusId(null)
    }
  }, [splitFocusId, splitItems])

  useEffect(() => {
    if (filterFocusId && filterInputRefs.current[filterFocusId]) {
      filterInputRefs.current[filterFocusId].focus()
      setFilterFocusId(null)
    }
  }, [filterFocusId, filterItems])

  useEffect(() => {
    if (derivedFocusId && derivedInputRefs.current[derivedFocusId]) {
      derivedInputRefs.current[derivedFocusId].focus()
      setDerivedFocusId(null)
    }
  }, [derivedFocusId, derivedItems])

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
    event.dataTransfer.setData('application/elt-token', token)
    event.dataTransfer.setData('text/plain', token)
    event.dataTransfer.effectAllowed = 'copy'
  }

  const getDraggedToken = (event) =>
    event.dataTransfer.getData('application/elt-token') ||
    event.dataTransfer.getData('text/plain')

  const handleFilterDrop = (event) => {
    event.preventDefault()
    const internalId = event.dataTransfer.getData('application/filter-item')
    if (internalId) {
      setFilterItems((prev) => moveFilterItem(prev, Number(internalId)))
      return
    }
    const token = getDraggedToken(event)
    if (!token) return
    const newItem = createFilterItem(token)
    setFilterItems((prev) => insertFilterItem(prev, newItem))
    if (newItem.type === 'input') {
      setFilterFocusId(newItem.id)
    }
  }

  const handleFilterItemDrop = (event, targetIndex) => {
    event.stopPropagation()
    event.preventDefault()
    const internalId = event.dataTransfer.getData('application/filter-item')
    if (internalId) {
      setFilterItems((prev) => moveFilterItem(prev, Number(internalId), targetIndex))
      return
    }
    const token = getDraggedToken(event)
    if (!token) return
    const newItem = createFilterItem(token)
    setFilterItems((prev) => insertFilterItem(prev, newItem, targetIndex))
    if (newItem.type === 'input') {
      setFilterFocusId(newItem.id)
    }
  }

  const handleFilterItemDragStart = (event, itemId) => {
    event.dataTransfer.setData('application/filter-item', String(itemId))
    event.dataTransfer.effectAllowed = 'move'
  }

  const removeFilterItem = (itemId) => {
    setFilterItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateFilterInputValue = (itemId, value) => {
    setFilterItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, value } : item))
    )
  }

  const createFilterItem = (token) => {
    if (token === 'Input') {
      return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: 'input',
        value: filterInputDraft
      }
    }
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'token',
      value: token
    }
  }

  const insertFilterItem = (items, newItem, index) => {
    if (typeof index !== 'number') {
      return [...items, newItem]
    }
    return [...items.slice(0, index), newItem, ...items.slice(index)]
  }

  const moveFilterItem = (items, itemId, targetIndex) => {
    const fromIndex = items.findIndex((item) => item.id === itemId)
    if (fromIndex === -1) return items
    const next = [...items]
    const [moved] = next.splice(fromIndex, 1)
    const insertIndex =
      typeof targetIndex === 'number'
        ? fromIndex < targetIndex
          ? targetIndex - 1
          : targetIndex
        : next.length
    next.splice(insertIndex, 0, moved)
    return next
  }

  const handleRouteDrop = (event, routeIndex) => {
    event.preventDefault()
    const payload = event.dataTransfer.getData('application/route-item')
    if (payload) {
      const data = JSON.parse(payload)
      setRoutes((prev) => moveRouteItemBetween(prev, data.routeIndex, data.itemId, routeIndex))
      return
    }
    const token = getDraggedToken(event)
    if (!token) return
    setRoutes((prev) =>
      prev.map((route, idx) => {
        if (idx !== routeIndex) return route
        return {
          ...route,
          items: insertRouteItem(route.items, createRouteItem(token, route.inputDraft))
        }
      })
    )
  }

  const handleRouteItemDrop = (event, routeIndex, targetIndex) => {
    event.stopPropagation()
    event.preventDefault()
    const payload = event.dataTransfer.getData('application/route-item')
    if (payload) {
      const data = JSON.parse(payload)
      setRoutes((prev) =>
        moveRouteItemBetween(prev, data.routeIndex, data.itemId, routeIndex, targetIndex)
      )
      return
    }
    const token = getDraggedToken(event)
    if (!token) return
    setRoutes((prev) =>
      prev.map((route, idx) => {
        if (idx !== routeIndex) return route
        return {
          ...route,
          items: insertRouteItem(
            route.items,
            createRouteItem(token, route.inputDraft),
            targetIndex
          )
        }
      })
    )
  }

  const handleRouteItemDragStart = (event, routeIndex, itemId) => {
    event.dataTransfer.setData(
      'application/route-item',
      JSON.stringify({ routeIndex, itemId })
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  const removeRouteItem = (routeIndex, itemId) => {
    setRoutes((prev) =>
      prev.map((route, idx) =>
        idx === routeIndex
          ? { ...route, items: route.items.filter((item) => item.id !== itemId) }
          : route
      )
    )
  }

  const updateRouteItemValue = (routeIndex, itemId, value) => {
    setRoutes((prev) =>
      prev.map((route, idx) =>
        idx === routeIndex
          ? {
              ...route,
              items: route.items.map((item) =>
                item.id === itemId ? { ...item, value } : item
              )
            }
          : route
      )
    )
  }

  const updateRouteInputDraft = (routeIndex, value) => {
    setRoutes((prev) =>
      prev.map((route, idx) =>
        idx === routeIndex ? { ...route, inputDraft: value } : route
      )
    )
  }

  const createRouteItem = (token, draftValue) => {
    if (token === 'Input') {
      return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: 'input',
        value: draftValue || ''
      }
    }
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'token',
      value: token
    }
  }

  const insertRouteItem = (items, newItem, index) => {
    if (typeof index !== 'number') {
      return [...items, newItem]
    }
    return [...items.slice(0, index), newItem, ...items.slice(index)]
  }

  const moveRouteItem = (items, itemId, targetIndex) => {
    const fromIndex = items.findIndex((item) => item.id === itemId)
    if (fromIndex === -1) return items
    const next = [...items]
    const [moved] = next.splice(fromIndex, 1)
    const insertIndex =
      typeof targetIndex === 'number'
        ? fromIndex < targetIndex
          ? targetIndex - 1
          : targetIndex
        : next.length
    next.splice(insertIndex, 0, moved)
    return next
  }

  const moveRouteItemBetween = (routesList, fromRoute, itemId, toRoute, targetIndex) => {
    if (fromRoute === toRoute) {
      return routesList.map((route, idx) =>
        idx === fromRoute
          ? { ...route, items: moveRouteItem(route.items, itemId, targetIndex) }
          : route
      )
    }
    const movingItem = routesList[fromRoute]?.items.find((item) => item.id === itemId)
    if (!movingItem) return routesList
    return routesList.map((route, idx) => {
      if (idx === fromRoute) {
        return { ...route, items: route.items.filter((item) => item.id !== itemId) }
      }
      if (idx === toRoute) {
        return {
          ...route,
          items: insertRouteItem(route.items, movingItem, targetIndex)
        }
      }
      return route
    })
  }

  const addRoute = () => {
    setRoutes((prev) => {
      const next = [
        ...prev,
        { id: Date.now(), name: `Route ${prev.length + 1}`, items: [], inputDraft: '' }
      ]
      setActiveRoute(next.length - 1)
      return next
    })
  }

  const resetDerivedForm = () => {
    setDerivedName('')
    setDerivedType('String')
    setDerivedItems([])
    setDerivedInputDraft('')
  }

  const handleDerivedDrop = (event) => {
    event.preventDefault()
    const internalId = event.dataTransfer.getData('application/derived-item')
    if (internalId) {
      setDerivedItems((prev) => moveDerivedItem(prev, Number(internalId)))
      return
    }
    const token = getDraggedToken(event)
    if (!token) return
    const newItem = createDerivedItem(token)
    setDerivedItems((prev) => insertDerivedItem(prev, newItem))
    if (newItem.type === 'input') {
      setDerivedFocusId(newItem.id)
    }
  }

  const handleDerivedItemDrop = (event, targetIndex) => {
    event.stopPropagation()
    event.preventDefault()
    const internalId = event.dataTransfer.getData('application/derived-item')
    if (internalId) {
      setDerivedItems((prev) => moveDerivedItem(prev, Number(internalId), targetIndex))
      return
    }
    const token = getDraggedToken(event)
    if (!token) return
    const newItem = createDerivedItem(token)
    setDerivedItems((prev) => insertDerivedItem(prev, newItem, targetIndex))
    if (newItem.type === 'input') {
      setDerivedFocusId(newItem.id)
    }
  }

  const handleDerivedItemDragStart = (event, itemId) => {
    event.dataTransfer.setData('application/derived-item', String(itemId))
    event.dataTransfer.effectAllowed = 'move'
  }

  const removeDerivedItem = (itemId) => {
    setDerivedItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateDerivedInputValue = (itemId, value) => {
    setDerivedItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, value } : item))
    )
  }

  const createDerivedItem = (token) => {
    if (token === 'Input') {
      return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: 'input',
        value: derivedInputDraft
      }
    }
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'token',
      value: token
    }
  }

  const insertDerivedItem = (items, newItem, index) => {
    if (typeof index !== 'number') {
      return [...items, newItem]
    }
    return [...items.slice(0, index), newItem, ...items.slice(index)]
  }

  const moveDerivedItem = (items, itemId, targetIndex) => {
    const fromIndex = items.findIndex((item) => item.id === itemId)
    if (fromIndex === -1) return items
    const next = [...items]
    const [moved] = next.splice(fromIndex, 1)
    const insertIndex =
      typeof targetIndex === 'number'
        ? fromIndex < targetIndex
          ? targetIndex - 1
          : targetIndex
        : next.length
    next.splice(insertIndex, 0, moved)
    return next
  }

  const saveDerivedColumn = () => {
    const fallbackName = `derived_${derivedColumns.length + 1}`
    const name = derivedName.trim() || fallbackName
    const expr =
      [
        ...derivedItems.map((item) =>
          item.type === 'input' ? item.value || 'input' : item.value
        ),
        derivedItems.length === 0 && derivedInputDraft ? `'${derivedInputDraft}'` : ''
      ]
        .filter(Boolean)
        .join(' ') || 'expression'
    setDerivedColumns((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        alias: name,
        dataType: derivedType,
        expr
      }
    ])
    resetDerivedForm()
    setShowDerivedForm(false)
  }

  const duplicateAggregateRow = (rowId) => {
    setAggregateRows((prev) => {
      const target = prev.find((row) => row.id === rowId)
      if (!target) return prev
      return [
        ...prev,
        { ...target, id: Date.now() + Math.floor(Math.random() * 1000) }
      ]
    })
  }

  const handleSplitDrop = (event) => {
    event.preventDefault()
    const internalId = event.dataTransfer.getData('application/split-item')
    if (internalId) {
      setSplitItems((prev) => moveSplitItem(prev, Number(internalId)))
      return
    }
    const token = getDraggedToken(event)
    if (!token) return
    const newItem = createSplitItem(token)
    setSplitItems((prev) => insertSplitItem(prev, newItem))
    if (newItem.type === 'input') {
      setSplitFocusId(newItem.id)
    }
  }

  const clearSplit = () => {
    setSplitItems([])
    setSplitInputDraft('')
  }

  const removeSplitItem = (itemId) => {
    setSplitItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateSplitInputValue = (itemId, value) => {
    setSplitItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, value } : item))
    )
  }

  const handleSplitInputDragStart = (event) => {
    handleDragStart(event, 'Input')
  }

  const handleSplitItemDragStart = (event, itemId) => {
    event.dataTransfer.setData('application/split-item', String(itemId))
    event.dataTransfer.effectAllowed = 'move'
  }

  const createSplitItem = (token) => {
    if (token === 'Input') {
      return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: 'input',
        value: splitInputDraft
      }
    }
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'token',
      value: token
    }
  }

  const insertSplitItem = (items, newItem, index) => {
    if (typeof index !== 'number') {
      return [...items, newItem]
    }
    return [...items.slice(0, index), newItem, ...items.slice(index)]
  }

  const moveSplitItem = (items, itemId, targetIndex) => {
    const fromIndex = items.findIndex((item) => item.id === itemId)
    if (fromIndex === -1) return items
    const next = [...items]
    const [moved] = next.splice(fromIndex, 1)
    const insertIndex =
      typeof targetIndex === 'number'
        ? fromIndex < targetIndex
          ? targetIndex - 1
          : targetIndex
        : next.length
    next.splice(insertIndex, 0, moved)
    return next
  }

  const handleSplitItemDrop = (event, targetIndex) => {
    event.stopPropagation()
    event.preventDefault()
    const internalId = event.dataTransfer.getData('application/split-item')
    if (internalId) {
      setSplitItems((prev) => moveSplitItem(prev, Number(internalId), targetIndex))
      return
    }
    const token = getDraggedToken(event)
    if (!token) return
    const newItem = createSplitItem(token)
    setSplitItems((prev) => insertSplitItem(prev, newItem, targetIndex))
    if (newItem.type === 'input') {
      setSplitFocusId(newItem.id)
    }
  }

  const commitRouteExpression = (routeIndex) => {
    const route = routes[routeIndex]
    if (!route) return
    if (route.items.length === 0) return
    const payload = {
      id: Date.now(),
      name: route.name,
      items: route.items
    }
    setExpressions((prev) => [...prev, payload])
    setRoutes((prev) =>
      prev.map((item, idx) =>
        idx === routeIndex ? { ...item, items: [] } : item
      )
    )
  }

  const clearRoute = (routeIndex) => {
    setRoutes((prev) =>
      prev.map((item, idx) => (idx === routeIndex ? { ...item, items: [] } : item))
    )
  }

  const editExpression = (expressionId) => {
    const target = expressions.find((item) => item.id === expressionId)
    if (!target) return
    setRoutes((prev) =>
      prev.map((item, idx) =>
        idx === activeRoute
          ? { ...item, items: target.items }
          : item
      )
    )
    setExpressions((prev) => prev.filter((item) => item.id !== expressionId))
  }

  const deleteExpression = (expressionId) => {
    setExpressions((prev) => prev.filter((item) => item.id !== expressionId))
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
        ) : type === 'union' ? (
          <div className="dialog-body">
            <div className="union-layout">
              <div className="union-left">
                <div className="filter-section-title">Sources (Union)</div>
                <div className="union-sources">
                  {unionSources.map((source) => (
                    <div className="union-source" key={source.name}>
                      <div className="union-source-header">
                        <span>{source.name}</span>
                        <span className="union-pill">Input</span>
                      </div>
                      <div className="union-columns">
                        {source.columns.map((col) => (
                          <div className="union-col" key={`${source.name}-${col}`}>
                            <span className="dot dot-ok"></span>
                            {col}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="union-center">
                <div className="pivot-card">
                  <h4>Mapping</h4>
                  <div className="table">
                    <div className="table-row table-head">
                      <span>Source Column</span>
                      <span>Output Column</span>
                    </div>
                    {unionOutput.map((col) => (
                      <div className="table-row" key={`map-${col}`}>
                        <span>{col}</span>
                        <span>
                          <select defaultValue={col}>
                            {unionOutput.map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                          </select>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="union-right">
                <div className="pivot-card">
                  <h4>Output Columns</h4>
                  <div className="union-output">
                    {unionOutput.map((col) => (
                      <span className="chip" key={`out-${col}`}>
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <label className="union-checkbox">
              <input type="checkbox" defaultChecked />
              Remove duplicate rows (Union Distinct)
            </label>
          </div>
        ) : type === 'aggregate' ? (
          <div className="dialog-body">
            <div className="aggregate-toolbar">
              <div className="dialog-search">
                <input type="text" placeholder="Search..." />
              </div>
              <button className="ghost-button" type="button">
                ?
              </button>
            </div>
            <div className="table aggregate-table">
              <div className="table-row table-head">
                <span></span>
                <span>Column Name</span>
                <span>Alias</span>
                <span>Default Data Type</span>
                <span>Aggregation Type</span>
                <span></span>
              </div>
              {aggregateRows.map((col) => (
                <div className="table-row" key={`agg-${col.id}`}>
                  <span>
                    <input type="checkbox" defaultChecked />
                  </span>
                  <span>{col.name}</span>
                  <span>
                    <input type="text" defaultValue={col.alias} />
                  </span>
                  <span className="agg-type">
                    <span className="agg-pill">{col.type}</span>
                  </span>
                  <span>
                    <select defaultValue={col.agg}>
                      <option>Select</option>
                      {aggregateFunctions.map((fn) => (
                        <option key={fn}>{fn}</option>
                      ))}
                    </select>
                  </span>
                  <button
                    className="agg-add"
                    type="button"
                    onClick={() => duplicateAggregateRow(col.id)}
                    title="Duplicate row"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : type === 'split' ? (
          <div className="dialog-body">
            <div className="split-layout">
              <div className="split-left">
                <div className="filter-section">
                  <div className="filter-section-title">Available Fields</div>
                  <div className="filter-columns">
                    {columns.map((col) => (
                      <span
                        className="chip is-draggable"
                        key={`split-${col}`}
                        draggable
                        onDragStart={(event) => handleDragStart(event, col)}
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="filter-section">
                  <div className="filter-section-title">Operators</div>
                  <div className="filter-columns">
                    {splitOperators.map((op) => (
                      <span
                        className="chip chip-operator is-draggable"
                        key={`split-op-${op}`}
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
                    value={splitInputDraft}
                    onChange={(event) => setSplitInputDraft(event.target.value)}
                    placeholder="type value"
                  />
                  <div className="chip-row">
                    <span
                      className="chip chip-input is-draggable"
                      draggable
                      onDragStart={handleSplitInputDragStart}
                    >
                      Input Field
                    </span>
                  </div>
                </div>
              </div>
              <div className="split-right">
                <div className="split-header">
                  <p className="filter-label">Expression</p>
                  <button className="ghost-button" type="button" onClick={clearSplit}>
                    Clear
                  </button>
                </div>
                <div
                  className="expression-line split-expression"
                  onDrop={handleSplitDrop}
                  onDragOver={(event) => event.preventDefault()}
                >
                  {splitItems.length === 0 && (
                    <span className="expression-placeholder">
                      Drag fields/operators here...
                    </span>
                  )}
                  {splitItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`expression-piece ${item.type === 'input' ? 'is-input' : ''}`}
                      draggable
                      onDragStart={(event) => handleSplitItemDragStart(event, item.id)}
                      onDrop={(event) => handleSplitItemDrop(event, idx)}
                      onDragOver={(event) => event.preventDefault()}
                    >
                      {item.type === 'token' ? (
                        <button
                          className="expression-token"
                          type="button"
                          onClick={() => removeSplitItem(item.id)}
                          title="Remove"
                        >
                          {item.value}
                          <span className="token-remove">×</span>
                        </button>
                      ) : (
                        <div className="expression-input-wrap">
                          <input
                            className="expression-input"
                            type="text"
                            value={item.value}
                            onChange={(event) =>
                              updateSplitInputValue(item.id, event.target.value)
                            }
                            placeholder="input"
                            ref={(el) => {
                              if (el) splitInputRefs.current[item.id] = el
                            }}
                          />
                          <button
                            className="token-clear"
                            type="button"
                            onClick={() => removeSplitItem(item.id)}
                            title="Remove input"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : type === 'derived' ? (
          <div className="dialog-body">
            <div className="derived-toolbar">
              <div className="dialog-search">
                <input type="text" placeholder="Search columns..." />
              </div>
              <button className="icon-button" type="button" onClick={() => setShowDerivedForm(true)}>
                +
              </button>
            </div>
            <div className="table derived-table">
              <div className="table-row table-head">
                <span></span>
                <span>Column Name</span>
                <span>Alias</span>
                <span>Data Type</span>
                <span>Expression</span>
              </div>
              {derivedColumns.map((col) => (
                <div className="table-row" key={col.id}>
                  <span>
                    <input type="checkbox" defaultChecked />
                  </span>
                  <span>{col.name}</span>
                  <span>
                    <input type="text" defaultValue={col.alias} />
                  </span>
                  <span>
                    <select defaultValue={col.dataType}>
                      {derivedDataTypes.map((dt) => (
                        <option key={dt}>{dt}</option>
                      ))}
                    </select>
                  </span>
                  <span className="derived-expression">{col.expr}</span>
                </div>
              ))}
            </div>
            {showDerivedForm && (
              <div className="derived-overlay">
                <div className="derived-card">
                  <div className="dialog-header">
                    <div>
                      <p className="dialog-title">Derived Column</p>
                      <p className="dialog-subtitle">Build a new column expression.</p>
                    </div>
                    <div className="dialog-actions">
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => {
                          resetDerivedForm()
                          setShowDerivedForm(false)
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="dialog-body">
                    <div className="derived-form">
                      <label>
                        <span>Column Name</span>
                        <input
                          type="text"
                          value={derivedName}
                          onChange={(event) => setDerivedName(event.target.value)}
                          placeholder="new_column"
                        />
                      </label>
                      <label>
                        <span>Data Type</span>
                        <select
                          value={derivedType}
                          onChange={(event) => setDerivedType(event.target.value)}
                        >
                          {derivedDataTypes.map((dt) => (
                            <option key={dt}>{dt}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="derived-layout">
                      <div className="derived-left">
                        <div className="filter-section">
                          <div className="filter-section-title">Available Field</div>
                          <div className="filter-columns">
                            {columns.map((col) => (
                              <span
                                className="chip is-draggable"
                                key={`df-${col}`}
                                draggable
                                onDragStart={(event) => handleDragStart(event, col)}
                              >
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="filter-section">
                          <div className="filter-section-title">Available Functions</div>
                          {Object.entries(derivedFunctions).map(([group, items]) => (
                            <div className="derived-group" key={group}>
                              <p className="derived-group-title">{group}</p>
                              <div className="filter-columns">
                                {items.map((item) => (
                                  <span
                                    className="chip chip-operator is-draggable"
                                    key={`${group}-${item}`}
                                    draggable
                                    onDragStart={(event) =>
                                      handleDragStart(event, `${item}()`)
                                    }
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="filter-section">
                          <div className="filter-section-title">Available Operators</div>
                          <div className="filter-columns">
                            {derivedOperators.map((op) => (
                              <span
                                className="chip chip-operator is-draggable"
                                key={`op-${op}`}
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
                            value={derivedInputDraft}
                            onChange={(event) => setDerivedInputDraft(event.target.value)}
                            placeholder="type value"
                          />
                          <div className="chip-row">
                            <span
                              className="chip chip-input is-draggable"
                              draggable
                              onDragStart={(event) => handleDragStart(event, 'Input')}
                            >
                              Input Field
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="derived-right">
                        <p className="filter-label">Expression</p>
                        <div
                          className="expression-line"
                          onDrop={handleDerivedDrop}
                          onDragOver={(event) => event.preventDefault()}
                        >
                          {derivedItems.length === 0 && (
                            <span className="expression-placeholder">
                              Drag fields/functions/operators here...
                            </span>
                          )}
                          {derivedItems.map((item, idx) => (
                            <div
                              key={item.id}
                              className={`expression-piece ${item.type === 'input' ? 'is-input' : ''}`}
                              draggable
                              onDragStart={(event) => handleDerivedItemDragStart(event, item.id)}
                              onDrop={(event) => handleDerivedItemDrop(event, idx)}
                              onDragOver={(event) => event.preventDefault()}
                            >
                              {item.type === 'token' ? (
                                <button
                                  className="expression-token"
                                  type="button"
                                  onClick={() => removeDerivedItem(item.id)}
                                  title="Remove"
                                >
                                  {item.value}
                                  <span className="token-remove">×</span>
                                </button>
                              ) : (
                                <div className="expression-input-wrap">
                                  <input
                                    className="expression-input"
                                    type="text"
                                    value={item.value}
                                    onChange={(event) =>
                                      updateDerivedInputValue(item.id, event.target.value)
                                    }
                                    placeholder="input"
                                    ref={(el) => {
                                      if (el) derivedInputRefs.current[item.id] = el
                                    }}
                                  />
                                  <button
                                    className="token-clear"
                                    type="button"
                                    onClick={() => removeDerivedItem(item.id)}
                                    title="Remove input"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dialog-footer">
                    <button
                      className="ghost-button"
                      type="button"
                      onClick={() => {
                        resetDerivedForm()
                        setShowDerivedForm(false)
                      }}
                    >
                      Cancel
                    </button>
                    <button className="primary-button" type="button" onClick={saveDerivedColumn}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : type === 'route' ? (
          <div className="dialog-body">
            <div className="route-layout">
              <div className="route-left">
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
                    value={routes[activeRoute]?.inputDraft || ''}
                    onChange={(event) => updateRouteInputDraft(activeRoute, event.target.value)}
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
              <div className="route-right">
                <div className="route-toolbar">
                  <p className="filter-label">Saved Routes</p>
                  <button className="ghost-button" type="button" onClick={addRoute}>
                    + New Route
                  </button>
                </div>
                <div className="route-list">
                  {routes.map((route, idx) => (
                    <div
                      key={route.id}
                      className={`route-item ${idx === activeRoute ? 'is-active' : ''}`}
                      onClick={() => setActiveRoute(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') setActiveRoute(idx)
                      }}
                    >
                      <div className="route-row">
                        <span>{route.name}</span>
                        <span className="route-pill">Route</span>
                      </div>
                      <div
                        className="route-drop"
                        onDrop={(event) => handleRouteDrop(event, idx)}
                        onDragOver={(event) => event.preventDefault()}
                      >
                        {route.items.length === 0 && (
                          <span className="expression-placeholder">
                            Drag fields/operators into this route box...
                          </span>
                        )}
                        {route.items.map((item, itemIndex) => (
                          <div
                            key={item.id}
                            className={`expression-piece ${item.type === 'input' ? 'is-input' : ''}`}
                            draggable
                            onDragStart={(event) =>
                              handleRouteItemDragStart(event, idx, item.id)
                            }
                            onDrop={(event) => handleRouteItemDrop(event, idx, itemIndex)}
                            onDragOver={(event) => event.preventDefault()}
                          >
                            {item.type === 'token' ? (
                              <button
                                className="expression-token"
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  removeRouteItem(idx, item.id)
                                }}
                                title="Remove"
                              >
                                {item.value}
                                <span className="token-remove">×</span>
                              </button>
                            ) : (
                              <div className="expression-input-wrap">
                                <input
                                  className="expression-input"
                                  type="text"
                                  value={item.value}
                                  onChange={(event) =>
                                    updateRouteItemValue(idx, item.id, event.target.value)
                                  }
                                  placeholder="input"
                                  onClick={(event) => event.stopPropagation()}
                                />
                                <button
                                  className="token-clear"
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    removeRouteItem(idx, item.id)
                                  }}
                                  title="Remove input"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="route-actions">
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            commitRouteExpression(idx)
                          }}
                        >
                          Enter
                        </button>
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            clearRoute(idx)
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="filter-label">Expression</p>
                <div className="expression-list">
                  {expressions.length === 0 && (
                    <p className="expression-placeholder">
                      No expressions yet. Build a route and press Enter.
                    </p>
                  )}
                  {expressions.map((expr) => (
                    <div className="expression-item" key={expr.id}>
                      <div className="expression-chips">
                        {expr.items.map((item, tokenIndex) =>
                          item.type === 'input' ? (
                            <span
                              className="expression-token expression-input-token"
                              key={`${expr.id}-${tokenIndex}`}
                            >
                              {item.value || 'input'}
                            </span>
                          ) : (
                            <span className="expression-token" key={`${expr.id}-${tokenIndex}`}>
                              {item.value}
                            </span>
                          )
                        )}
                      </div>
                      <div className="expression-actions">
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={() => editExpression(expr.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={() => deleteExpression(expr.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
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
                    value={filterInputDraft}
                    onChange={(event) => setFilterInputDraft(event.target.value)}
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
                  onDrop={handleFilterDrop}
                  onDragOver={(event) => event.preventDefault()}
                >
                  {filterItems.length === 0 && (
                    <span className="expression-placeholder">
                      Drag fields and operators here...
                    </span>
                  )}
                  {filterItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`expression-piece ${item.type === 'input' ? 'is-input' : ''}`}
                      draggable
                      onDragStart={(event) => handleFilterItemDragStart(event, item.id)}
                      onDrop={(event) => handleFilterItemDrop(event, idx)}
                      onDragOver={(event) => event.preventDefault()}
                    >
                      {item.type === 'token' ? (
                        <button
                          className="expression-token"
                          type="button"
                          onClick={() => removeFilterItem(item.id)}
                          title="Remove"
                        >
                          {item.value}
                          <span className="token-remove">×</span>
                        </button>
                      ) : (
                        <div className="expression-input-wrap">
                          <input
                            className="expression-input"
                            type="text"
                            value={item.value}
                            onChange={(event) =>
                              updateFilterInputValue(item.id, event.target.value)
                            }
                            placeholder="input"
                            ref={(el) => {
                              if (el) filterInputRefs.current[item.id] = el
                            }}
                          />
                          <button
                            className="token-clear"
                            type="button"
                            onClick={() => removeFilterItem(item.id)}
                            title="Remove input"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
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
