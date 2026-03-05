import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

class SupabaseSocketMock {
  private channel: RealtimeChannel | null = null;
  private listeners: Record<string, Function[]> = {};
  private roomId: string | null = null;
  private isHost: boolean = false;

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string) {
    this.listeners[event] = [];
  }

  emit(event: string, data: any, callback?: Function) {
    if (event === 'create_room') {
      const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      this.roomId = newRoomId;
      this.isHost = true;
      this.connectToChannel(newRoomId, 
        () => {
          if (callback) callback({ roomId: newRoomId });
        },
        (errorMsg) => {
          if (callback) callback({ error: errorMsg });
        }
      );
      return;
    }

    if (event === 'join_room') {
      const { roomId, teamId } = data;
      this.roomId = roomId;
      this.isHost = false;
      this.connectToChannel(roomId, 
        () => {
          // Request state from host
          this.channel?.send({
            type: 'broadcast',
            event: 'request_state',
            payload: { teamId }
          });
          // Simulate successful join immediately, state will arrive via game_state_updated
          if (callback) callback({ success: true, state: {}, buzzerWinner: null, buzzerLocked: true });
        },
        (errorMsg) => {
          if (callback) callback({ error: errorMsg });
        }
      );
      return;
    }

    // Translate events to match the old server.ts behavior
    let broadcastEvent = event;
    let broadcastPayload = data;

    if (event === 'game_state_update') {
      broadcastEvent = 'game_state_updated';
      broadcastPayload = data.state;
    } else if (event === 'buzz_press') {
      broadcastEvent = 'buzzer_pressed';
      broadcastPayload = { teamId: data.teamId };
    } else if (event === 'buzz_lock') {
      broadcastEvent = 'buzzer_locked';
      broadcastPayload = { locked: data.locked };
    } else if (event === 'buzz_reset') {
      broadcastEvent = 'buzzer_reset';
      broadcastPayload = {};
    }

    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: broadcastEvent,
        payload: broadcastPayload
      }).catch(err => console.error('Error sending broadcast:', err));
    }
  }

  private connectToChannel(roomId: string, onConnect: () => void, onError?: (msg: string) => void) {
    if (this.channel) {
      this.channel.unsubscribe();
    }

    this.channel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { self: false } // Don't receive our own messages
      }
    });

    this.channel
      .on('broadcast', { event: '*' }, (payload) => {
        const eventName = payload.event;
        const eventData = payload.payload;

        if (eventName === 'request_state' && this.isHost) {
           const callbacks = this.listeners['player_joined'] || [];
           // Generate a fake socketId for the new player
           callbacks.forEach(cb => cb({ socketId: Math.random().toString(36).substring(7), teamId: eventData.teamId }));
           return;
        }

        const callbacks = this.listeners[eventName] || [];
        callbacks.forEach(cb => cb(eventData));
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully connected to Supabase Realtime channel:', roomId);
          onConnect();
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Supabase channel error:', err);
          if (onError) onError('حدث خطأ في الاتصال بالخادم (Supabase). تأكد من إعدادات Vercel.');
        } else if (status === 'TIMED_OUT') {
          console.error('Supabase channel timeout');
          if (onError) onError('انتهى وقت الاتصال بالخادم.');
        }
      });
  }

  disconnect() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
    this.listeners = {};
    this.roomId = null;
  }
}

let socketInstance: SupabaseSocketMock | null = null;

export const getSocket = (): any => {
  if (!socketInstance) {
    socketInstance = new SupabaseSocketMock();
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
