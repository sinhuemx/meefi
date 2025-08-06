class AddComplementUuidToInvoices < ActiveRecord::Migration[7.2]
  def change
    add_column :invoices, :complement_uuid, :string
  end
end
