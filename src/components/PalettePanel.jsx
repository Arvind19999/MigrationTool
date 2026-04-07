import { PALETTE } from '../data/palette'

const DATA_KEY = 'application/eltstudio-node'

export default function PalettePanel() {
  const handleDragStart = (event, item) => {
    event.dataTransfer.setData(DATA_KEY, JSON.stringify(item))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="palette">
      <div className="palette-header">
        <div>
          <p className="palette-title">Pipeline Blocks</p>
          <p className="palette-subtitle">Drag onto the canvas to build your ELT flow.</p>
        </div>
        <button className="ghost-button" type="button">
          Templates
        </button>
      </div>
      {PALETTE.map((section) => (
        <section className="palette-section" key={section.title}>
          <div className="palette-section-head">
            <span>{section.title}</span>
            <span className="palette-hint">{section.hint}</span>
          </div>
          <div className="palette-grid">
            {section.items.map((item) => (
              <button
                className={`palette-item palette-item-${item.kind}`}
                key={`${section.title}-${item.label}`}
                draggable
                type="button"
                onDragStart={(event) => handleDragStart(event, item)}
              >
                <span className={`badge badge-${item.kind}`}>{item.abbrev}</span>
                <div>
                  <p className="palette-label">{item.label}</p>
                  <p className="palette-meta">{item.meta}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </aside>
  )
}

export { DATA_KEY }
