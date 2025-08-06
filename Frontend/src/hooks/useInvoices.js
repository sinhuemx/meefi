import { useState, useEffect } from 'react'
import { invoiceService } from '../services/invoiceService'
import { message } from 'antd'

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await invoiceService.getAllInvoices()
      
      // Check if response is a Response object that needs to be parsed
      let invoicesData
      if (response instanceof Response) {
        invoicesData = await response.json()
      } else {
        invoicesData = response.data || response
      }
      
      setInvoices(Array.isArray(invoicesData) ? invoicesData : [])
    } catch (err) {
      setError(err.message || 'Error al cargar las facturas')
      console.error('Error fetching invoices:', err)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  const uploadInvoices = async (files) => {
    try {
      setError(null)
      const response = await invoiceService.uploadXml(files[0]) // Single file upload
      
      // Refresh the invoice list after successful upload
      await fetchInvoices()
      
      return response
    } catch (err) {
      // Manejar específicamente el error 409 (conflicto/duplicado)
      if (err.message.includes('409') || err.message.includes('conflict')) {
        setError('Esta factura ya fue cargada anteriormente. Cada factura solo puede subirse una vez.')
      } else {
        setError(err.message || 'Error al cargar el archivo XML')
      }
      throw err
    }
  }

  const generatePaymentComplement = async (invoiceId) => {
    try {
      setError(null)
      
      // Update invoice status optimistically
      setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, processing: true }
          : inv
      ))

      const response = await invoiceService.generatePaymentComplement(invoiceId)
      
      // Wait a bit for the job to complete, then refresh
      setTimeout(async () => {
        await fetchInvoices()
      }, 2000)

      return response
    } catch (err) {
      // Revert optimistic update on error
      setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, processing: false }
          : inv
      ))
      
      setError(err.message || 'Error al generar el complemento de pago')
      throw err
    }
  }

  const downloadFile = async (invoiceId, type) => {
    try {
      setError(null)
      
      if (type === 'pdf') {
        await invoiceService.downloadPdf(invoiceId)
        message.success('PDF descargado exitosamente')
      } else if (type === 'xml') {
        await invoiceService.downloadXml(invoiceId)
        message.success('XML descargado exitosamente')
      }
    } catch (err) {
      const errorMessage = err.message || `Error al descargar el archivo ${type.toUpperCase()}`
      setError(errorMessage)
      message.error(errorMessage)
      throw err
    }
  }

  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return {
    invoices,
    loading,
    error,
    uploadInvoices,
    generatePaymentComplement,
    downloadFile,
    clearError,
    refetch: fetchInvoices
  }
}
