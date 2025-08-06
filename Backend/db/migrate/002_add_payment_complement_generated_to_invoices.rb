class AddPaymentComplementGeneratedToInvoices < ActiveRecord::Migration[7.2]
  def change
    unless column_exists?(:invoices, :payment_complement_generated)
      add_column :invoices, :payment_complement_generated, :boolean, default: false
    end
  end
end