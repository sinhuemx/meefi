class InvoicesController < ApplicationController
  def index
    invoices = Invoice.all
    render json: invoices
  end

  def show
    invoice = Invoice.find(params[:id])
    render json: invoice
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Invoice not found' }, status: :not_found
  end

  def create
    invoice = Invoice.new(invoice_params)
    
    if invoice.save
      render json: invoice, status: :created
    else
      render json: { errors: invoice.errors }, status: :unprocessable_entity
    end
  end

  private

  def invoice_params
    params.require(:invoice).permit(:client_name, :emission_date, :uuid, :subtotal, :total, :paid, :facturama_id, :xml_content, :pdf_url, :xml_url)
  end
end