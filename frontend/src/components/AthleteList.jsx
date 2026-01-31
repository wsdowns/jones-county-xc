import { useQuery } from '@tanstack/react-query'

async function fetchAthletes() {
  const response = await fetch('/api/athletes')
  if (!response.ok) {
    throw new Error('Failed to fetch athletes')
  }
  return response.json()
}

function AthleteList() {
  const { data: athletes, isLoading, isError, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: fetchAthletes,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading athletes...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 font-medium">Error loading athletes</p>
        <p className="text-red-500 text-sm">{error.message}</p>
      </div>
    )
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
            <tr key={athlete.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
