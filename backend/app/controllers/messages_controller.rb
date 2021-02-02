class MessagesController < ApplicationController
    def create
        ActionCable.server.broadcast 'public_chat', "SHIBA"
        render status: 200
      end
end
