import { useState, useEffect } from 'react'
import './App.css'

const getSeverityColor = (population, cases) => {
  if (!population || !cases) return 'low'
  const casesPerHundredK = (cases / population) * 100000
  if (casesPerHundredK < 1000) return 'low'
  if (casesPerHundredK < 5000) return 'medium'
  return 'high'
}

function CountrySelector({ countries, selectedCountry, onSelect }) {
  return (
    <div className="selector-container">
      <label htmlFor="country-select">Select Country</label>
      <div className="select-wrapper">
        <select
          id="country-select"
          value={selectedCountry}
          onChange={(e) => onSelect(e.target.value)}
          className="country-select"
        >
          <option value="">🌍 Choose a country</option>
          {countries && countries.length > 0 ? (
            countries.map((country, index) => (
              <option key={`${country.country}-${index}`} value={country.country}>
                {country.country}
              </option>
            ))
          ) : (
            <option disabled>Loading countries...</option>
          )}
        </select>
        <span className="select-arrow">▼</span>
      </div>
    </div>
  )
}

function StatsCard({ stat, value, label }) {
  return (
    <div className={`stat-card stat-${stat}`}>
      <div className="stat-icon">
        {stat === 'cases' && '🔴'}
        {stat === 'recovered' && '✅'}
        {stat === 'deaths' && '💔'}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value.toLocaleString()}</div>
    </div>
  )
}

function CardView({ data, population }) {
  const severity = getSeverityColor(population, data.cases)
  
  return (
    <div className={`card-view severity-${severity}`}>
      <div className="card-header">
        <h2>{data.country}</h2>
        <span className={`severity-badge severity-${severity}`}>
          {severity === 'low' && '🟢 Low Risk'}
          {severity === 'medium' && '🟡 Medium Risk'}
          {severity === 'high' && '🔴 High Risk'}
        </span>
      </div>
      
      <div className="stats-grid">
        <StatsCard stat="cases" value={data.cases} label="Total Cases" />
        <StatsCard stat="recovered" value={data.recovered || 0} label="Recovered" />
        <StatsCard stat="deaths" value={data.deaths} label="Deaths" />
      </div>

      <div className="additional-info">
        <div className="info-row">
          <div className="info-label">Population</div>
          <div className="info-value">{population?.toLocaleString() || 'N/A'}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Last Updated</div>
          <div className="info-value">{new Date(data.updated).toLocaleDateString()}</div>
        </div>
        <div className="info-row">
          <div className="info-label">Recovery Rate</div>
          <div className="info-value">
            {data.cases > 0 ? ((data.recovered / data.cases) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
    </div>
  )
}

function TableView({ data, population }) {
  const severity = getSeverityColor(population, data.cases)
  const recoveryRate = data.cases > 0 ? ((data.recovered / data.cases) * 100).toFixed(1) : 0
  const deathRate = data.cases > 0 ? ((data.deaths / data.cases) * 100).toFixed(1) : 0
  
  return (
    <div className={`table-container severity-${severity}`}>
      <table className="stats-table">
        <tbody>
          <tr className="table-header-row">
            <td colSpan="2" className="table-title">COVID-19 Statistics for {data.country}</td>
          </tr>
          <tr>
            <td className="label">🔴 Total Cases</td>
            <td className="value">{data.cases.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="label">✅ Recovered</td>
            <td className="value">{(data.recovered || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td className="label">💔 Deaths</td>
            <td className="value">{data.deaths.toLocaleString()}</td>
          </tr>
          <tr className="divider">
            <td colSpan="2"></td>
          </tr>
          <tr>
            <td className="label">👥 Population</td>
            <td className="value">{population?.toLocaleString() || 'N/A'}</td>
          </tr>
          <tr>
            <td className="label">📊 Recovery Rate</td>
            <td className="value highlight">{recoveryRate}%</td>
          </tr>
          <tr>
            <td className="label">📉 Death Rate</td>
            <td className="value highlight">{deathRate}%</td>
          </tr>
          <tr>
            <td className="label">📅 Last Updated</td>
            <td className="value">{new Date(data.updated).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function GlobalSummary({ globalStats }) {
  if (!globalStats) return null
  
  return (
    <div className="global-summary">
      <div className="summary-header">
        <h2>🌍 Global COVID-19 Summary</h2>
        <p>Worldwide Statistics</p>
      </div>
      <div className="global-stats-grid">
        <div className="global-stat">
          <div className="global-icon">🔴</div>
          <div className="global-label">Total Cases</div>
          <div className="global-value">{(globalStats.cases / 1000000).toFixed(1)}M</div>
        </div>
        <div className="global-stat">
          <div className="global-icon">✅</div>
          <div className="global-label">Recovered</div>
          <div className="global-value">{(globalStats.recovered / 1000000).toFixed(1)}M</div>
        </div>
        <div className="global-stat">
          <div className="global-icon">💔</div>
          <div className="global-label">Deaths</div>
          <div className="global-value">{(globalStats.deaths / 1000000).toFixed(1)}M</div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [countryData, setCountryData] = useState(null)
  const [globalStats, setGlobalStats] = useState(null)
  const [viewMode, setViewMode] = useState('card')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://disease.sh/v3/covid-19/countries')
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!Array.isArray(data)) {
          console.error('Invalid data format:', data)
          throw new Error('Invalid data format from API')
        }
        
        const sortedCountries = data.sort((a, b) =>
          a.country.localeCompare(b.country)
        )
        
        console.log(`Successfully loaded ${sortedCountries.length} countries`)
        setCountries(sortedCountries)
      } catch (err) {
        console.error('Error fetching countries:', err)
        setError('Failed to load countries. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const response = await fetch('https://disease.sh/v3/covid-19/all')
        const data = await response.json()
        setGlobalStats(data)
      } catch (err) {
        console.error('Failed to fetch global stats:', err)
      }
    }

    fetchGlobalStats()
  }, [])

  useEffect(() => {
    if (!selectedCountry) {
      setCountryData(null)
      return
    }

    const fetchCountryData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(
          `https://disease.sh/v3/covid-19/countries/${selectedCountry}`
        )
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }
        
        const data = await response.json()
        console.log(`Loaded data for ${selectedCountry}:`, data)
        setCountryData(data)
      } catch (err) {
        console.error(`Error fetching data for ${selectedCountry}:`, err)
        setError(`Failed to fetch data for ${selectedCountry}`)
        setCountryData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCountryData()
  }, [selectedCountry])

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">COVID-19 Tracker</h1>
          <p className="app-subtitle">Real-time Global Statistics</p>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <GlobalSummary globalStats={globalStats} />

        <section className="dashboard-section">
          <div className="dashboard-container">
            <CountrySelector
              countries={countries}
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
            />

            {selectedCountry && (
              <>
                <div className="view-controls">
                  <button
                    className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
                    onClick={() => setViewMode('card')}
                  >
                    <span className="btn-icon">📋</span>
                    Card View
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    <span className="btn-icon">📊</span>
                    Table View
                  </button>
                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading statistics...</p>
                  </div>
                ) : countryData ? (
                  viewMode === 'card' ? (
                    <CardView data={countryData} population={countryData.population} />
                  ) : (
                    <TableView data={countryData} population={countryData.population} />
                  )
                ) : null}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>📊 Data from <a href="https://disease.sh/" target="_blank" rel="noopener noreferrer">disease.sh API</a></p>
        <p className="footer-note">Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  )
}

export default App
