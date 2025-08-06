class AddReceiverRfcToInvoices < ActiveRecord::Migration[7.2]
  def change
    add_column :invoices, :receiver_rfc, :string
  end
end