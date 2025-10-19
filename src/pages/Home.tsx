import { useState } from 'react';
import { Users, Heart } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';
import ValidatedContributions from '../components/ValidatedContributions';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRecordingSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-gradient-to-r from-[#ffa921] to-[#fc5902] text-white py-6 md:py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Users className="w-8 h-8 md:w-10 md:h-10" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Contributions Citoyennes
            </h1>
          </div>
          <p className="text-center mt-3 text-white/90 text-sm md:text-base">
            Partagez votre voix, contribuez au changement
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          <section className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md mb-4">
              <Heart className="w-5 h-5 text-[#85c880]" />
              <span className="text-gray-700 font-medium">
                Faites entendre votre voix
              </span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Enregistrez un message audio pour partager vos idées, suggestions ou témoignages.
              Chaque contribution validée sera publiée sur cette page.
            </p>
          </section>

          <AudioRecorder onSuccess={handleRecordingSuccess} />

          <div className="border-t-2 border-gray-200 my-8"></div>

          <ValidatedContributions key={refreshKey} />
        </div>
      </main>

      <footer className="bg-[#27103E] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 text-sm">
            Une plateforme pour donner la parole aux citoyens
          </p>
        </div>
      </footer>
    </div>
  );
}
