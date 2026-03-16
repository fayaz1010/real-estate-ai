// PLACEHOLDER FILE: src/modules/inspections/components/VirtualTour/VirtualTourLauncher.tsx
// TODO: Add your implementation here

import React, { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, Share2, Settings } from 'lucide-react';
import { Inspection } from '../../types/inspection.types';

interface VirtualTourLauncherProps {
  inspection: Inspection;
}

export const VirtualTourLauncher: React.FC<VirtualTourLauncherProps> = ({
  inspection,
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'fair' | 'poor'>('good');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    // Simulate connection quality check
    const interval = setInterval(() => {
      const qualities: Array<'good' | 'fair' | 'poor'> = ['good', 'fair', 'poor'];
      setConnectionQuality(qualities[Math.floor(Math.random() * 3)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinTour = async () => {
    setIsJoining(true);
    // Simulate joining
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsJoining(false);
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end the virtual tour?')) {
      setIsConnected(false);
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          sender: 'You',
          message: chatInput,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        },
      ]);
      setChatInput('');
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'good':
        return 'bg-green-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Pre-call screen
  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Video className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Virtual Property Tour
          </h2>
          <p className="text-gray-600">
            {inspection.property?.title}
          </p>
        </div>

        {/* Meeting Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Tour Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium text-gray-900">
                {new Date(inspection.scheduledDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })} at {new Date(inspection.scheduledDate).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900">{inspection.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Host:</span>
              <span className="font-medium text-gray-900">
                {inspection.landlord?.firstName} {inspection.landlord?.lastName}
              </span>
            </div>
          </div>
        </div>

        {/* Pre-call Settings */}
        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={!isMuted}
              onChange={(e) => setIsMuted(!e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <Mic className="w-5 h-5 text-gray-600" />
            <span className="flex-1 font-medium text-gray-900">Enable Microphone</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={!isVideoOff}
              onChange={(e) => setIsVideoOff(!e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <Video className="w-5 h-5 text-gray-600" />
            <span className="flex-1 font-medium text-gray-900">Enable Camera</span>
          </label>
        </div>

        {/* Join Button */}
        <button
          onClick={handleJoinTour}
          disabled={isJoining}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isJoining ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              Join Virtual Tour
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="font-medium mb-1">Before you join:</p>
          <ul className="space-y-1 text-xs">
            <li>• Make sure you're in a quiet place with good internet</li>
            <li>• Test your camera and microphone</li>
            <li>• Prepare any questions you have about the property</li>
          </ul>
        </div>
      </div>
    );
  }

  // Active call screen
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative bg-gray-900 aspect-video">
        {/* Main Video (Host) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-white font-medium">
              {inspection.landlord?.firstName} {inspection.landlord?.lastName}
            </p>
            <p className="text-gray-400 text-sm">Host</p>
          </div>
        </div>

        {/* Self Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
          <div className="w-full h-full flex items-center justify-center">
            {isVideoOff ? (
              <VideoOff className="w-8 h-8 text-gray-400" />
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Video className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-white text-xs">You</p>
              </div>
            )}
          </div>
        </div>

        {/* Connection Quality Indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black bg-opacity-50 rounded-full">
          <div className={`w-2 h-2 rounded-full ${getQualityColor(connectionQuality)}`} />
          <span className="text-white text-xs capitalize">{connectionQuality} connection</span>
        </div>

        {/* Timer */}
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-black bg-opacity-50 rounded-full">
          <span className="text-white text-xs font-mono">00:00</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-center gap-4">
          {/* Mute/Unmute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Video On/Off */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full transition-colors ${
              isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
          >
            <Phone className="w-6 h-6 text-white transform rotate-135" />
          </button>

          {/* Chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors relative"
          >
            <MessageSquare className="w-6 h-6 text-white" />
            {chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                {chatMessages.length}
              </span>
            )}
          </button>

          {/* Share Screen */}
          <button
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            title="Share screen"
          >
            <Share2 className="w-6 h-6 text-white" />
          </button>

          {/* Settings */}
          <button
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">No messages yet</p>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">{msg.sender}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
