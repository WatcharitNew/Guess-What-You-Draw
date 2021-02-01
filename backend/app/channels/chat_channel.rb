class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'public_chat'
    ActionCable.server.broadcast 'public_chat', "hey joined!"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    ActionCable.server.broadcast 'public_chat', "hey bye!"
  end
end
