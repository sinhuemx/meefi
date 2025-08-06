module Api
  module V1
    class InvoicesController < ApplicationController
      before_action :set_invoice, only: [:show, :generate_payment_complement, :download_pdf, :download_xml]
      
      def index
        @invoices = Invoice.all.order(emission_date: :desc)
        
        invoices_data = @invoices.map do |invoice|
          {
            id: invoice.id,
            client_name: invoice.client_name,
            receiver_rfc: invoice.receiver_rfc,
            emission_date: invoice.emission_date,
            uuid: invoice.uuid,
            subtotal: invoice.subtotal.to_f,
            total: invoice.total.to_f,
            status: invoice.status_badge,
            payment_complement_generated: invoice.payment_complement_generated?,
            facturama_id: invoice.facturama_id,
            pdf_url: download_pdf_api_v1_invoice_url(invoice),
            xml_url: download_xml_api_v1_invoice_url(invoice)
          }
        end
        
        render json: invoices_data
      end
      
      def show
        render json: {
          id: @invoice.id,
          client_name: @invoice.client_name,
          receiver_rfc: @invoice.receiver_rfc,
          emission_date: @invoice.emission_date,
          uuid: @invoice.uuid,
          subtotal: @invoice.subtotal.to_f,
          total: @invoice.total.to_f,
          status: @invoice.status_badge,
          payment_complement_generated: @invoice.payment_complement_generated?,
          facturama_id: @invoice.facturama_id,
          pdf_url: download_pdf_api_v1_invoice_url(@invoice),
          xml_url: download_xml_api_v1_invoice_url(@invoice)
        }
      end
      
      def create
        @invoice = Invoice.new(invoice_params)
        
        if @invoice.save
          render json: invoice_json(@invoice), status: :created
        else
          render json: { errors: @invoice.errors }, status: :unprocessable_entity
        end
      end
      
      def generate_payment_complement
        Rails.logger.info "Generating payment complement for invoice #{@invoice.id}"
        GeneratePaymentComplementJob.perform_later(@invoice.id)
        render json: { 
          message: 'Complemento de pago en proceso...',
          invoice_id: @invoice.id 
        }
      end
      
      def download_pdf
        begin
          Rails.logger.info "Attempting to download PDF for invoice #{@invoice.id}"
          Rails.logger.info "Invoice facturama_id: #{@invoice.facturama_id}"
          Rails.logger.info "Invoice UUID: #{@invoice.uuid}"
          
          pdf_content = @invoice.download_pdf
          
          if pdf_content && pdf_content.size > 0
            Rails.logger.info "PDF downloaded successfully: #{pdf_content.size} bytes"
            send_data pdf_content,
                      filename: "complemento_pago_#{@invoice.uuid}.pdf",
                      type: 'application/pdf',
                      disposition: 'attachment'
          else
            Rails.logger.error "PDF content is empty or nil"
            render json: { error: 'PDF no disponible o vacío' }, status: :not_found
          end
        rescue => e
          Rails.logger.error "Error downloading PDF for invoice #{@invoice.id}: #{e.message}"
          Rails.logger.error e.backtrace.first(10)
          render json: { error: "Error al descargar PDF: #{e.message}" }, status: :internal_server_error
        end
      end

      def download_xml
        begin
          Rails.logger.info "Attempting to download XML for invoice #{@invoice.id}"
          Rails.logger.info "Invoice facturama_id: #{@invoice.facturama_id}"
          Rails.logger.info "Invoice UUID: #{@invoice.uuid}"
          
          xml_content = @invoice.download_xml
          
          if xml_content && xml_content.size > 0
            Rails.logger.info "XML downloaded successfully: #{xml_content.size} bytes"
            send_data xml_content,
                      filename: "complemento_pago_#{@invoice.uuid}.xml",
                      type: 'application/xml',
                      disposition: 'attachment'
          else
            Rails.logger.error "XML content is empty or nil"
            render json: { error: 'XML no disponible o vacío' }, status: :not_found
          end
        rescue => e
          Rails.logger.error "Error downloading XML for invoice #{@invoice.id}: #{e.message}"
          Rails.logger.error e.backtrace.first(10)
          render json: { error: "Error al descargar XML: #{e.message}" }, status: :internal_server_error
        end
      end
      
      def upload_xml
        if params[:xml_file].present?
          xml_content = params[:xml_file].read
          
          begin
            parsed_data = InvoiceParserService.parse_xml(xml_content)
            
            # Check if invoice with this UUID already exists
            existing_invoice = Invoice.find_by(uuid: parsed_data[:uuid])
            if existing_invoice
              render json: { error: "Invoice with UUID #{parsed_data[:uuid]} already exists" }, status: :conflict
              return
            end
            
            @invoice = Invoice.new(parsed_data)
            
            if @invoice.save
              render json: invoice_json(@invoice), status: :created
            else
              render json: { errors: @invoice.errors }, status: :unprocessable_entity
            end
          rescue => e
            render json: { error: e.message }, status: :unprocessable_entity
          end
        else
          render json: { error: 'No XML file provided' }, status: :bad_request
        end
      end
      
      private
      
      def set_invoice
        @invoice = Invoice.find(params[:id])
      end
      
      def invoice_params
        params.require(:invoice).permit(:xml)
      end
      
      def invoice_json(invoice)
        {
          id: invoice.id,
          client_name: invoice.client_name,
          receiver_rfc: invoice.receiver_rfc,
          emission_date: invoice.emission_date,
          uuid: invoice.uuid,
          subtotal: invoice.subtotal.to_f,
          total: invoice.total.to_f,
          status: invoice.status_badge,
          payment_complement_generated: invoice.payment_complement_generated?,
          facturama_id: invoice.facturama_id
        }
      end
    end
  end
end
