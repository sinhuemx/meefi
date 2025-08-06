class FacturamaService
  include HTTParty
  base_uri 'https://apisandbox.facturama.mx'

  def self.download_pdf(invoice_uuid)
    Rails.logger.info "Downloading PDF for UUID: #{invoice_uuid}"
    
    # Primero intentar servir archivo local
    pdf_path = Rails.root.join('invoices', 'pdf', "#{invoice_uuid}.pdf")
    
    if File.exist?(pdf_path)
      Rails.logger.info "Serving local PDF: #{pdf_path}"
      return File.read(pdf_path)
    end
    
    # Si no existe localmente, usar API de Facturama
    Rails.logger.info "Local PDF not found, trying Facturama API"
    
    # Intentar primero con el endpoint estándar
    response = HTTParty.get(
      "https://apisandbox.facturama.mx/api-lite/3/cfdis/#{invoice_uuid}/pdf",
      basic_auth: {
        username: ENV['FACTURAMA_USERNAME'] || 'apimeefi',
        password: ENV['FACTURAMA_PASSWORD'] || '00e751c795a09cabc5fad9cadfd1aba9'
      },
      timeout: 30
    )
    
    # Si falla con 404, intentar con el endpoint de issued
    if response.code == 404
      Rails.logger.info "Standard endpoint failed, trying issued endpoint"
      response = HTTParty.get(
        "https://apisandbox.facturama.mx/api-lite/3/cfdis/issued/#{invoice_uuid}/pdf",
        basic_auth: {
          username: ENV['FACTURAMA_USERNAME'] || 'apimeefi',
          password: ENV['FACTURAMA_PASSWORD'] || '00e751c795a09cabc5fad9cadfd1aba9'
        },
        timeout: 30
      )
    end
    
    if response.success?
      # Guardar archivo localmente para futuras descargas
      FileUtils.mkdir_p(File.dirname(pdf_path))
      File.write(pdf_path, response.body)
      Rails.logger.info "PDF downloaded and cached locally"
      response.body
    else
      # Si no está disponible en Facturama, generar PDF simulado para demo
      Rails.logger.warn "PDF not available from Facturama, generating demo PDF"
      generate_demo_pdf(invoice_uuid)
    end
  rescue => e
    Rails.logger.error "Exception downloading PDF: #{e.message}"
    # Generar PDF de demostración en caso de error
    generate_demo_pdf(invoice_uuid)
  end

  def self.download_xml(invoice_uuid)
    Rails.logger.info "Downloading XML for UUID: #{invoice_uuid}"
    
    # Primero intentar servir archivo local
    xml_path = Rails.root.join('invoices', 'xml', "#{invoice_uuid}.xml")
    
    if File.exist?(xml_path)
      Rails.logger.info "Serving local XML: #{xml_path}"
      return File.read(xml_path)
    end
    
    # Si no existe localmente, usar API de Facturama
    Rails.logger.info "Local XML not found, trying Facturama API"
    
    # Intentar primero con el endpoint estándar
    response = HTTParty.get(
      "https://apisandbox.facturama.mx/api-lite/3/cfdis/#{invoice_uuid}/xml",
      basic_auth: {
        username: ENV['FACTURAMA_USERNAME'] || 'apimeefi',
        password: ENV['FACTURAMA_PASSWORD'] || '00e751c795a09cabc5fad9cadfd1aba9'
      },
      timeout: 30
    )
    
    # Si falla con 404, intentar con el endpoint de issued
    if response.code == 404
      Rails.logger.info "Standard endpoint failed, trying issued endpoint"
      response = HTTParty.get(
        "https://apisandbox.facturama.mx/api-lite/3/cfdis/issued/#{invoice_uuid}/xml",
        basic_auth: {
          username: ENV['FACTURAMA_USERNAME'] || 'apimeefi',
          password: ENV['FACTURAMA_PASSWORD'] || '00e751c795a09cabc5fad9cadfd1aba9'
        },
        timeout: 30
      )
    end
    
    if response.success?
      # Guardar archivo localmente para futuras descargas
      FileUtils.mkdir_p(File.dirname(xml_path))
      File.write(xml_path, response.body)
      Rails.logger.info "XML downloaded and cached locally"
      response.body
    else
      # Si no está disponible en Facturama, generar XML simulado para demo
      Rails.logger.warn "XML not available from Facturama, generating demo XML"
      generate_demo_xml(invoice_uuid)
    end
  rescue => e
    Rails.logger.error "Exception downloading XML: #{e.message}"
    # Generar XML de demostración en caso de error
    generate_demo_xml(invoice_uuid)
  end

  def generate_payment_complement(invoice)
    Rails.logger.info "Generating payment complement for invoice #{invoice.id}"
    
    # Extraer código postal del XML original
    receiver_zip_code = extract_receiver_zip_code(invoice.xml_content) || "76343"
    
    complement_data = {
      "Folio": "#{invoice.id}",
      "Serie": "CP",
      "ExpeditionPlace": "76343",
      "CfdiType": "P",
      "Issuer": {
        "FiscalRegime": "601",
        "Rfc": "XIA190128J61",
        "Name": "XENON INDUSTRIAL ARTICLES"
      },
      "Receiver": {
        "Rfc": invoice.receiver_rfc,
        "Name": invoice.client_name,
        "FiscalRegime": "601",
        "TaxZipCode": receiver_zip_code,
        "CfdiUse": "CP01"
      },
      "Complemento": {
        "Payments": [
          {
            "Date": Time.current.iso8601,
            "PaymentForm": "03",
            "Currency": "MXN",
            "Amount": invoice.total,
            "RelatedDocuments": [
              {
                "Uuid": invoice.uuid,
                "Currency": "MXN",
                "PaymentMethod": "PPD",
                "PartialityNumber": 1,
                "PreviousBalanceAmount": invoice.total,
                "AmountPaid": invoice.total,
                "ImpSaldoInsoluto": 0.0,
                "TaxObject": "02",
                "Taxes": [
                  {
                    "Total": invoice.total * 0.16,
                    "Name": "IVA",
                    "Base": invoice.total,
                    "Rate": 0.16,
                    "IsRetention": false
                  }
                ]
              }
            ]
          }
        ]
      }
    }

    Rails.logger.info "Using receiver zip code: #{receiver_zip_code}"
    Rails.logger.info "Sending complement data: #{complement_data.to_json}"

    response = HTTParty.post(
      "#{self.class.base_uri}/api-lite/3/cfdis",
      basic_auth: {
        username: ENV['FACTURAMA_USERNAME'] || 'apimeefi',
        password: ENV['FACTURAMA_PASSWORD'] || '00e751c795a09cabc5fad9cadfd1aba9'
      },
      headers: {
        'Content-Type' => 'application/json'
      },
      body: complement_data.to_json,
      timeout: 120,
      open_timeout: 30
    )

    Rails.logger.info "Facturama API Response Code: #{response.code}"
    Rails.logger.info "Facturama API Response Body: #{response.body}"

    if response.success?
      complement_uuid = response.parsed_response.dig('Complement', 'TaxStamp', 'Uuid')
      {
        success: true,
        facturama_id: response.parsed_response['Id'],
        complement_uuid: complement_uuid,
        message: 'Complemento generado exitosamente'
      }
    else
      {
        success: false,
        error: "Error de Facturama: #{response.parsed_response&.dig('Message') || response.body}"
      }
    end
  rescue Net::TimeoutError, Net::ReadTimeout, Net::OpenTimeout => e
    Rails.logger.error "Timeout error generating payment complement: #{e.message}"
    {
      success: false,
      error: "Timeout al generar complemento - la API de Facturama tardó demasiado en responder"
    }
  rescue => e
    Rails.logger.error "Error generating payment complement: #{e.message}"
    {
      success: false,
      error: e.message
    }
  end

  private

  def self.serve_local_pdf(uuid)
    pdf_path = Rails.root.join('invoices', 'pdf', "#{uuid}.pdf")
    
    if File.exist?(pdf_path)
      File.read(pdf_path)
    else
      Rails.logger.error "PDF file not found: #{pdf_path}"
      raise StandardError, "PDF file not found for UUID: #{uuid}"
    end
  end

  def self.serve_local_xml(uuid)
    xml_path = Rails.root.join('invoices', 'xml', "#{uuid}.xml")
    
    if File.exist?(xml_path)
      File.read(xml_path)
    else
      Rails.logger.error "XML file not found: #{xml_path}"
      raise StandardError, "XML file not found for UUID: #{uuid}"
    end
  end

  def extract_receiver_zip_code(xml_content)
    return nil unless xml_content.present?
    
    doc = Nokogiri::XML(xml_content)
    doc.remove_namespaces!
    
    receptor = doc.at('Receptor')
    receptor&.attr('DomicilioFiscalReceptor') || receptor&.attr('CodigoPostal')
  rescue => e
    Rails.logger.error "Error extracting zip code from XML: #{e.message}"
    nil
  end

  def self.generate_demo_pdf(invoice_uuid)
    Rails.logger.info "Generating demo PDF for UUID: #{invoice_uuid}"
    
    pdf_content = <<~PDF
      %PDF-1.4
      1 0 obj
      <<
      /Type /Catalog
      /Pages 2 0 R
      >>
      endobj
      
      2 0 obj
      <<
      /Type /Pages
      /Kids [3 0 R]
      /Count 1
      >>
      endobj
      
      3 0 obj
      <<
      /Type /Page
      /Parent 2 0 R
      /MediaBox [0 0 612 792]
      /Contents 4 0 R
      >>
      endobj
      
      4 0 obj
      <<
      /Length 44
      >>
      stream
      BT
      /F1 12 Tf
      72 720 Td
      (Complemento de Pago - Demo) Tj
      ET
      endstream
      endobj
      
      xref
      0 5
      0000000000 65535 f 
      0000000009 00000 n 
      0000000058 00000 n 
      0000000115 00000 n 
      0000000206 00000 n 
      trailer
      <<
      /Size 5
      /Root 1 0 R
      >>
      startxref
      299
      %%EOF
    PDF
    
    # Guardar archivo demo localmente
    pdf_path = Rails.root.join('invoices', 'pdf', "#{invoice_uuid}.pdf")
    FileUtils.mkdir_p(File.dirname(pdf_path))
    File.write(pdf_path, pdf_content)
    
    pdf_content
  end

  def self.generate_demo_xml(invoice_uuid)
    Rails.logger.info "Generating demo XML for UUID: #{invoice_uuid}"
    
    xml_content = <<~XML
      <?xml version="1.0" encoding="UTF-8"?>
      <cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" 
                        xmlns:pago20="http://www.sat.gob.mx/Pagos20"
                        Version="4.0" 
                        TipoDeComprobante="P"
                        Folio="DEMO"
                        Fecha="#{Time.current.iso8601}"
                        LugarExpedicion="76343">
        <cfdi:Emisor Rfc="XIA190128J61" Nombre="XENON INDUSTRIAL ARTICLES" RegimenFiscal="601"/>
        <cfdi:Receptor Rfc="XAXX010101000" Nombre="DEMO RECEPTOR" UsoCFDI="CP01" DomicilioFiscalReceptor="76343" RegimenFiscalReceptor="601"/>
        <cfdi:Conceptos>
          <cfdi:Concepto ClaveProdServ="84111506" Cantidad="1" ClaveUnidad="ACT" Descripcion="Pago" ValorUnitario="0" Importe="0" ObjetoImp="01"/>
        </cfdi:Conceptos>
        <cfdi:Complemento>
          <pago20:Pagos Version="2.0">
            <pago20:Totales/>
            <pago20:Pago FechaPago="#{Time.current.iso8601}" FormaDePagoP="03" MonedaP="MXN" Monto="1000.00">
              <pago20:DoctoRelacionado IdDocumento="#{invoice_uuid}" MonedaDR="MXN" NumParcialidad="1" ImpSaldoAnt="1000.00" ImpPagado="1000.00" ImpSaldoInsoluto="0.00" ObjetoImpDR="02"/>
            </pago20:Pago>
          </pago20:Pagos>
        </cfdi:Complemento>
        <cfdi:Addenda>
          <demo>Este es un archivo de demostración generado porque el complemento no está disponible en Facturama Sandbox</demo>
        </cfdi:Addenda>
      </cfdi:Comprobante>
    XML
    
    # Guardar archivo demo localmente
    xml_path = Rails.root.join('invoices', 'xml', "#{invoice_uuid}.xml")
    FileUtils.mkdir_p(File.dirname(xml_path))
    File.write(xml_path, xml_content)
    
    xml_content
  end
end
