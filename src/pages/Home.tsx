import { useState, useRef, useEffect } from 'react';
import { Users, Mic2, TrendingUp, Volume2, VolumeX, Pause } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';
import ValidatedContributions from '../components/ValidatedContributions';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleRecordingSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleRecordingStart = () => {
    // Mettre l'audio d'Omar Africa en pause quand on commence à enregistrer
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Auto-play audio au chargement
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Autoplay prevented:', error);
      });
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffa921]/5 via-white to-[#85c880]/10">
      {/* Hero Section Moderne */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#ffa921] via-[#fc5902] to-[#85c880] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Badge de collaboration */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">En collaboration avec Omar Africa</span>
              </div>
            </div>

            {/* Titre Principal */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                Ta Voix Compte ! 🎤
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-white/90">
                Exprime-toi et fais bouger les choses
              </p>
              <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
                Partage tes idées, tes propositions, tes témoignages. Chaque voix compte pour construire le Sénégal de demain.
              </p>
            </div>

            {/* Stats Engagement */}
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl md:text-3xl font-bold">100+</div>
                <div className="text-xs md:text-sm text-white/80">Voix partagées</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl md:text-3xl font-bold">50+</div>
                <div className="text-xs md:text-sm text-white/80">Jeunes engagés</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl md:text-3xl font-bold">24/7</div>
                <div className="text-xs md:text-sm text-white/80">Toujours ouvert</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 md:h-16">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </header>

      <main className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-20">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          
          {/* Message Audio Omar Africa - Animé */}
          <div className="relative bg-gradient-to-br from-[#27103E] to-[#4a1e66] rounded-2xl shadow-xl overflow-hidden">
            {/* Audio caché */}
            <audio
              ref={audioRef}
              src="https://qfjhnlmqcuksqlggdtfw.supabase.co/storage/v1/object/public/public-assets/omar-africa-message.wav"
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Avatar avec animation de son */}
                <div className="relative flex-shrink-0">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#ffa921] to-[#fc5902] flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
                    <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  {/* Ondes sonores animées */}
                  {isPlaying && (
                    <>
                      <div className="absolute inset-0 rounded-full border-4 border-[#ffa921] animate-ping opacity-30"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-[#ffa921] animate-ping opacity-20 animation-delay-200"></div>
                    </>
                  )}
                </div>

                {/* Info et message */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1">Omar Africa</h3>
                  <p className="text-white/70 text-sm mb-2">Message audio • Influenceur & Activiste</p>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    {isPlaying ? '🎵 En lecture...' : '👆 Clique pour écouter mon message !'}
                  </p>
                </div>

                {/* Contrôles audio */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all flex items-center justify-center group"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" />
                    ) : (
                      <div className="w-0 h-0 border-l-[8px] md:border-l-[10px] border-l-white border-y-[6px] md:border-y-[8px] border-y-transparent ml-1"></div>
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all flex items-center justify-center"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Barre de progression visuelle */}
              {isPlaying && (
                <div className="mt-4 flex items-center justify-center gap-1">
                  <div className="audio-wave bg-white/60"></div>
                  <div className="audio-wave bg-white/70"></div>
                  <div className="audio-wave bg-white/80"></div>
                  <div className="audio-wave bg-white/90"></div>
                  <div className="audio-wave bg-white"></div>
                  <div className="audio-wave bg-white/90"></div>
                  <div className="audio-wave bg-white/80"></div>
                  <div className="audio-wave bg-white/70"></div>
                  <div className="audio-wave bg-white/60"></div>
                </div>
              )}
            </div>
          </div>

          {/* Enregistreur Audio - Centré et mis en avant */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#ffa921]/20">
              <div className="bg-gradient-to-r from-[#85c880] to-[#4ec6e0] p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Mic2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg md:text-xl">À ton tour !</h3>
                    <p className="text-white/90 text-sm">Enregistre ton message audio</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <AudioRecorder 
                  onSuccess={handleRecordingSuccess} 
                  onRecordingStart={handleRecordingStart}
                />
              </div>

              {/* Encouragements */}
              <div className="px-6 pb-6 md:px-8 md:pb-8">
                <div className="bg-gradient-to-r from-[#ffa921]/10 to-[#85c880]/10 rounded-xl p-4 border-2 border-dashed border-[#ffa921]/30">
                  <div className="flex items-start gap-3">
                    <Volume2 className="w-5 h-5 text-[#ffa921] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <strong className="text-[#ffa921]">💡 Astuce :</strong> Parle clairement, exprime tes vraies émotions. Pas besoin d'être parfait, sois juste toi-même !
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Séparateur Stylé */}
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gradient-to-r from-transparent via-[#ffa921]/30 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 py-2 text-sm font-semibold text-gray-600 rounded-full shadow-md border-2 border-[#ffa921]/20">
                📢 Découvre les voix de la communauté
              </span>
            </div>
          </div>

          {/* Contributions Validées */}
          <ValidatedContributions key={refreshKey} />
        </div>
      </main>

      {/* Footer Moderne */}
      <footer className="relative mt-20 bg-gradient-to-br from-[#27103E] via-[#4a1e66] to-[#27103E] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-8 h-8" />
              <span className="text-2xl font-bold">Pouvoir Citoyen</span>
            </div>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
              Une initiative Polaris ASSO × Omar Africa pour donner la parole aux jeunes et construire ensemble un Sénégal meilleur.
            </p>
            <div className="pt-6 border-t border-white/20">
              <p className="text-white/60 text-sm">
                © 2024 Polaris ASSO. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

