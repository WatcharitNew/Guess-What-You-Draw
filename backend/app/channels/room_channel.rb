class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "#{params[:room]}"
    ActionCable.server.broadcast "#{params[:room]}", {content: "#{params[:username]} joined"}
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
