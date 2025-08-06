class InvoiceParserService
  def self.parse_xml(xml_content)
    doc = Nokogiri::XML(xml_content)
    doc.remove_namespaces!
    
    comprobante = doc.at('Comprobante')
    receptor = doc.at('Receptor')
    
    {
      client_name: receptor&.attr('Nombre') || 'Unknown Client',
      receiver_rfc: receptor&.attr('Rfc') || 'XEXX010101000',
      emission_date: Date.parse(comprobante.attr('Fecha')),
      uuid: doc.at('TimbreFiscalDigital').attr('UUID'),
      subtotal: comprobante.attr('SubTotal').to_f,
      total: comprobante.attr('Total').to_f,
      xml_content: xml_content
    }
  rescue => e
    Rails.logger.error "XML Parsing Error: #{e.message}"
    raise StandardError, "Invalid XML format: #{e.message}"
  end
end
