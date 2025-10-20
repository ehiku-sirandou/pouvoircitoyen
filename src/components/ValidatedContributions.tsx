import { useEffect, useState } from 'react';
import { Volume2, Calendar, User } from 'lucide-react';
import { supabase, AudioContribution } from '../lib/supabase';

export default function ValidatedContributions() {
  const [contributions, setContributions] = useState<AudioContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContributions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('audio_contributions')
        .select('*')
        .eq('status', 'validated')
        .order('validated_at', { ascending: false });

      if (error) throw error;
      setContributions(data || []);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();

    const channel = supabase
      .channel('validated-contributions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audio_contributions',
          filter: 'status=eq.validated',
        },
        () => {
          fetchContributions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#85c880]"></div>
        </div>
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <p className="text-gray-500 text-center py-8">
          Aucune contribution validée pour le moment.
        </p>
      </div>
    );
  }

  const getAvatarComponent = (gender: string | null) => {
    if (gender === 'homme') {
      return (
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
        </div>
      );
    } else if (gender === 'femme') {
      return (
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
        <User className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Volume2 className="w-7 h-7 text-[#85c880]" />
        Contributions validées
      </h2>

      <div className="space-y-6">
        {contributions.map((contribution) => (
          <div
            key={contribution.id}
            className="border-2 border-gray-200 rounded-2xl p-4 md:p-6 hover:border-[#85c880] hover:shadow-lg transition-all"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Avatar */}
              {getAvatarComponent(contribution.gender)}

              {/* Contenu */}
              <div className="flex-1 space-y-3">
                {/* Nom si disponible */}
                {contribution.full_name && (
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">
                      {contribution.full_name}
                    </h3>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {contribution.validated_at && formatDate(contribution.validated_at)}
                  </span>
                </div>

                {/* Audio */}
                <audio
                  controls
                  src={contribution.audio_url}
                  className="w-full max-w-md"
                  preload="metadata"
                />

                {/* Tags des sujets */}
                {contribution.topics && contribution.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {contribution.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r from-[#85c880] to-[#4ec6e0] text-white shadow-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
