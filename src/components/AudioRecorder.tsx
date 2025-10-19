import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Loader2, Trash2, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AudioRecorderProps {
  onSuccess: () => void;
}

export default function AudioRecorder({ onSuccess }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const MAX_DURATION = 90; 

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('MediaRecorder onstop callback', { chunksCount: chunksRef.current.length });
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log('Blob created', { size: blob.size });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        console.log('URL created', { url });
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
        console.log('Audio preview ready');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          console.log(`Timer: ${newDuration}s / ${MAX_DURATION}s`);
          // Arrêt automatique à 1min30
          if (newDuration >= MAX_DURATION) {
            console.log('Auto-stopping recording at max duration');
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Impossible d\'accéder au microphone. Veuillez autoriser l\'accès.');
    }
  };

  const stopRecording = () => {
    console.log('stopRecording called', { 
      hasMediaRecorder: !!mediaRecorderRef.current, 
      mediaRecorderState: mediaRecorderRef.current?.state,
      isRecording,
      hasTimer: !!timerRef.current 
    });
    
    // Vérifier l'état du MediaRecorder directement
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        console.log('Stopping MediaRecorder...');
        mediaRecorderRef.current.stop();
        console.log('MediaRecorder stopped successfully');
      } catch (error) {
        console.error('Error stopping MediaRecorder:', error);
      }
    } else {
      console.log('MediaRecorder not in recording state or not available');
    }
    
    // Toujours nettoyer les états
    console.log('Setting isRecording to false');
    setIsRecording(false);
    
    if (timerRef.current) {
      console.log('Clearing timer');
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };


  const uploadAudio = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      const fileName = `contribution-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-contributions')
        .upload(fileName, audioBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio-contributions')
        .getPublicUrl(uploadData.path);

      const { error: dbError } = await supabase
        .from('audio_contributions')
        .insert({
          audio_url: publicUrl,
          status: 'pending',
          duration: duration,
          file_size: audioBlob.size,
        });

      if (dbError) throw dbError;

      setAudioBlob(null);
      setAudioUrl(null);
      setDuration(0);
      onSuccess();
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Erreur lors de l\'envoi de l\'audio. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
        Enregistrez votre contribution
      </h2>

      <div className="flex flex-col items-center space-y-4 sm:space-y-6">
        {!audioUrl ? (
          <>
            {/* Interface d'enregistrement simple */}
            <div className="relative">
              <button
                onClick={() => {
                  console.log('Button clicked', { isRecording });
                  if (isRecording) {
                    console.log('Calling stopRecording');
                    stopRecording();
                  } else {
                    console.log('Calling startRecording');
                    startRecording();
                  }
                }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 transform relative z-10 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 shadow-xl'
                    : 'bg-gradient-to-br from-[#85c880] to-[#4ec6e0] hover:scale-105 shadow-xl'
                }`}
              >
                {isRecording ? (
                  <Square className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="white" />
                ) : (
                  <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                )}
              </button>
            </div>

            {/* Timer et instructions - Responsive */}
            <div className="text-center px-4">
              {isRecording ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-xl sm:text-2xl font-bold text-red-500 animate-pulse">
                    {formatTime(duration)}
                    {duration >= MAX_DURATION - 10 && (
                      <span className="text-orange-500 ml-2">⚠️</span>
                    )}
                  </div>
                  
                  {/* Animation d'ondes sonores */}
                  <div className="flex items-center justify-center gap-1">
                    <div className="audio-wave"></div>
                    <div className="audio-wave"></div>
                    <div className="audio-wave"></div>
                    <div className="audio-wave"></div>
                    <div className="audio-wave"></div>
                  </div>
                  
                  <p className="text-red-600 font-medium text-sm sm:text-base">Enregistrement en cours...</p>
                  <p className="text-xs sm:text-sm text-gray-500">Cliquez sur le carré pour arrêter (max 1min30)</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600 text-base sm:text-lg font-medium">
                    Cliquez pour commencer l'enregistrement
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Maximum 1 minute 30 secondes
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Interface de prévisualisation style WhatsApp - Responsive */}
            <div className="w-full max-w-sm sm:max-w-lg">
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Enregistrement</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">{formatTime(duration)}</span>
                </div>
                
                <audio controls src={audioUrl} className="w-full mb-3 sm:mb-4" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                    <span>Fichier audio</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {Math.round((audioBlob?.size || 0) / 1024)} KB
                  </span>
                </div>
              </div>

              {/* Boutons d'action style WhatsApp - Responsive */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={resetRecording}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors text-sm sm:text-base touch-manipulation"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Supprimer</span>
                  <span className="sm:hidden">Suppr.</span>
                </button>
                <button
                  onClick={uploadAudio}
                  disabled={isUploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-[#85c880] to-[#4ec6e0] hover:opacity-90 active:opacity-80 text-white rounded-xl font-medium transition-opacity disabled:opacity-50 text-sm sm:text-base touch-manipulation"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="hidden sm:inline">Envoi...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Envoyer</span>
                      <span className="sm:hidden">Env.</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
