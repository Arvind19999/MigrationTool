import { useCallback, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from 'reactflow'
import { DATA_KEY } from './PalettePanel'
import SourceDialog from './SourceDialog'
import TransformationDialog from './TransformationDialog'

const initialNodes = [
  {
    id: 'source-1',
    type: 'pipelineNode',
    position: { x: 80, y: 120 },
    data: {
      label: 'PostgreSQL Profile',
      abbrev: 'PG',
      kind: 'source',
      meta: 'Customer DB'
    }
  },
  {
    id: 'source-2',
    type: 'pipelineNode',
    position: { x: 80, y: 310 },
    data: {
      label: 'Clickstream API',
      abbrev: 'API',
      kind: 'source',
      meta: 'Events feed'
    }
  },
  {
    id: 'transform-1',
    type: 'pipelineNode',
    position: { x: 380, y: 200 },
    data: {
      label: 'Route + Filter',
      abbrev: 'RF',
      kind: 'transform',
      meta: 'Clean rules'
    }
  },
  {
    id: 'transform-2',
    type: 'pipelineNode',
    position: { x: 660, y: 120 },
    data: {
      label: 'Aggregation',
      abbrev: 'AGG',
      kind: 'transform',
      meta: 'Weekly rollups'
    }
  },
  {
    id: 'sink-1',
    type: 'pipelineNode',
    position: { x: 860, y: 220 },
    data: {
      label: 'Revenue Mart',
      abbrev: 'DWH',
      kind: 'sink',
      meta: 'Analytics'
    }
  }
]

const initialEdges = [
  { id: 'e1', source: 'source-1', target: 'transform-1', type: 'smoothstep' },
  { id: 'e2', source: 'source-2', target: 'transform-1', type: 'smoothstep' },
  { id: 'e3', source: 'transform-1', target: 'transform-2', type: 'smoothstep' },
  { id: 'e4', source: 'transform-2', target: 'sink-1', type: 'smoothstep' }
]

function PipelineNode({ data }) {
  const kindClass = data.kind || 'transform'

  return (
    <div className={`node-card node-${kindClass}`}>
      {data.kind !== 'source' && (
        <Handle
          type="target"
          position={Position.Left}
          className="node-handle"
        />
      )}
      <div className="node-header">
        <span className={`badge badge-${kindClass}`}>{data.abbrev}</span>
        <div>
          <p className="node-label">{data.label}</p>
          <p className="node-meta">{data.meta}</p>
        </div>
      </div>
      <div className="node-footer">
        <span className="node-kind">{data.kind}</span>
        <span className="node-status">Idle</span>
      </div>
      {data.kind !== 'sink' && (
        <Handle
          type="source"
          position={Position.Right}
          className="node-handle"
        />
      )}
    </div>
  )
}

export default function FlowCanvas() {
  const nodeTypes = useMemo(() => ({ pipelineNode: PipelineNode }), [])
  const idRef = useRef(10)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const [dialogNode, setDialogNode] = useState(null)
  const [transformDialog, setTransformDialog] = useState(null)

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'smoothstep',
            style: { stroke: 'var(--line)', strokeWidth: 2 }
          },
          eds
        )
      ),
    [setEdges]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()
      if (!reactFlowInstance) return

      const bounds = event.currentTarget.getBoundingClientRect()
      const payload = event.dataTransfer.getData(DATA_KEY)
      if (!payload) return

      const template = JSON.parse(payload)
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
      })

      const nextId = `node-${idRef.current++}`
      const newNode = {
        id: nextId,
        type: 'pipelineNode',
        position,
        data: {
          label: template.label,
          abbrev: template.abbrev,
          kind: template.kind,
          meta: template.meta
        }
      }

      setNodes((nds) => nds.concat(newNode))

      const shouldOpenSourceDialog =
        template.kind === 'source' &&
        template.label?.toLowerCase().includes('postgres')

      if (shouldOpenSourceDialog) {
        setTransformDialog(null)
        setDialogNode({ label: template.label })
      }
    },
    [reactFlowInstance, setNodes, setDialogNode, setTransformDialog]
  )

  const getTransformType = useCallback((label = '') => {
    const lower = label.toLowerCase()
    if (lower.includes('aggregate')) return 'aggregate'
    if (lower.includes('derived')) return 'derived'
    if (lower.includes('route')) return 'route'
    if (lower.includes('split')) return 'split'
    if (lower.includes('unpivot')) return 'unpivot'
    if (lower.includes('pivot')) return 'pivot'
    if (lower.includes('filter')) return 'filter'
    if (lower.includes('union')) return 'union'
    return null
  }, [])

  const handleNodeClick = useCallback(
    (_, node) => {
      if (node?.data?.kind === 'source' || node?.data?.kind === 'sink') {
        setTransformDialog(null)
        setDialogNode({ label: node.data.label, kind: node.data.kind })
        return
      }
      if (node?.data?.kind === 'transform') {
        const type = getTransformType(node.data.label)
        if (type) {
          setDialogNode(null)
          setTransformDialog({ label: node.data.label, type })
        }
      }
    },
    [getTransformType]
  )

  const closeDialog = useCallback(() => setDialogNode(null), [])
  const closeTransformDialog = useCallback(() => setTransformDialog(null), [])

  return (
    <div className="flow-shell">
      <div className="flow-canvas" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={22} size={1} color="var(--grid)" />
          <Controls position="bottom-right" />
        </ReactFlow>
        <div className="flow-hint">
          Drop nodes to design sources, transformations, and sinks.
        </div>
      </div>
      <SourceDialog open={Boolean(dialogNode)} node={dialogNode} onClose={closeDialog} />
      <TransformationDialog
        open={Boolean(transformDialog)}
        type={transformDialog?.type}
        node={transformDialog}
        onClose={closeTransformDialog}
      />
    </div>
  )
}
