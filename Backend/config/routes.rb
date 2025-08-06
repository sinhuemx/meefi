Rails.application.routes.draw do
  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check
  
  namespace :api do
    namespace :v1 do
      resources :invoices do
        member do
          post :generate_payment_complement
          get :download_pdf
          get :download_xml
        end
        collection do
          post :upload_xml
        end
      end
    end
  end
end
