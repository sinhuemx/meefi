require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = true
  config.force_ssl = false
  config.log_level = :info
  config.log_tags = [ :request_id ]
  
  # Logger configuration
  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = ::Logger::Formatter.new
    config.logger = ActiveSupport::TaggedLogging.new(logger)
  end
  
  config.active_record.dump_schema_after_migration = false
  
  # CORS configuration
  config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins '*'
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head],
        credentials: false
    end
  end
end
