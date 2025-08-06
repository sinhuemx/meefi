class ApplicationController < ActionController::API
  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error
  
  private
  
  def handle_standard_error(exception)
    Rails.logger.error "#{exception.class}: #{exception.message}"
    render json: { error: exception.message }, status: :internal_server_error
  end
  
  def handle_not_found(exception)
    render json: { error: 'Record not found' }, status: :not_found
  end
  
  def handle_validation_error(exception)
    render json: { error: exception.record.errors.full_messages }, status: :unprocessable_entity
  end
end