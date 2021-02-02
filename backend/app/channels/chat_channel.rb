class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "#{params[:room]}"
    ActionCable.server.broadcast "#{params[:room]}", {content: "#{params[:userName]} joined"}
  end

  def receive(data)
    content = data['content']
    if params[:room]
      ActionCable.server.broadcast("#{params[:room]}", {sender: params[:userName], content: content})
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    ActionCable.server.broadcast "#{params[:room]}", {content: "#{params[:userName]} left"}
  end
end
