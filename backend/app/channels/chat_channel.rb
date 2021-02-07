class ChatChannel < ApplicationCable::Channel
  # redis
  # {
  #   room => {
  #     usernames: string[],
  #   }
  # }

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
    ActionCable.server.broadcast "#{room}", {type: 'getUsers', usernames: usernames}
    ActionCable.server.broadcast "#{room}", {type: 'recieve-message', content: "#{username} joined"}
  end

  def receive(data)
    if data['type'] == 'send-message'
      ActionCable.server.broadcast("#{params[:room]}", {type: 'recieve-message', sender: params[:username], content: data['content']})
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

    ActionCable.server.broadcast "#{room}", {type: 'getUsers', usernames: usernames}
    ActionCable.server.broadcast "#{params[:room]}", {type: 'recieve-message', content: "#{username} left"}
  end
end
