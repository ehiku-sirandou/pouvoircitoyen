import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, AudioContribution } from '../lib/supabase';
import { LogOut, Check, X, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from './router';

export default function Backoffice() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState<AudioContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [descriptions, setDescriptions] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchContributions();
  }, [user, navigate]);

  const fetchContributions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('audio_contributions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContributions(data || []);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = async (id: string) => {
    const description = descriptions[id]?.trim();
    if (!description) {
      alert('Veuillez ajouter une description avant de valider');
      return;
    }

    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('audio_contributions')
        .update({
          status: 'validated',
          description: description,
          validated_at: new Date().toISOString(),
          validated_by: user?.email || 'admin',
        })
        .eq('id', id);

      if (error) throw error;
      await fetchContributions();
      setDescriptions(prev => {
        const newDescriptions = { ...prev };
        delete newDescriptions[id];
        return newDescriptions;
      });
    } catch (error) {
      console.error('Error validating contribution:', error);
      alert('Erreur lors de la validation');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cette contribution ?')) {
      return;
    }

    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('audio_contributions')
        .update({
          status: 'rejected',
          validated_by: user?.email || 'admin',
        })
        .eq('id', id);

      if (error) throw error;
      await fetchContributions();
    } catch (error) {
      console.error('Error rejecting contribution:', error);
      alert('Erreur lors du rejet');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      validated: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
      pending: 'En attente',
      validated: 'Validée',
      rejected: 'Rejetée',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const pendingCount = contributions.filter(c => c.status === 'pending').length;
  const validatedCount = contributions.filter(c => c.status === 'validated').length;
  const rejectedCount = contributions.filter(c => c.status === 'rejected').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#85c880]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Backoffice</h1>
              <p className="text-sm text-gray-600 mt-1">Gestion des contributions audio</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-3xl font-bold text-gray-800">{pendingCount}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Validées</p>
                <p className="text-3xl font-bold text-gray-800">{validatedCount}</p>
              </div>
              <Check className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejetées</p>
                <p className="text-3xl font-bold text-gray-800">{rejectedCount}</p>
              </div>
              <X className="w-10 h-10 text-red-400" />
            </div>
          </div>
        </div>

        {contributions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune contribution pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      {getStatusBadge(contribution.status)}
                      <span className="text-sm text-gray-500">
                        {formatDate(contribution.created_at)}
                      </span>
                    </div>

                    <audio
                      controls
                      src={contribution.audio_url}
                      className="w-full max-w-md"
                      preload="metadata"
                    />

                    {contribution.status === 'pending' ? (
                      <div className="space-y-3">
                        <textarea
                          value={descriptions[contribution.id] || ''}
                          onChange={(e) => setDescriptions(prev => ({
                            ...prev,
                            [contribution.id]: e.target.value
                          }))}
                          placeholder="Ajoutez une description de l'audio..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#85c880] focus:border-transparent outline-none transition resize-none"
                          rows={3}
                        />

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleValidate(contribution.id)}
                            disabled={processingId === contribution.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            {processingId === contribution.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-5 h-5" />
                                Valider
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleReject(contribution.id)}
                            disabled={processingId === contribution.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            <X className="w-5 h-5" />
                            Rejeter
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {contribution.description && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                            <p className="text-gray-600">{contribution.description}</p>
                          </div>
                        )}
                        {contribution.validated_by && (
                          <p className="text-xs text-gray-500">
                            Traitée par: {contribution.validated_by}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
