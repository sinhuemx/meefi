import InvoiceList from './components/InvoiceList.jsx'
import InvoiceUpload from './components/InvoiceUpload.jsx'
import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('invoices')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 ">
      {/* Header */}
      <header className="header-gradient relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between py-6">
            <div>
                <h1 className="text-2xl font-bold text-blue">
                  XENON INDUSTRIAL ARTICLES <span className="text-red/80 text-sm mt-1">
                   * Carlos Sinhue Garcia Hernandez
                </span>
                </h1>
                
              </div>
            <div className="flex items-center space-x-4">
              
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        <div className="invoice-card p-0 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Cargar XMLs
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'invoices'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Facturas PPD
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && <InvoiceUpload />}
        {activeTab === 'invoices' && <InvoiceList />}
      </main>
    </div>
  )
}

export default App
