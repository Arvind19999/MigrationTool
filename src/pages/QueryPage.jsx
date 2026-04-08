import { useParams } from 'react-router-dom'

export default function QueryPage() {
  const { id } = useParams()

  return (
    <div className="simple-page">
      <header className="simple-header">
        <h1>Query</h1>
        <p>Query workspace for pipeline {id}.</p>
      </header>
      <div className="simple-card">Query editor placeholder.</div>
    </div>
  )
}
