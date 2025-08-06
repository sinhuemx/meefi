class GeneratePaymentComplementJob < ApplicationJob
  queue_as :default

  def perform(invoice_id)
    @invoice = Invoice.find(invoice_id)
    
    Rails.logger.info "Starting payment complement generation for invoice #{invoice_id}"
    
    response = FacturamaService.new.generate_payment_complement(@invoice)
    
    Rails.logger.info "FacturamaService response: #{response}"
    
    if response[:success]
      @invoice.update!(
        payment_complement_generated: true,
        facturama_id: response[:facturama_id],
        complement_uuid: response[:complement_uuid]
      )
      Rails.logger.info "Payment complement generated successfully"
    else
      error_msg = response[:error] || 'Unknown error'
      Rails.logger.error "Failed to generate payment complement: #{error_msg}"
      raise "Payment complement generation failed: #{error_msg}"
    end
  end
end
