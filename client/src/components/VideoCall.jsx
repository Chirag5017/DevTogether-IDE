import { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import socket from '../socket.js';

const VideoCall = ({ roomId }) => {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [callActive, setCallActive] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  // Debugging logs
  useEffect(() => {
    console.log('Current peers:', peers);
    console.log('Local stream:', localStream);
  }, [peers, localStream]);

  useEffect(() => {
    if (!callActive) return;

    const initializeCall = async () => {
      try {
        console.log('Requesting media devices...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: true
        });
        console.log('Got media stream:', stream);
        
        setLocalStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
          console.log('Assigned stream to local video');
        }

        socket.emit('join-video-call', roomId);
        console.log('Emitted join-video-call for room:', roomId);

        socket.on('all-users', users => {
          console.log('Received all-users:', users);
          const newPeers = [];
          users.forEach(userID => {
            if (userID === socket.id) return;
            
            console.log('Creating peer for user:', userID);
            const peer = createPeer(userID, socket.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            newPeers.push({ peerID: userID, peer });
          });
          setPeers(newPeers);
        });

        socket.on('user-joined', payload => {
          console.log('User joined:', payload.callerID);
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          setPeers(prev => [...prev, { peerID: payload.callerID, peer }]);
        });

        socket.on('receiving-returned-signal', payload => {
          console.log('Received returned signal from:', payload.id);
          const item = peersRef.current.find(p => p.peerID === payload.id);
          if (item?.peer) {
            console.log('Signaling peer...');
            item.peer.signal(payload.signal);
          }
        });

        socket.on('user-left', userId => {
          console.log('User left:', userId);
          const peerObj = peersRef.current.find(p => p.peerID === userId);
          if (peerObj?.peer) {
            peerObj.peer.destroy();
          }
          peersRef.current = peersRef.current.filter(p => p.peerID !== userId);
          setPeers(prev => prev.filter(p => p.peerID !== userId));
        });

      } catch (err) {
        console.error('Error initializing call:', err);
        endCall();
      }
    };

    initializeCall();

    return () => {
      console.log('Cleaning up call...');
      socket.off('all-users');
      socket.off('user-joined');
      socket.off('receiving-returned-signal');
      socket.off('user-left');
    };
  }, [callActive, roomId]);

  function createPeer(userToSignal, callerID, stream) {
    console.log('Creating peer for:', userToSignal);
    const peer = new Peer({
      initiator: true,
      trickle: true, // Changed to true for better debugging
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          // Add TURN servers if needed (see below)
        ]
      }
    });

    peer.on('signal', signal => {
      console.log('Sending signal to:', userToSignal);
      socket.emit('sending-signal', { 
        userToSignal, 
        callerID, 
        signal 
      });
    });

    peer.on('stream', remoteStream => {
      console.log('Received remote stream from:', callerID);
      setPeers(prev => prev.map(p => 
        p.peerID === callerID ? { ...p, stream: remoteStream } : p
      ));
    });

    peer.on('connect', () => {
      console.log('Peer connected:', callerID);
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
    });

    peer.on('iceCandidate', candidate => {
      console.log('ICE candidate:', candidate);
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    console.log('Adding peer for:', callerID);
    const peer = new Peer({
      initiator: false,
      trickle: true,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', signal => {
      console.log('Returning signal to:', callerID);
      socket.emit('returning-signal', { 
        signal, 
        callerID 
      });
    });

    peer.on('stream', remoteStream => {
      console.log('Received remote stream from:', callerID);
      setPeers(prev => prev.map(p => 
        p.peerID === callerID ? { ...p, stream: remoteStream } : p
      ));
    });

    peer.on('connect', () => {
      console.log('Peer connected:', callerID);
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
    });

    peer.on('iceCandidate', candidate => {
      console.log('ICE candidate:', candidate);
    });

    console.log('Signaling peer with incoming signal');
    peer.signal(incomingSignal);
    return peer;
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
        console.log('Video toggled:', videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
        console.log('Audio toggled:', audioTrack.enabled);
      }
    }
  };

  const startCall = async () => {
    console.log('Starting call...');
    try {
      // Check permissions first
      const permissions = await navigator.permissions.query({ name: 'camera' });
      console.log('Camera permission state:', permissions.state);
      
      const micPermission = await navigator.permissions.query({ name: 'microphone' });
      console.log('Microphone permission state:', micPermission.state);
      
      setCallActive(true);
    } catch (err) {
      console.error('Permission check failed:', err);
      setCallActive(true); // Still try to start
    }
  };

  const endCall = () => {
    console.log('Ending call...');
    peersRef.current.forEach(peerObj => {
      if (peerObj.peer) {
        peerObj.peer.destroy();
      }
    });
    peersRef.current = [];
    setPeers([]);
    
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        console.log('Stopped track:', track.kind);
      });
      setLocalStream(null);
    }
    
    if (userVideo.current?.srcObject) {
      userVideo.current.srcObject = null;
    }
    
    setCallActive(false);
    socket.emit('leave-video-call', roomId);
    console.log('Call ended');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!callActive ? (
        <button
          onClick={startCall}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg"
          title="Start Video Call"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-xl p-4 w-64">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {peers.map((peer, index) => (
              <Video key={index} peer={peer.peer} peerID={peer.peerID} />
            ))}
          </div>
          
          <video
            ref={userVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded mb-2"
          />
          
          <div className="flex justify-center space-x-2">
            <button
              onClick={toggleVideo}
              className={`p-2 rounded-full ${videoEnabled ? 'bg-gray-600' : 'bg-red-600'}`}
              title={videoEnabled ? "Turn Off Video" : "Turn On Video"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={videoEnabled ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" : "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"} />
              </svg>
            </button>
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-full ${audioEnabled ? 'bg-gray-600' : 'bg-red-600'}`}
              title={audioEnabled ? "Turn Off Audio" : "Turn On Audio"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={audioEnabled ? "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" : "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"} />
              </svg>
            </button>
            <button
              onClick={endCall}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
              title="End Call"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Video = ({ peer, peerID }) => {
  const ref = useRef();

  useEffect(() => {
    if (!peer) return;
    
    console.log(`Setting up video for peer ${peerID}`);
    peer.on('stream', stream => {
      console.log(`Received stream for peer ${peerID}`, stream);
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });

    return () => {
      console.log(`Cleaning up video for peer ${peerID}`);
    };
  }, [peer, peerID]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="w-full h-auto rounded"
    />
  );
};

export default VideoCall;