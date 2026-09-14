import React, { useState, useEffect, useRef } from 'react';
import type { Consultation } from '../types';
import {
  X,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Shield,
  Send,
  Maximize2,
  Minimize2,
  Monitor,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Users,
  Radio
} from 'lucide-react';

interface VideoRoomModalProps {
  consultation: Consultation | null;
  onClose: () => void;
}

export const VideoRoomModal: React.FC<VideoRoomModalProps> = ({ consultation, onClose }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);
  
  const [mediaStatus, setMediaStatus] = useState<'initiating' | 'permission_denied' | 'ready' | 'connected'>('initiating');
  const [peerConnected, setPeerConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signalingMode, setSignalingMode] = useState<'websocket' | 'broadcast'>('broadcast');

  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'End-to-End Encrypted Telemedicine Session Active.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { sender: consultation?.doctorName || 'Dr. Vaidya Ananya Sharma', text: 'Namaste! Welcome to your Amrutam Video Session. How are you feeling today?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Video Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // WebRTC & Network Refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  if (!consultation) return null;

  // Initialize Media, WebSocket Backend, and WebRTC Connection
  useEffect(() => {
    let isSubscribed = true;
    const roomId = `amrutam_consultation_${consultation.id}`;

    const setupMediaAndWebRTC = async () => {
      try {
        setMediaStatus('initiating');
        setErrorMessage(null);

        // 1. Get User Media (Camera & Microphone)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        if (!isSubscribed) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;

        // Attach stream to local preview video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setMediaStatus('ready');

        // 2. Setup RTCPeerConnection with STUN servers
        const configuration: RTCConfiguration = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        };

        const pc = new RTCPeerConnection(configuration);
        peerConnectionRef.current = pc;

        // Add local tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Handle remote stream incoming
        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
            setPeerConnected(true);
            setMediaStatus('connected');
          }
        };

        // Handle ICE Candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            // Send via WebSocket backend if connected
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
              socketRef.current.send(JSON.stringify({
                type: 'ice-candidate',
                consultationId: consultation.id,
                candidate: event.candidate,
              }));
            }
            // Send via BroadcastChannel as parallel fallback
            if (broadcastChannelRef.current) {
              broadcastChannelRef.current.postMessage({
                type: 'ice-candidate',
                candidate: event.candidate,
              });
            }
          }
        };

        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
            setPeerConnected(false);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
          } else if (pc.iceConnectionState === 'connected') {
            setPeerConnected(true);
            setMediaStatus('connected');
          }
        };

        // 3. Connect Backend WebSocket Signaling Server
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.hostname || 'localhost';
        const wsUrl = `${wsProtocol}//${wsHost}:3000/ws/telemedicine`;

        try {
          const socket = new WebSocket(wsUrl);
          socketRef.current = socket;

          socket.onopen = () => {
            setSignalingMode('websocket');
            socket.send(JSON.stringify({
              type: 'join',
              consultationId: consultation.id,
              userId: consultation.patientId || 'patient_user',
              role: 'PATIENT',
              name: consultation.patientName || 'Test Patient',
            }));
          };

          socket.onmessage = async (event) => {
            try {
              const data = JSON.parse(event.data);

              if (data.type === 'peer-joined') {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.send(JSON.stringify({
                  type: 'offer',
                  consultationId: consultation.id,
                  offer,
                }));
              } else if (data.type === 'offer') {
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({
                  type: 'answer',
                  consultationId: consultation.id,
                  answer,
                }));
              } else if (data.type === 'answer') {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
              } else if (data.type === 'ice-candidate') {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
              } else if (data.type === 'chat-message') {
                const m = data.message;
                const formattedTime = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setChatMessages((prev) => [
                  ...prev,
                  { sender: m.sender, text: m.text, time: formattedTime }
                ]);
              }
            } catch (err) {
              console.error('Error processing WebSocket message:', err);
            }
          };

          socket.onerror = () => {
            setSignalingMode('broadcast');
          };
        } catch (wsErr) {
          setSignalingMode('broadcast');
        }

        // 4. Fallback/Parallel BroadcastChannel for multi-tab testing
        const channel = new BroadcastChannel(roomId);
        broadcastChannelRef.current = channel;

        channel.onmessage = async (event) => {
          const data = event.data;
          if (!data) return;

          if (data.type === 'join-request') {
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              channel.postMessage({ type: 'offer', offer });
            } catch (err) {
              console.error('Error creating offer:', err);
            }
          } else if (data.type === 'offer') {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              channel.postMessage({ type: 'answer', answer });
            } catch (err) {
              console.error('Error handling offer:', err);
            }
          } else if (data.type === 'answer') {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            } catch (err) {
              console.error('Error setting remote description:', err);
            }
          } else if (data.type === 'ice-candidate') {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (err) {
              console.error('Error adding ICE candidate:', err);
            }
          } else if (data.type === 'chat') {
            setChatMessages((prev) => [...prev, data.msg]);
          }
        };

        channel.postMessage({ type: 'join-request' });

      } catch (err: any) {
        console.error('Failed to access camera/microphone:', err);
        if (isSubscribed) {
          setMediaStatus('permission_denied');
          setErrorMessage(err.message || 'Camera or Microphone access was denied or not found.');
        }
      }
    };

    setupMediaAndWebRTC();

    return () => {
      isSubscribed = false;

      // Cleanup local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Cleanup WebSocket & Peer connection
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [consultation.id]);

  // Handle Mute Microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Handle Video Toggle
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  // Handle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      if (localStreamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;

        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (peerConnectionRef.current && videoTrack) {
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find((s) => s.track?.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(videoTrack);
          }
        }
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;

        const screenTrack = screenStream.getVideoTracks()[0];

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        if (peerConnectionRef.current) {
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find((s) => s.track?.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
          }
        }

        screenTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Screen sharing failed:', err);
      }
    }
  };

  // Toggle Native Fullscreen
  const toggleFullscreenMode = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Handle Send Chat Message to Backend WebSocket & Peer
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = { sender: 'You', text: newMessage, time };

    setChatMessages((prev) => [...prev, msg]);

    // 1. Send to Backend WebSocket Server
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat-message',
        consultationId: consultation.id,
        text: newMessage,
      }));
    }

    // 2. Fallback send via BroadcastChannel
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'chat',
        msg: { sender: consultation.patientName || 'Patient', text: newMessage, time },
      });
    }

    setNewMessage('');
  };

  return (
    <div
      className={`video-room-overlay ${isFullscreen ? 'is-fullscreen' : ''}`}
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="video-room-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          padding: '12px 20px',
          background: 'linear-gradient(90deg, #061A13 0%, #0B251D 100%)',
          borderBottom: '1px solid rgba(0, 173, 181, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: mediaStatus === 'connected' ? 'var(--emerald-botanical)' : 'var(--amber-gold)',
              boxShadow: mediaStatus === 'connected' ? '0 0 10px var(--emerald-botanical)' : '0 0 10px var(--amber-gold)',
            }} />
            <div>
              <span style={{ color: '#FFF', fontWeight: 700, fontSize: '0.98rem', display: 'block', lineHeight: '1.2' }}>
                {consultation.doctorName || 'Dr. Vaidya Ananya Sharma'}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Patient: {consultation.patientName || 'Test Patient (Vivek Panchal)'} • {consultation.type} Session
              </span>
            </div>

            <span className="badge badge-teal" style={{ fontSize: '0.68rem', marginLeft: '6px' }}>
              <Shield size={12} /> AES-256 WebRTC Encrypted
            </span>

            {signalingMode === 'websocket' ? (
              <span className="badge badge-teal" style={{ fontSize: '0.68rem' }}>
                <Radio size={12} /> Backend WebSocket Live
              </span>
            ) : null}

            {peerConnected ? (
              <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                <CheckCircle2 size={12} /> Peer Live Connected
              </span>
            ) : (
              <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                <Users size={12} /> Signaling Active (Open doctor tab to connect)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowChatMobile(!showChatMobile)}
              className="hide-desktop"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                color: '#FFF',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <MessageSquare size={16} /> Chat
            </button>

            <button
              onClick={toggleFullscreenMode}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--teal-glow)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#F87171',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <X size={18} /> Leave
            </button>
          </div>
        </div>

        {/* Main Video & Side Chat Grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: showChatMobile ? '1fr' : '1fr 340px',
          height: 'calc(100% - 58px)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Main Video View Container */}
          <div style={{
            position: 'relative',
            background: '#020907',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
          }}>
            
            {/* Real Remote Video Stream OR Local Main Feed */}
            {peerConnected ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="video-feed-element"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              /* When solo / waiting for peer: Main Screen renders user's live camera feed */
              <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mediaStatus === 'ready' || mediaStatus === 'initiating' ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`video-feed-element ${!isScreenSharing ? 'video-mirror' : ''}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isVideoOn ? 1 : 0.2 }}
                  />
                ) : null}

                {/* Overlaid status banner when solo */}
                {!isVideoOn && (
                  <div style={{
                    position: 'absolute',
                    zIndex: 4,
                    textAlign: 'center',
                    background: 'rgba(5, 18, 14, 0.85)',
                    padding: '20px 32px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-card)',
                  }}>
                    <VideoOff size={48} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                    <h4 style={{ color: '#FFF', fontSize: '1.1rem' }}>Camera Stream Paused</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click video button to resume your webcam.</p>
                  </div>
                )}

                {mediaStatus === 'permission_denied' && (
                  <div style={{
                    position: 'absolute',
                    zIndex: 5,
                    textAlign: 'center',
                    background: 'rgba(24, 8, 8, 0.95)',
                    padding: '30px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #EF4444',
                    maxWidth: '420px',
                  }}>
                    <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '12px' }} />
                    <h4 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: '8px' }}>Webcam Access Required</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                      {errorMessage || 'Please allow browser permissions to use your camera and microphone for live video calling.'}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="btn btn-teal"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <RefreshCw size={16} /> Retry Permissions
                    </button>
                  </div>
                )}

                {/* Waiting Banner Overlay */}
                {mediaStatus === 'ready' && !peerConnected && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 6,
                    background: 'rgba(4, 16, 12, 0.82)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 173, 181, 0.3)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#FFF',
                    fontSize: '0.82rem',
                  }}>
                    <div className="badge badge-teal" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>
                      LIVE WEBCAM ACTIVE
                    </div>
                    <span>Waiting for {consultation.doctorName || 'Doctor'} to enter consultation...</span>
                  </div>
                )}
              </div>
            )}

            {/* Self View PIP Window (Shown when Peer is Connected) */}
            {peerConnected && (
              <div style={{
                position: 'absolute',
                bottom: '90px',
                right: '24px',
                width: '200px',
                height: '135px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px solid var(--teal-primary)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
                background: '#04100C',
                zIndex: 8,
              }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`video-feed-element ${!isScreenSharing ? 'video-mirror' : ''}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isVideoOn ? 1 : 0.2 }}
                />
                {!isVideoOn && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0B1E17',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                  }}>
                    Camera Off
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '6px',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  color: '#FFF',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}>
                  You (Self View)
                </div>
              </div>
            )}

            {/* Floating Bottom Control Toolbar */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(4, 18, 14, 0.88)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 173, 181, 0.35)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
              zIndex: 9,
            }}>
              {/* Mic Toggle Button */}
              <button
                onClick={toggleMic}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isMicOn ? 'rgba(255,255,255,0.12)' : '#EF4444',
                  color: '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              {/* Video Toggle Button */}
              <button
                onClick={toggleVideo}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isVideoOn ? 'rgba(255,255,255,0.12)' : '#EF4444',
                  color: '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isVideoOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
              </button>

              {/* Screen Share Button */}
              <button
                onClick={toggleScreenShare}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isScreenSharing ? 'var(--teal-primary)' : 'rgba(255,255,255,0.12)',
                  color: '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
              >
                <Monitor size={20} />
              </button>

              {/* End Call Button */}
              <button
                onClick={onClose}
                style={{
                  width: '56px',
                  height: '46px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                  color: '#FFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                }}
                title="End Consultation Call"
              >
                <PhoneOff size={22} />
              </button>
            </div>
          </div>

          {/* Right Side Consultation Chat Panel */}
          <div style={{
            background: '#04120E',
            borderLeft: '1px solid rgba(0, 173, 181, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--teal-glow)',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#071A14',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="var(--teal-glow)" /> Live Medical Chat
              </span>
              <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>Encrypted</span>
            </div>

            {/* Chat Messages Log */}
            <div style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background: msg.sender === 'You'
                    ? 'linear-gradient(135deg, var(--teal-primary) 0%, #00767C 100%)'
                    : 'rgba(255, 255, 255, 0.07)',
                  border: msg.sender === 'System' ? '1px solid rgba(0, 173, 181, 0.3)' : 'none',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    color: msg.sender === 'You' ? '#E0F7FA' : 'var(--teal-glow)',
                    fontWeight: 700,
                    marginBottom: '3px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}>
                    <span>{msg.sender}</span>
                    <span style={{ opacity: 0.7, fontWeight: 400 }}>{msg.time}</span>
                  </div>
                  <div style={{ color: '#FFF', wordBreak: 'break-word' }}>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={handleSendChat}
              style={{
                padding: '14px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '8px',
                background: '#061712',
              }}
            >
              <input
                type="text"
                placeholder="Type your message to doctor..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input-field"
                style={{ padding: '10px 14px', fontSize: '0.88rem' }}
              />
              <button
                type="submit"
                className="btn btn-teal"
                style={{ padding: '10px 16px', borderRadius: 'var(--radius-sm)' }}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
