class Invoice < ApplicationRecord
  validates :client_name, presence: true
  validates :emission_date, presence: true
  validates :uuid, presence: true, uniqueness: true
  validates :subtotal, presence: true, numericality: { greater_than: 0 }
  validates :total, presence: true, numericality: { greater_than: 0 }
  validates :receiver_rfc, presence: true
  
  def paid?
    payment_complement_generated? && facturama_id.present?
  end
  
  def payment_status
    paid? ? 'Pagada' : 'Pendiente'
  end
  
  def status_badge
    paid? ? 'success' : 'pending'
  end

  def download_pdf
    # Usar complement_uuid si existe, sino facturama_id, sino uuid original
    identifier = complement_uuid.present? ? complement_uuid : 
                 (facturama_id.present? ? facturama_id : uuid)
    return nil unless identifier.present?
    
    begin
      FacturamaService.download_pdf(identifier)
    rescue => e
      Rails.logger.error "Failed to download PDF for invoice #{id}: #{e.message}"
      raise "Failed to download PDF: #{e.message}"
    end
  end

  def download_xml
    # Usar complement_uuid si existe, sino facturama_id, sino uuid original
    identifier = complement_uuid.present? ? complement_uuid : 
                 (facturama_id.present? ? facturama_id : uuid)
    return nil unless identifier.present?
    
    begin
      FacturamaService.download_xml(identifier)
    rescue => e
      Rails.logger.error "Failed to download XML for invoice #{id}: #{e.message}"
      raise "Failed to download XML: #{e.message}"
    end
  end
end
