class ChatChannel < ApplicationCable::Channel
  # redis
  # {
  #   room => {
  #     usernames: string[],
  #     maxRound: number,
  #     timePerTurn: number,
  #     isStart: boolean,
  #   }
  # }

  def subscribed
    room = params[:room]
    username = params[:username]

    roomData = $redis.get(room)
    if roomData
      roomData = JSON.parse(roomData)
      usernames = roomData['usernames']
      if usernames.include? username
        return
      end
      usernames.push(username)
      maxRound = roomData['maxRound']
      timePerTurn = roomData['timePerTurn']
      isStart = roomData['isStart']
    else
      usernames = [username]
      maxRound = 5
      timePerTurn = 30
      isStart = false
    end
    $redis.set(room, {usernames: usernames, maxRound: maxRound, timePerTurn: timePerTurn, isStart: isStart}.to_json)

    stream_from "#{room}"
    ActionCable.server.broadcast "#{room}", {type: 'recieve-message', content: "#{username} joined"}
    ActionCable.server.broadcast "#{room}", {type: 'new-room-data', usernames: usernames, maxRound: maxRound, timePerTurn: timePerTurn}
  end

  def receive(data)
    room = params[:room]
    if data['type'] == 'send-message'
      ActionCable.server.broadcast("#{room}", {type: 'recieve-message', sender: params[:username], content: data['content']})
    elsif data['type'] == 'set-round'
      roomData = $redis.get(room)
      if roomData
        roomData = JSON.parse(roomData)
        roomData['maxRound'] = data['maxRound']
        $redis.set(room, roomData.to_json)
        ActionCable.server.broadcast("#{room}", {
          type: 'new-room-data', 
          usernames: roomData['usernames'], 
          maxRound: roomData['maxRound'], 
          timePerTurn: roomData['timePerTurn']
        })
      end
    elsif data['type'] == 'set-time'
      roomData = $redis.get(room)
      if roomData
        roomData = JSON.parse(roomData)
        roomData['timePerTurn'] = data['timePerTurn']
        $redis.set(room, roomData.to_json)
        ActionCable.server.broadcast("#{room}", {
          type: 'new-room-data', 
          usernames: roomData['usernames'], 
          maxRound: roomData['maxRound'], 
          timePerTurn: roomData['timePerTurn']
        })
      end
    elsif data['type'] == 'get-new-data'
      roomData = $redis.get(room)
      if roomData
        roomData = JSON.parse(roomData)
        ActionCable.server.broadcast("#{room}", {
          type: 'new-room-data', 
          usernames: roomData['usernames'], 
          maxRound: roomData['maxRound'], 
          timePerTurn: roomData['timePerTurn']
        })
      end
    elsif data['type'] == 'start-room'
      roomData = $redis.get(room)
      if roomData
        roomData = JSON.parse(roomData)
        roomData['isStart'] = true
        $redis.set(room, roomData.to_json)
        ActionCable.server.broadcast("#{room}", {
          type: 'room-start'
        })
      end
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    room = params[:room]
    username = params[:username]

    roomData = $redis.get(room)
    if roomData
      roomData = JSON.parse(roomData)
      if roomData['isStart']==true
        return
      end
      roomData['usernames'].delete(username)
      usernames = roomData['usernames']
      if usernames.length == 0
        $redis.del(room)
      else
        $redis.set(room, roomData.to_json)
      end
    end

    ActionCable.server.broadcast("#{room}", {
      type: 'new-room-data', 
      usernames: roomData['usernames'], 
      maxRound: roomData['maxRound'], 
      timePerTurn: roomData['timePerTurn']
    })
    ActionCable.server.broadcast "#{room}", {type: 'recieve-message', content: "#{username} left"}
  end
end
