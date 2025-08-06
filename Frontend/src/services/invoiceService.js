// src/services/invoiceService.js
import apiClient from './apiClient.js';

export const invoiceService = {
  // Obtener todas las facturas
  async getAllInvoices() {
    return apiClient.get('/api/v1/invoices');
  },

  // Obtener una factura por ID
  async getInvoice(id) {
    return apiClient.get(`/api/v1/invoices/${id}`);
  },

  // Crear una nueva factura
  async createInvoice(invoiceData) {
    return apiClient.post('/api/v1/invoices', invoiceData);
  },

  // Actualizar una factura
  async updateInvoice(id, invoiceData) {
    return apiClient.put(`/api/v1/invoices/${id}`, invoiceData);
  },

  // Eliminar una factura
  async deleteInvoice(id) {
    return apiClient.delete(`/api/v1/invoices/${id}`);
  },

  // Subir archivo XML de factura
  async uploadXml(file) {
    const formData = new FormData();
    formData.append('xml_file', file);

    try {
      return await apiClient.request('/api/v1/invoices/upload_xml', {
        method: 'POST',
        body: formData,
        headers: {
          // No establecer Content-Type para FormData, el browser lo hará automáticamente
        },
      });
    } catch (error) {
      // Manejar específicamente errores de conflicto (409)
      if (error.message.includes('409')) {
        throw new Error('Esta factura ya existe en el sistema. No se pueden subir facturas duplicadas.');
      }
      throw error;
    }
  },

  // Generar complemento de pago
  async generatePaymentComplement(id) {
    return apiClient.post(`/api/v1/invoices/${id}/generate_payment_complement`);
  },

  // Descargar PDF de factura
  async downloadPdf(id) {
    try {
      const response = await fetch(`${apiClient.baseURL}/api/v1/invoices/${id}/download_pdf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      
      if (!response.ok) {
        let errorText;
        try {
          const errorJson = await response.json();
          errorText = errorJson.error || `HTTP ${response.status}`;
        } catch {
          errorText = await response.text() || `HTTP ${response.status}`;
        }
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('El archivo PDF está vacío');
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complemento-pago-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return blob;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  },

  // Descargar XML de factura
  async downloadXml(id) {
    try {
      const response = await fetch(`${apiClient.baseURL}/api/v1/invoices/${id}/download_xml`, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml',
        },
      });
      
      if (!response.ok) {
        let errorText;
        try {
          const errorJson = await response.json();
          errorText = errorJson.error || `HTTP ${response.status}`;
        } catch {
          errorText = await response.text() || `HTTP ${response.status}`;
        }
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('El archivo XML está vacío');
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `complemento-pago-${id}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return blob;
    } catch (error) {
      console.error('Error downloading XML:', error);
      throw error;
    }
  },
};

export default invoiceService;
