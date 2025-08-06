require_relative "boot"

require "active_record/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "active_job/railtie"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    config.load_defaults 7.2
    
    # API only configuration
    config.api_only = true
    
    # Skip views, helpers and assets when generating a new resource
    config.generators do |g|
      g.skip_routes false
      g.helper false
      g.assets false
      g.view_specs false
      g.helper_specs false
      g.routing_specs false
    end
  end
end
