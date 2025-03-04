import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Camera, CameraOff, Users, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CallInterfaceProps {
  sessionId: string;
  appointmentId: string;
  callType: 'video' | 'phone';
  onEnd: () => void;
}

export default function CallInterface({ 
  sessionId, 
  appointmentId, 
  callType, 
  onEnd 
}: CallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeCall();
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Initialize WebRTC connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Get user media with camera preference
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video' ? { facingMode: isFrontCamera ? 'user' : 'environment' } : false,
        audio: true
      });

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      // Set local video
      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream;
      }

      // Handle incoming tracks
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Create and send offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      // Update call session with offer
      const { error } = await supabase
        .from('call_sessions')
        .update({
          connection_data: { offer },
          status: 'connecting'
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Subscribe to connection data changes
      const subscription = supabase
        .channel(`call_${sessionId}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'call_sessions',
          filter: `id=eq.${sessionId}`
        }, async (payload) => {
          const data = payload.new.connection_data;
          
          if (data.answer && !peerConnection.current?.currentRemoteDescription) {
            await peerConnection.current?.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          }
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing call:', error);
      onEnd();
    }
  };

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const switchCamera = async () => {
    try {
      const newFacingMode = !isFrontCamera;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode ? 'user' : 'environment' },
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsFrontCamera(newFacingMode);
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const endCall = async () => {
    // Update call session
    await supabase
      .from('call_sessions')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    // Clean up media streams
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());

    onEnd();
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gray-900 flex flex-col"
    >
      {/* Video Area */}
      {callType === 'video' ? (
        <div className="flex-1 relative">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          <video
            ref={localVideoRef}
            className="absolute bottom-20 right-4 w-32 h-48 object-cover rounded-2xl border-2 border-white
                     shadow-lg transition-all transform hover:scale-110 z-10"
            autoPlay
            playsInline
            muted
          />
          
          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-full bg-gray-800/80 text-white hover:bg-gray-700 
                     transition-colors backdrop-blur-sm"
            >
              <Users className="w-6 h-6" />
            </button>
            <button
              onClick={switchCamera}
              className="p-3 rounded-full bg-gray-800/80 text-white hover:bg-gray-700 
                     transition-colors backdrop-blur-sm"
            >
              <Camera className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-3 rounded-full bg-gray-800/80 text-white hover:bg-gray-700 
                     transition-colors backdrop-blur-sm"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center
                        animate-pulse">
              <Phone className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Voice Call</h2>
            <p className="text-emerald-100">Connected</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-800/90 backdrop-blur-md p-6">
        <div className="flex justify-center gap-6">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
            } transition-all transform hover:scale-110 active:scale-95`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
              } transition-all transform hover:scale-110 active:scale-95`}
            >
              {isVideoOff ? (
                <VideoOff className="w-6 h-6 text-white" />
              ) : (
                <Video className="w-6 h-6 text-white" />
              )}
            </button>
          )}

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 
                   transition-all transform hover:scale-110 active:scale-95"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg 
                     transform transition-transform animate-slide-in">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat</h3>
          </div>
          {/* Add chat functionality here */}
        </div>
      )}
    </div>
  );
}