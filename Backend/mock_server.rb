#!/usr/bin/env ruby

require 'webrick'
require 'json'

# Mock data for invoices
MOCK_INVOICES = [
  {
    id: 1,
    client_name: "Empresa ABC S.A. de C.V.",
    emission_date: "2024-01-15",
    uuid: "12345678-1234-1234-1234-123456789abc",
    subtotal: 1000.00,
    total: 1160.00,
    status: "active"
  },
  {
    id: 2,
    client_name: "Corporativo XYZ",
    emission_date: "2024-01-20",
    uuid: "87654321-4321-4321-4321-cba987654321",
    subtotal: 2500.00,
    total: 2900.00,
    status: "active"
  },
  {
    id: 3,
    client_name: "Servicios DEF",
    emission_date: "2024-01-25",
    uuid: "11111111-2222-3333-4444-555555555555",
    subtotal: 750.00,
    total: 870.00,
    status: "active"
  }
]

# Create a simple web server
server = WEBrick::HTTPServer.new(
  Port: 3000,
  DocumentRoot: '.',
  AccessLog: []
)

# Add CORS headers
server.mount_proc '/' do |req, res|
  # Set CORS headers
  res['Access-Control-Allow-Origin'] = '*'
  res['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  res['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
  
  # Handle preflight requests
  if req.request_method == 'OPTIONS'
    res.status = 200
    next
  end
  
  # Handle different routes
  case req.path
  when '/invoices'
    if req.request_method == 'GET'
      res['Content-Type'] = 'application/json'
      res.body = { data: MOCK_INVOICES }.to_json
      res.status = 200
    elsif req.request_method == 'POST'
      res['Content-Type'] = 'application/json'
      new_invoice = {
        id: MOCK_INVOICES.length + 1,
        client_name: "Nuevo Cliente",
        emission_date: Time.now.strftime("%Y-%m-%d"),
        uuid: "new-uuid-#{Time.now.to_i}",
        subtotal: 1000.00,
        total: 1160.00,
        status: "active"
      }
      MOCK_INVOICES << new_invoice
      res.body = { data: new_invoice }.to_json
      res.status = 201
    else
      res.status = 405
    end
  else
    res.status = 404
    res.body = { error: "Not found" }.to_json
  end
end

# Handle shutdown gracefully
trap('INT') { server.shutdown }

puts "Starting mock server on http://localhost:3000"
puts "Available endpoints:"
puts "  GET  /invoices - Get all invoices"
puts "  POST /invoices - Create new invoice"
puts ""
puts "Press Ctrl+C to stop the server"

server.start
