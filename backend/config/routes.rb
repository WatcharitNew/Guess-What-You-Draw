Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  post 'room', to: 'room#create'
  post 'room/:room', to: 'room#join'
  mount ActionCable.server => '/cable'
end
