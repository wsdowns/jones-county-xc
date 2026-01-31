import AthleteList from './components/AthleteList'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          Jones County XC
        </h1>
        <div className="flex justify-center">
          <AthleteList />
        </div>
      </div>
    </div>
  )
}

export default App
