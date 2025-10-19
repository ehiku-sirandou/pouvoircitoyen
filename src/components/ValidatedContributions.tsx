import { useEffect, useState } from 'react';
import { Volume2, Calendar } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Volume2 className="w-7 h-7 text-[#85c880]" />
        Contributions validées
      </h2>

      <div className="space-y-4">
        {contributions.map((contribution) => (
          <div
            key={contribution.id}
            className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-[#85c880] transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1">
                {contribution.description && (
                  <p className="text-gray-700 mb-3 text-sm md:text-base leading-relaxed">
                    {contribution.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {contribution.validated_at && formatDate(contribution.validated_at)}
                  </span>
                </div>
                <audio
                  controls
                  src={contribution.audio_url}
                  className="w-full max-w-md"
                  preload="metadata"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
