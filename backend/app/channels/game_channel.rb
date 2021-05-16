class GameChannel < ApplicationCable::Channel
  @@rooms = Hash.new()

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
        :all_users => room_json['usernames'].sort,
        :rank => {}
      }
    end
    
    puts "actual in room #{@@rooms[room]}"
    
    if !@@rooms[room][:active_users].include?(username)
      @@rooms[room][:active_users] << username
      @@rooms[room][:rank][username] = 0
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
      random_word_id(room)

      ActionCable.server.broadcast "game_#{room}", { 
        type: 'game-start', 
        usernames: @@rooms[room][:all_users], 
        maxRound: @@rooms[room][:max_round], 
        timePerTurn: @@rooms[room][:time_per_turn],
        word_id: @@rooms[room][:word_id],
        round: @@rooms[room][:round],
        rank: @@rooms[room][:rank]
      }
    end
  end

  def receive(data)
    room = params[:room]
    username = params[:username]
    if data['type'] == 'end-round'
      @@rooms[room][:score] = {}
      @@rooms[room][:number_user_end_round] ||= 0;
      @@rooms[room][:number_user_end_round] += 1
      @@rooms[room][:rank][username] += data['score']
      
      if(@@rooms[room][:active_users].size() == @@rooms[room][:number_user_end_round])
        random_word_id(room)
        @@rooms[room][:round] += 1
        @@rooms[room][:number_user_end_round] = 0;
        ActionCable.server.broadcast "game_#{room}", {type: 'random-word', word_id: @@rooms[room][:word_id], round: @@rooms[room][:round], rank: (@@rooms[room][:rank].sort {|a1,a2| a2[1]<=>a1[1]}).to_h}
      end

      if(@@rooms[room][:round] > @@rooms[room][:max_round])
        @@rooms[room] = nil
        $redis.del(room)
      end
      
    elsif data['type'] == 'send-message'
      ActionCable.server.broadcast("game_#{room}", {type: 'recieve-message', sender: username, content: data['content']})
    elsif data['type'] == 'new-drawed-label-image'
      ActionCable.server.broadcast("game_#{room}", {type: 'recieve-drawed-label-image', content: data['content']})
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    room = params[:room]
    username = params[:username]
    puts "param room #{room}"
    puts "room detail #{@@rooms[room]}"

    if @@rooms[room].nil?
      if @@rooms[room][:active_users].size == @@rooms[room][:all_users].size
        $redis.del(room)
      end
  
      @@rooms[room][:active_users].delete(username)
  
      if @@rooms[room][:active_users].empty?
        @@rooms[room] = nil
      end
    end
  end

  private

  def random_word_id(room)
    @@rooms[room][:word_id] = rand 50
  end
end
