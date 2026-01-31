import { useState, useEffect } from 'react'

function AthleteList() {
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/athletes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch athletes')
        }
        return response.json()
      })
      .then(data => {
        setAthletes(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="text-gray-500">Loading athletes...</p>
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>
  }

  return (
    <div className="w-full max-w-2xl">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-center">Grade</th>
            <th className="px-4 py-3 text-right">Personal Record</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((athlete, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-3">{athlete.name}</td>
              <td className="px-4 py-3 text-center">{athlete.grade}</td>
              <td className="px-4 py-3 text-right">{athlete.personalRecord}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AthleteList
