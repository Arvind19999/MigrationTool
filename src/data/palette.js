export const PALETTE = [
  {
    title: 'Sources',
    hint: 'Databases, streams, and files',
    items: [
      { label: 'PostgreSQL', abbrev: 'PG', kind: 'source', meta: 'RDBMS' },
      { label: 'MySQL', abbrev: 'MY', kind: 'source', meta: 'RDBMS' },
      { label: 'MsSql', abbrev: 'MS', kind: 'source', meta: 'RDBMS' },
      { label: 'Snowflake', abbrev: 'SF', kind: 'source', meta: 'RDBMS' },
      { label: 'MariaDB', abbrev: 'MR', kind: 'source', meta: 'RDBMS' },
      { label: 'Saphana', abbrev: 'SAP', kind: 'source', meta: 'RDBMS' },
      { label: 'MonetDB', abbrev: 'MDB', kind: 'source', meta: 'RDBMS' }
    ]
  },
  {
    title: 'Transformations',
    hint: 'Shape, clean, and enrich',
    items: [
      { label: 'Filter', abbrev: 'FLT', kind: 'transform', meta: 'Row rules' },
      { label: 'Join', abbrev: 'JIN', kind: 'transform', meta: 'Relational merge' },
      { label: 'Aggregate', abbrev: 'AGG', kind: 'transform', meta: 'Group stats' },
      { label: 'Dedupe', abbrev: 'DUP', kind: 'transform', meta: 'Unique rows' },
      { label: 'Derived', abbrev: 'DRV', kind: 'transform', meta: 'New column' },
      { label: 'Pivot', abbrev: 'PVT', kind: 'transform', meta: 'Rotate columns' },
      { label: 'Unpivot', abbrev: 'UNP', kind: 'transform', meta: 'Unfold columns' },
      { label: 'Union', abbrev: 'UNI', kind: 'transform', meta: 'Stack sets' },
      { label: 'Route', abbrev: 'RTE', kind: 'transform', meta: 'Branch flow' },
      { label: 'Split', abbrev: 'SPT', kind: 'transform', meta: 'Divied In Two' },
      { label: 'Derived', abbrev: 'DRV', kind: 'transform', meta: 'New Column' },
      { label: 'Pivot', abbrev: 'PVT', kind: 'transform', meta: 'Row To Col' },
      { label: 'UnPivot', abbrev: 'UPVT', kind: 'transform', meta: 'Col To Row' }
    ]
  },
  {
    title: 'Sinks',
    hint: 'Warehouses and destinations',
    items: [
      { label: 'PostgreSQL', abbrev: 'PG', kind: 'sink', meta: 'RDBMS' },
      { label: 'MySQL', abbrev: 'MY', kind: 'sink', meta: 'RDBMS' },
      { label: 'MsSql', abbrev: 'MS', kind: 'sink', meta: 'RDBMS' },
      { label: 'Snowflake', abbrev: 'SF', kind: 'sink', meta: 'RDBMS' },
      { label: 'MariaDB', abbrev: 'MR', kind: 'sink', meta: 'RDBMS' },
      { label: 'Saphana', abbrev: 'SAP', kind: 'sink', meta: 'RDBMS' },
      { label: 'MonetDB', abbrev: 'MDB', kind: 'sink', meta: 'RDBMS' }
    ]
  }
]
