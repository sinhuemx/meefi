const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle non-JSON responses (like file downloads)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Invoice related methods
  async getInvoices() {
    return this.request('/invoices');
  }

  async uploadInvoices(files) {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`invoices[${index}]`, file);
    });

    return this.request('/invoices/upload', {
      method: 'POST',
      headers: {
        // Don't set Content-Type header for FormData
      },
      body: formData,
    });
  }

  async generatePaymentComplement(invoiceId) {
    return this.request(`/invoices/${invoiceId}/generate_payment_complement`, {
      method: 'POST',
    });
  }

  async downloadInvoiceFile(invoiceId, fileType) {
    const response = await this.request(`/invoices/${invoiceId}/download/${fileType}`, {
      method: 'GET',
    });

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceId}.${fileType}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  }

  // Mock methods for development (remove when backend is ready)
  async mockUploadInvoices(files) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response with parsed invoices
    return {
      success: true,
      data: files.map((file, index) => ({
        id: `invoice-${Date.now()}-${index}`,
        client: `Cliente ${index + 1} SA de CV`,
        issueDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        uuid: `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`,
        subtotal: (Math.random() * 10000 + 1000).toFixed(2),
        total: (Math.random() * 11600 + 1160).toFixed(2),
        isPaid: Math.random() > 0.5,
        paymentComplementGenerated: Math.random() > 0.7,
        fileName: file.name
      }))
    };
  }

  async mockGeneratePaymentComplement(invoiceId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      data: {
        complementId: `comp-${Date.now()}`,
        message: 'Complemento de pago generado exitosamente'
      }
    };
  }

  async mockDownloadFile(invoiceId, type) {
    // Simulate file download
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const blob = new Blob([`Mock ${type.toUpperCase()} content for invoice ${invoiceId}`], {
      type: type === 'pdf' ? 'application/pdf' : 'application/xml'
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceId}.${type}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  }
}

export default new ApiService();