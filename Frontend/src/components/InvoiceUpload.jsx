import React, { useState } from 'react'
import { useInvoices } from '../hooks/useInvoices'
import { message } from 'antd'

const InvoiceUpload = () => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { uploadInvoices } = useInvoices()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      const xmlFiles = droppedFiles.filter(file => file.name.toLowerCase().endsWith('.xml'))
      setFiles(prev => [...prev, ...xmlFiles])
    }
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const xmlFiles = selectedFiles.filter(file => file.name.toLowerCase().endsWith('.xml'))
    setFiles(prev => [...prev, ...xmlFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    try {
      // Upload files one by one
      for (const file of files) {
        await uploadInvoices([file])
      }
      
      setFiles([])
      message.success(`${files.length} factura(s) XML cargada(s) exitosamente`)
    } catch (error) {
      // Mostrar mensaje específico para facturas duplicadas
      if (error.message.includes('ya existe') || error.message.includes('ya fue cargada')) {
        message.warning(error.message)
      } else {
        message.error(`Error al cargar facturas: ${error.message}`)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Instructions */}
      <div className="invoice-card from-blue-50  border-blue-200">
        <div className="text-center">
         
          
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            Instrucciones para Carga de XMLs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Tipo de Facturas</p>
                  <p className="text-sm text-gray-600">Únicamente <strong>facturas PPD de ingreso emitidas</strong></p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Estado de Pago</p>
                  <p className="text-sm text-gray-600">Deben estar <strong>sin pagos realizados</strong></p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Formato</p>
                  <p className="text-sm text-gray-600">Únicamente archivos <strong>.xml</strong></p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Carga Múltiple</p>
                  <p className="text-sm text-gray-600">Arrastra y suelta <strong>múltiples archivos</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="invoice-card">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Arrastra y suelta tus archivos XML aquí
          </h3>
          <p className="text-gray-500 mb-4">
            o haz clic para seleccionar archivos
          </p>
          <input
            type="file"
            multiple
            accept=".xml"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="btn btn-primary cursor-pointer"
          >
            Seleccionar Archivos XML
          </label>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="invoice-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Archivos Seleccionados ({files.length})
          </h3>
          <div className="space-y-2 mb-6">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setFiles([])}
              className="btn btn-outline"
              disabled={uploading}
            >
              Limpiar Todo
            </button>
            <button
              onClick={uploadFiles}
              disabled={uploading || files.length === 0}
              className="btn btn-primary"
            >
              {uploading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Cargar Facturas
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceUpload
