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
end
