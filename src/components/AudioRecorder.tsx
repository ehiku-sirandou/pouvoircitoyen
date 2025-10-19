import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Upload, Loader2 } from 'lucide-react';
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
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Impossible d\'accéder au microphone. Veuillez autoriser l\'accès.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
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
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Enregistrez votre contribution
      </h2>

      <div className="flex flex-col items-center space-y-6">
        {!audioUrl ? (
          <>
            <div className="relative">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-gradient-to-br from-[#85c880] to-[#4ec6e0] hover:scale-105'
                } shadow-xl`}
              >
                {isRecording ? (
                  <Square className="w-10 h-10 md:w-12 md:h-12 text-white" fill="white" />
                ) : (
                  <Mic className="w-10 h-10 md:w-12 md:h-12 text-white" />
                )}
              </button>
              {isRecording && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-500 font-semibold">
                  {formatTime(duration)}
                </div>
              )}
            </div>
            <p className="text-gray-600 text-center text-sm md:text-base">
              {isRecording ? 'Enregistrement en cours...' : 'Cliquez pour commencer l\'enregistrement'}
            </p>
          </>
        ) : (
          <>
            <div className="w-full max-w-md space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <audio controls src={audioUrl} className="w-full" />
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Durée: {formatTime(duration)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetRecording}
                  className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-colors"
                >
                  Réenregistrer
                </button>
                <button
                  onClick={uploadAudio}
                  disabled={isUploading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#85c880] to-[#4ec6e0] hover:opacity-90 text-white rounded-xl font-medium transition-opacity flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Envoyer
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
