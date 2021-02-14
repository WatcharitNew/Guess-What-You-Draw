class RoomController < ApplicationController
    def create
        while true
            newRoom = rand(1..9999)
            newRoomData = $redis.get(newRoom)
            if !newRoomData
                break
            end
        end
        render json: {room: newRoom}, status: :created
    end

    def join
        room = params[:room]
        username = params[:username]
        roomData = $redis.get(room)
        if roomData
            roomData = JSON.parse(roomData)
            usernames = roomData['usernames']
            if usernames.include? username
                render json: {error: 'Duplicate username'}, status: :bad_request
            else
                render status: :ok
            end
        else
            render json: {error: 'Room not found'}, status: :bad_request
        end
    end
end
