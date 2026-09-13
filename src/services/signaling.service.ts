import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../utils/logger.js';
import { redisClient } from '../redis/index.js';

export interface ChatMessagePayload {
  id: string;
  consultationId: string;
  sender: string;
  senderRole: string;
  text: string;
  timestamp: string;
}

interface ConnectedPeer {
  ws: WebSocket;
  peerId: string;
  consultationId: string;
  userId: string;
  role: string;
  name: string;
}

class TelemedicineSignalingService {
  private wss: WebSocketServer | null = null;
  private peers: Map<string, ConnectedPeer> = new Map();
  private inMemoryChatLogs: Map<string, ChatMessagePayload[]> = new Map();

  public init(server: HttpServer): WebSocketServer {
    this.wss = new WebSocketServer({ server, path: '/ws/telemedicine' });

    logger.info('WebRTC Signaling & Real-Time Chat WebSocket Server initialized on /ws/telemedicine');

    this.wss.on('connection', (ws: WebSocket) => {
      let peerInfo: ConnectedPeer | null = null;

      ws.on('message', async (data: string) => {
        try {
          const payload = JSON.parse(data.toString());
          const { type, consultationId, userId, role, name, offer, answer, candidate, msg } = payload;

          switch (type) {
            case 'join': {
              const peerId = `${userId}_${Math.random().toString(36).substr(2, 6)}`;
              peerInfo = {
                ws,
                peerId,
                consultationId: consultationId || 'default',
                userId: userId || 'anonymous',
                role: role || 'PATIENT',
                name: name || 'User',
              };

              this.peers.set(peerId, peerInfo);
              logger.info({ peerId, consultationId, role, name }, 'Peer connected to WebRTC room');

              // Store room presence in Redis if available
              await this.addPeerToRedisRoom(consultationId, peerId, name, role);

              // Notify room peers about new participant
              const roomPeers = this.getPeersInRoom(consultationId, peerId);
              
              ws.send(JSON.stringify({
                type: 'joined-room',
                peerId,
                roomPeerCount: roomPeers.length + 1,
                peersInRoom: roomPeers.map(p => ({ peerId: p.peerId, name: p.name, role: p.role })),
              }));

              // Alert existing peers to send join request/offer
              roomPeers.forEach(peer => {
                peer.ws.send(JSON.stringify({
                  type: 'peer-joined',
                  peerId,
                  name,
                  role,
                }));
              });
              break;
            }

            case 'offer': {
              if (!peerInfo) return;
              const roomPeers = this.getPeersInRoom(peerInfo.consultationId, peerInfo.peerId);
              roomPeers.forEach(peer => {
                peer.ws.send(JSON.stringify({
                  type: 'offer',
                  offer,
                  senderPeerId: peerInfo!.peerId,
                  senderName: peerInfo!.name,
                }));
              });
              break;
            }

            case 'answer': {
              if (!peerInfo) return;
              const roomPeers = this.getPeersInRoom(peerInfo.consultationId, peerInfo.peerId);
              roomPeers.forEach(peer => {
                peer.ws.send(JSON.stringify({
                  type: 'answer',
                  answer,
                  senderPeerId: peerInfo!.peerId,
                }));
              });
              break;
            }

            case 'ice-candidate': {
              if (!peerInfo) return;
              const roomPeers = this.getPeersInRoom(peerInfo.consultationId, peerInfo.peerId);
              roomPeers.forEach(peer => {
                peer.ws.send(JSON.stringify({
                  type: 'ice-candidate',
                  candidate,
                  senderPeerId: peerInfo!.peerId,
                }));
              });
              break;
            }

            case 'chat-message': {
              if (!peerInfo) return;
              const messageData: ChatMessagePayload = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                consultationId: peerInfo.consultationId,
                sender: peerInfo.name,
                senderRole: peerInfo.role,
                text: msg || payload.text,
                timestamp: new Date().toISOString(),
              };

              // Persist chat message
              await this.saveChatMessage(messageData);

              // Broadcast to all clients in room including sender
              const allRoomPeers = this.getPeersInRoom(peerInfo.consultationId);
              allRoomPeers.forEach(peer => {
                peer.ws.send(JSON.stringify({
                  type: 'chat-message',
                  message: messageData,
                }));
              });
              break;
            }

            case 'leave': {
              if (peerInfo) {
                this.handlePeerDisconnect(peerInfo);
              }
              break;
            }

            default:
              logger.warn({ type }, 'Unknown WebSocket message type received');
          }
        } catch (err: any) {
          logger.error({ error: err.message }, 'Error handling WebSocket message');
        }
      });

      ws.on('close', () => {
        if (peerInfo) {
          this.handlePeerDisconnect(peerInfo);
        }
      });

      ws.on('error', (err) => {
        logger.error({ error: err.message }, 'WebSocket client error');
      });
    });

    return this.wss;
  }

  private getPeersInRoom(consultationId: string, excludePeerId?: string): ConnectedPeer[] {
    const list: ConnectedPeer[] = [];
    this.peers.forEach((peer) => {
      if (peer.consultationId === consultationId && peer.peerId !== excludePeerId) {
        list.push(peer);
      }
    });
    return list;
  }

  private async handlePeerDisconnect(peer: ConnectedPeer) {
    this.peers.delete(peer.peerId);
    logger.info({ peerId: peer.peerId, consultationId: peer.consultationId }, 'Peer disconnected from room');

    await this.removePeerFromRedisRoom(peer.consultationId, peer.peerId);

    const remainingPeers = this.getPeersInRoom(peer.consultationId);
    remainingPeers.forEach(remaining => {
      remaining.ws.send(JSON.stringify({
        type: 'peer-left',
        peerId: peer.peerId,
        name: peer.name,
      }));
    });
  }

  private async addPeerToRedisRoom(consultationId: string, peerId: string, name: string, role: string) {
    try {
      if (redisClient && redisClient.status === 'ready') {
        const key = `room:${consultationId}:peers`;
        await redisClient.hset(key, peerId, JSON.stringify({ name, role, joinedAt: new Date().toISOString() }));
        await redisClient.expire(key, 86400); // 24hr TTL
      }
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Failed to record peer in Redis room');
    }
  }

  private async removePeerFromRedisRoom(consultationId: string, peerId: string) {
    try {
      if (redisClient && redisClient.status === 'ready') {
        const key = `room:${consultationId}:peers`;
        await redisClient.hdel(key, peerId);
      }
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Failed to remove peer from Redis room');
    }
  }

  public async saveChatMessage(msg: ChatMessagePayload): Promise<void> {
    // 1. In-memory fallback log
    const existing = this.inMemoryChatLogs.get(msg.consultationId) || [];
    existing.push(msg);
    this.inMemoryChatLogs.set(msg.consultationId, existing);

    // 2. Redis List Persistence
    try {
      if (redisClient && redisClient.status === 'ready') {
        const key = `chat:${msg.consultationId}:messages`;
        await redisClient.rpush(key, JSON.stringify(msg));
        await redisClient.expire(key, 604800); // 7 days retention
      }
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Failed to persist chat message in Redis');
    }
  }

  public async getChatHistory(consultationId: string): Promise<ChatMessagePayload[]> {
    try {
      if (redisClient && redisClient.status === 'ready') {
        const key = `chat:${consultationId}:messages`;
        const rawLogs = await redisClient.lrange(key, 0, -1);
        if (rawLogs && rawLogs.length > 0) {
          return rawLogs.map(item => JSON.parse(item));
        }
      }
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Failed to fetch chat logs from Redis, falling back to in-memory');
    }

    return this.inMemoryChatLogs.get(consultationId) || [];
  }
}

export const signalingService = new TelemedicineSignalingService();
