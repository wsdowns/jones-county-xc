import AthleteList from '../components/AthleteList'

function AthletesPage() {
  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="sr-only">Athletes - Jones County Cross Country</h1>
      <AthleteList />
    </main>
  )
}

export default AthletesPage
