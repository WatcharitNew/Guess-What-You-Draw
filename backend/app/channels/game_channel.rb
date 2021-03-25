class GameChannel < ApplicationCable::Channel
  @@rooms = Hash.new()
  @@words = %w[cat dog goat]

  def subscribed
    room = params[:room]
    username = params[:username]

    
    room_data = $redis.get(room)
    puts "room_data #{room_data}"
    
    if room_data
      room_json =  JSON.parse(room_data) || {}
      @@rooms[room] ||= { 
        :active_users => Array.new, 
        :max_round => room_json['maxRound'], 
        :time_per_turn => room_json['timePerTurn'], 
        :all_users => room_json['usernames'].sort 
      }
    end
    
    puts "actual in room #{@@rooms[room]}"
    
    if !@@rooms[room][:active_users].include?(username)
      @@rooms[room][:active_users] << username
      puts "user came in #{username}"

      stream_from "game_#{room}"
      stream_from "game_#{room}_#{username}"
      ActionCable.server.broadcast "game_#{room}", {type: 'connected', content: "#{room} #{username} connected"}
    else 
      puts "same #{username}"
    end

    puts "room all user #{@@rooms[room][:active_users]}"
     
    if @@rooms[room][:active_users].sort == @@rooms[room][:all_users]
      @@rooms[room][:round] = 1
      random_word(room)

      ActionCable.server.broadcast "game_#{room}", { 
        type: 'game-start', 
        usernames: @@rooms[room][:all_users], 
        maxRound: @@rooms[room][:max_round], 
        timePerTurn: @@rooms[room][:time_per_turn],
        word: @@rooms[room][:word],
        round: @@rooms[room][:round]
      }
    end
  end

  def receive(data)
    room = params[:room]
    username = params[:username]
    if data['type'] == 'end-round'
      @@rooms[room][:number_user_end_round] ||= 0;
      @@rooms[room][:number_user_end_round] += 1
      
      if(@@rooms[room][:active_users].size() == @@rooms[room][:number_user_end_round])
        @@rooms[room][:word] = @@words[rand @@words.size()]
        @@rooms[room][:round] += 1
        @@rooms[room][:number_user_end_round] = 0;
        ActionCable.server.broadcast "game_#{room}", {type: 'random-word', content: @@rooms[room][:word], round: @@rooms[room][:round]}  
      end
      
    elsif data['type'] == 'send-message'
      ActionCable.server.broadcast("game_#{room}", {type: 'recieve-message', sender: username, content: data['content']})
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    room = params[:room]
    username = params[:username]
    puts "param room #{room}"
    puts "room detail #{@@rooms[room]}"

    if @@rooms[room][:active_users].size == @@rooms[room][:all_users].size
      $redis.del(room)
    end

    @@rooms[room][:active_users].delete(username)

    if @@rooms[room][:active_users].empty?
      @@rooms[room] = nil
    end
  end

  private

  def random_word(room)
    @@rooms[room][:word] = @@words[rand @@words.length()]
  end
end
