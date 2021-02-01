class MessageChannel < ApplicationCable::Channel
  def subscribed
    stream_from "message_channel"
  end

  def receive(data)
    image = data['image']
    ActionCable.server.broadcast('message_channel', {class: image})
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
