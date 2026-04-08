import { useParams } from 'react-router-dom'

export default function JobPage() {
  const { id } = useParams()

  return (
    <div className="simple-page">
      <header className="simple-header">
        <h1>Job</h1>
        <p>Job details for run {id}.</p>
      </header>
      <div className="simple-card">Job history placeholder.</div>
    </div>
  )
}
