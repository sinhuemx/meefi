class CreateInvoices < ActiveRecord::Migration[7.2]
  def change
    create_table :invoices do |t|
      t.string :client_name, null: false
      t.date :emission_date, null: false
      t.string :uuid, null: false
      t.decimal :subtotal, precision: 10, scale: 2, null: false
      t.decimal :total, precision: 10, scale: 2, null: false
      t.boolean :payment_complement_generated, default: false
      t.string :facturama_id
      t.text :xml_content
      t.text :pdf_content

      t.timestamps
    end

    add_index :invoices, :uuid, unique: true
    add_index :invoices, :emission_date
    add_index :invoices, :payment_complement_generated
  end
end
