# Limpiar datos existentes
Invoice.destroy_all

# Cargar facturas reales desde los XMLs
xml_dir = Rails.root.join('invoices', 'xml')
pdf_dir = Rails.root.join('invoices', 'pdf')

if Dir.exist?(xml_dir)
  Dir.glob("#{xml_dir}/*.xml").each do |xml_file|
    begin
      xml_content = File.read(xml_file)
      parsed_data = InvoiceParserService.parse_xml(xml_content)
      
      # Usar el nombre del archivo como UUID (que coincide con el PDF)
      file_uuid = File.basename(xml_file, '.xml')
      pdf_file = pdf_dir.join("#{file_uuid}.pdf")
      
      if File.exist?(pdf_file)
        Invoice.create!(
          client_name: parsed_data[:client_name],
          receiver_rfc: parsed_data[:receiver_rfc],
          emission_date: parsed_data[:emission_date],
          uuid: file_uuid, # Usar el UUID del nombre del archivo
          subtotal: parsed_data[:subtotal],
          total: parsed_data[:total],
          xml_content: parsed_data[:xml_content],
          payment_complement_generated: false
        )
        puts "✅ Factura creada: #{parsed_data[:client_name]} - #{file_uuid}"
      else
        puts "❌ PDF no encontrado para: #{file_uuid}"
      end
    rescue => e
      puts "❌ Error procesando #{xml_file}: #{e.message}"
    end
  end
else
  puts "❌ Directorio invoices/xml no encontrado"
end

puts "🎉 Seed completado. Total facturas: #{Invoice.count}"
