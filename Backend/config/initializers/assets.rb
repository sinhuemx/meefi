# Disable asset compilation for API-only app
Rails.application.config.assets.compile = false if Rails.application.config.respond_to?(:assets)