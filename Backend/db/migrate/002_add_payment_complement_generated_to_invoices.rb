class AddPaymentComplementGeneratedToInvoices < ActiveRecord::Migration[7.2]
  def change
    add_column :invoices, :payment_complement_generated, :boolean, default: false
  end
end