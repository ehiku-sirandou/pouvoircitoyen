import { useState } from 'react';
import { Users, Mic2, TrendingUp, Play, Volume2 } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';
import ValidatedContributions from '../components/ValidatedContributions';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const handleRecordingSuccess = () => {
    setRefreshKey(prev => prev + 1);
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
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          
          {/* Section Vidéo + Enregistreur côte à côte */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            
            {/* Vidéo Omar Africa */}
            <div className="bg-gradient-to-br from-[#27103E] to-[#4a1e66] rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffa921] to-[#fc5902] flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Omar Africa</h3>
                    <p className="text-white/70 text-sm">Influenceur & Activiste</p>
                  </div>
                </div>
                
                <div className="relative aspect-video bg-black/20 rounded-xl overflow-hidden group cursor-pointer mb-4"
                     onClick={() => setShowVideo(!showVideo)}>
                  {!showVideo ? (
                    <>
                      <img 
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=450&fit=crop" 
                        alt="Omar Africa"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                        <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                          <Play className="w-8 h-8 text-[#ffa921] ml-1" fill="currentColor" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-semibold text-sm md:text-base">
                          Pourquoi ta voix est importante 🔥
                        </p>
                      </div>
                    </>
                  ) : (
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Omar Africa"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                <p className="text-white/80 text-sm leading-relaxed">
                  "Chaque jeune a le pouvoir de changer les choses. Ta voix, tes idées, ton témoignage peuvent faire la différence. N'attends pas, exprime-toi maintenant !" 💪
                </p>
              </div>
            </div>

            {/* Enregistreur Audio Amélioré */}
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
                <AudioRecorder onSuccess={handleRecordingSuccess} />
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
