import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Globe, TrendingUp } from 'lucide-react'

function DashboardIndex() {
  const dashboards = [
    {
      title: 'Geopolitical Analysis',
      description: 'Analyze and predict geopolitical decisions and their outcomes',
      path: '/dashboards/geopolitical',
      icon: <Globe className="w-8 h-8" />,
    },
    {
      title: 'Stock Analysis',
      description: 'Financial insights and interactive stock dashboards',
      path: '/dashboards/stocks',
      icon: <TrendingUp className="w-8 h-8" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold">AI Analysis Dashboards</h1>
      </header>
      <main className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboards.map((d) => (
            <Link
              key={d.path}
              to={d.path}
              className="block p-6 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 transition-colors"
            >
              <div className="mb-3 text-blue-400">{d.icon}</div>
              <h2 className="text-lg font-semibold mb-1">{d.title}</h2>
              <p className="text-sm text-gray-400">{d.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

function GeopoliticalPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <Link to="/" className="text-blue-400 hover:underline text-sm">&larr; Back to dashboards</Link>
      <h1 className="text-2xl font-bold mt-4">Geopolitical Analysis</h1>
      <p className="text-gray-400 mt-2">Dashboard content will go here.</p>
    </div>
  )
}

function StocksPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <Link to="/" className="text-blue-400 hover:underline text-sm">&larr; Back to dashboards</Link>
      <h1 className="text-2xl font-bold mt-4">Stock Analysis</h1>
      <p className="text-gray-400 mt-2">Dashboard content will go here.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardIndex />} />
        <Route path="/dashboards/geopolitical/*" element={<GeopoliticalPlaceholder />} />
        <Route path="/dashboards/stocks/*" element={<StocksPlaceholder />} />
      </Routes>
    </BrowserRouter>
  )
}
