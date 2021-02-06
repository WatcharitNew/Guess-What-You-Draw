class ChatChannel < ApplicationCable::Channel

  def subscribed
    room = params[:room]
    username = params[:username]

    roomData = $redis.get(room)
    if roomData
      roomData = JSON.parse(roomData)
      usernames = roomData['usernames']
      usernames.push(username)
    else
      usernames = [username]
    end
    $redis.set(room, {usernames: usernames}.to_json)

    stream_from "#{room}"
    ActionCable.server.broadcast "#{room}", {type: 'getUsers', content: usernames}
    ActionCable.server.broadcast "#{room}", {type: 'message', content: "#{username} joined"}
  end

  def receive(data)
    content = data['content']
    if params[:room]
      ActionCable.server.broadcast("#{params[:room]}", {type: 'message', sender: params[:username], content: content})
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    room = params[:room]
    username = params[:username]

    roomData = $redis.get(room)
    if roomData
      roomData = JSON.parse(roomData)
      usernames = roomData['usernames']
      usernames.delete(username)
    end
    $redis.set(room, {usernames: usernames}.to_json)

    ActionCable.server.broadcast "#{params[:room]}", {content: "#{username} left"}
  end
end
