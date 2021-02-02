class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "public_chat"
    stream_from "#{params[:room]}"
    ActionCable.server.broadcast 'public_chat', {content: "====#{params[:user]} joined!===="}
  end

  def receive(data)
    message = data['content']
    if params[:room]
      ActionCable.server.broadcast("#{params[:room]}", {content: "[Room #{params[:room]}]: #{message}"})
    else
      ActionCable.server.broadcast("public_chat", {content: "[public chat]: #{message}"})
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    ActionCable.server.broadcast 'public_chat', {content: "====#{params[:user]} left!===="}
  end
end
