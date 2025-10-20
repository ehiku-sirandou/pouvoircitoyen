import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, AudioContribution } from '../lib/supabase';
import { LogOut, Check, X, Clock, Loader2, AlertCircle, Trash2, User, Phone } from 'lucide-react';
import { useNavigate } from './router';

// Liste des sujets disponibles
const AVAILABLE_TOPICS = [
  'Éducation',
  'Santé',
  'Emploi',
  'Infrastructure',
  'Sécurité',
  'Justice',
  'Économie',
  'Environnement',
  'Agriculture',
  'Jeunesse',
  'Transport',
  'Logement',
  'Culture',
  'Sport',
  'Gouvernance',
  'Corruption',
  'Droits humains',
  'Femmes',
  'Électricité',
  'Eau',
  'Autre'
];

export default function Backoffice() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState<AudioContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [genders, setGenders] = useState<{ [key: string]: string }>({});
  const [topics, setTopics] = useState<{ [key: string]: string[] }>({});

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
    const gender = genders[id];
    const selectedTopics = topics[id] || [];

    if (!gender) {
      alert('Veuillez sélectionner le sexe avant de valider');
      return;
    }

    if (selectedTopics.length === 0) {
      alert('Veuillez sélectionner au moins un sujet avant de valider');
      return;
    }

    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('audio_contributions')
        .update({
          status: 'validated',
          gender: gender,
          topics: selectedTopics,
          validated_at: new Date().toISOString(),
          validated_by: user?.email || 'admin',
        })
        .eq('id', id);

      if (error) throw error;
      await fetchContributions();
      setGenders(prev => {
        const newGenders = { ...prev };
        delete newGenders[id];
        return newGenders;
      });
      setTopics(prev => {
        const newTopics = { ...prev };
        delete newTopics[id];
        return newTopics;
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

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette contribution ? Cette action est irréversible.')) {
      return;
    }

    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('audio_contributions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchContributions();
    } catch (error) {
      console.error('Error deleting contribution:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setProcessingId(null);
    }
  };

  const toggleTopic = (contributionId: string, topic: string) => {
    setTopics(prev => {
      const currentTopics = prev[contributionId] || [];
      const isSelected = currentTopics.includes(topic);
      
      if (isSelected) {
        // Retirer le sujet
        return {
          ...prev,
          [contributionId]: currentTopics.filter(t => t !== topic)
        };
      } else {
        // Ajouter le sujet
        return {
          ...prev,
          [contributionId]: [...currentTopics, topic]
        };
      }
    });
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

                    {/* Informations utilisateur si disponibles */}
                    {(contribution.full_name || contribution.phone_number) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-800 mb-2">Informations de l'utilisateur</p>
                        <div className="space-y-1">
                          {contribution.full_name && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-700">{contribution.full_name}</span>
                            </div>
                          )}
                          {contribution.phone_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-700">{contribution.phone_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {contribution.status === 'pending' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sexe <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={genders[contribution.id] || ''}
                              onChange={(e) => setGenders(prev => ({
                                ...prev,
                                [contribution.id]: e.target.value
                              }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#85c880] focus:border-transparent outline-none transition"
                            >
                              <option value="">Sélectionnez...</option>
                              <option value="homme">Homme</option>
                              <option value="femme">Femme</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sujets (sélectionnez un ou plusieurs) <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                              <div className="flex flex-wrap gap-2">
                                {AVAILABLE_TOPICS.map((topic) => {
                                  const isSelected = (topics[contribution.id] || []).includes(topic);
                                  return (
                                    <button
                                      key={topic}
                                      type="button"
                                      onClick={() => toggleTopic(contribution.id, topic)}
                                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                        isSelected
                                          ? 'bg-[#85c880] text-white shadow-md'
                                          : 'bg-white text-gray-700 border border-gray-300 hover:border-[#85c880]'
                                      }`}
                                    >
                                      {topic}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            {topics[contribution.id] && topics[contribution.id].length > 0 && (
                              <p className="text-xs text-gray-600 mt-2">
                                {topics[contribution.id].length} sujet(s) sélectionné(s)
                              </p>
                            )}
                          </div>
                        </div>

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
                        {/* Métadonnées validées */}
                        {contribution.status === 'validated' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {contribution.gender && (
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <p className="text-xs font-semibold text-purple-800 mb-1">Sexe</p>
                                <p className="text-sm text-gray-700 capitalize">{contribution.gender.replace('_', ' ')}</p>
                              </div>
                            )}
                            
                            {contribution.topics && contribution.topics.length > 0 && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-xs font-semibold text-green-800 mb-1">Sujets</p>
                                <div className="flex flex-wrap gap-1">
                                  {contribution.topics.map((topic, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {contribution.validated_by && (
                            <p className="text-xs text-gray-500">
                              Traitée par: {contribution.validated_by}
                            </p>
                          )}
                          
                          {/* Bouton de suppression pour les contributions validées */}
                          {contribution.status === 'validated' && (
                            <button
                              onClick={() => handleDelete(contribution.id)}
                              disabled={processingId === contribution.id}
                              className="flex items-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          )}
                        </div>
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
