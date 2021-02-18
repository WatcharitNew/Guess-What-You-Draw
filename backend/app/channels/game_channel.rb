class GameChannel < ApplicationCable::Channel
  @@rooms = Hash.new({"user" => 0, "word" => '', "round" => 0})
  @@words = ['cat', 'dog', 'goat']

  def subscribed
    room = params[:room]
    username = params[:username]

    numberAllUserLength = 0

    stream_from "game_#{room}"
    stream_from "game_#{room}_#{username}"
    ActionCable.server.broadcast "game_#{room}", {type: 'connected', content: "#{room} #{username} connected"}

    roomData = $redis.get(room)
    puts "roomData #{roomData}"
    allUser = []
    if roomData
      roomData = JSON.parse(roomData)
      puts "roomData #{roomData}"
      allUser = roomData['usernames']
    end

    @@rooms[room]['user'] += 1

    puts "all user length #{allUser}"
    puts "room all user #{@@rooms[room]['user']}"
     
    # @@rooms[room]['word'] = @@words[rand @@words.length()]
    if(@@rooms[room]['user'] == allUser.length())
      ActionCable.server.broadcast "game_#{room}", {type: 'game-start'}  
    end
    
    # ActionCable.server.broadcast "game_#{room}", {type: 'random-word', content: @@rooms[room]['word'], round: @@rooms[room]['round']}  

  end

  def receive(data)
    room = params[:room]
    username = params[:username]
    if data['type'] == 'send-image'
      # do something predict and c
      ActionCable.server.broadcast "game_#{room}_#{username}", {type: 'receive-result', content: "true"}
    elsif data['type'] == 'end-round'
      @@rooms[room]['word'] = @@words[rand @@words.length()]
      @@rooms[room]['round'] += 1
      ActionCable.server.broadcast "game_#{room}", {type: 'random-word', content: @@rooms[room]['word'], round: @@rooms[room]['round']}  
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    room = params[:room]
    @@rooms[room]['user'] -= 1
    if @@rooms[room]['user'] == 0
      @@rooms[room]['round'] = 0
      @@rooms[room]['word'] = ''
    end
  end
end
