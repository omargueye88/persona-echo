import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Logo } from './ui/Logo';
import { useAuth } from '../hooks/useAuth';
import { Users, Zap, Plus, Search, LogOut, User, Settings, Info, Clock } from 'lucide-react';

interface HomePageProps {
  onCreateGame: (maxPlayers: number, roundDuration: number) => void;
  onJoinGame: (gameId: string) => void;
  onShowAbout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCreateGame, onJoinGame, onShowAbout }) => {
  const { user, signOut } = useAuth();
  const [gameId, setGameId] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [roundDuration, setRoundDuration] = useState(300); // 5 minutes par défaut

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId.trim()) {
      onJoinGame(gameId.trim().toUpperCase());
    }
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateGame(maxPlayers, roundDuration);
    setShowCreateForm(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes}min`;
    return `${minutes}min ${remainingSeconds}s`;
  };

  const durationOptions = [
    { value: 300, label: '5 minutes', description: 'Partie rapide' },
    { value: 600, label: '10 minutes', description: 'Équilibré' },
    { value: 900, label: '15 minutes', description: 'Approfondi' },
    { value: 1200, label: '20 minutes', description: 'Détaillé' },
    { value: 1800, label: '30 minutes', description: 'Complet' },
    { value: 2700, label: '45 minutes', description: 'Intensif' },
    { value: 3600, label: '1 heure', description: 'Marathon' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* User Info */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center space-x-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-neon-purple"
              />
            )}
            <div>
              <p className="text-white font-medium">Bienvenue, {user?.displayName}</p>
              <p className="text-gray-400 text-sm">Prêt pour une nouvelle partie?</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={onShowAbout}
              className="flex items-center space-x-2"
            >
              <Info className="w-4 h-4" />
              <span>À Propos</span>
            </Button>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Logo size="xl" />
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Un jeu social narratif où l'art de la tromperie rencontre la psychologie humaine. 
            Créez une fausse identité, infiltrez-vous, et découvrez qui se cache derrière chaque masque.
          </p>
        </div>

        {/* Game Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Users className="w-8 h-8 text-neon-cyan mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Multijoueur</h3>
            <p className="text-gray-400 text-sm">De 3 à 8 joueurs dans une partie intense de déduction sociale</p>
          </Card>
          
          <Card className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Zap className="w-8 h-8 text-neon-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Temps Réel</h3>
            <p className="text-gray-400 text-sm">Chat en direct et interactions instantanées pour une immersion totale</p>
          </Card>
          
          <Card className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Logo variant="icon-only" size="md" className="mx-auto mb-4" showText={false} />
            <h3 className="text-lg font-semibold text-white mb-2">Déduction</h3>
            <p className="text-gray-400 text-sm">Analysez, déduisez et percez les secrets de vos adversaires</p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              glow 
              onClick={() => setShowCreateForm(true)}
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Créer une Partie</span>
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              className="w-full sm:w-auto min-w-[200px] flex items-center justify-center space-x-2"
              onClick={() => setShowJoinForm(!showJoinForm)}
            >
              <Search className="w-5 h-5" />
              <span>Rejoindre une Partie</span>
            </Button>
          </div>

          {/* Create Game Form */}
          {showCreateForm && (
            <Card className="max-w-2xl mx-auto animate-slide-up">
              <form onSubmit={handleCreateGame} className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Settings className="w-5 h-5 text-neon-purple" />
                  <h3 className="text-xl font-semibold text-white">Configuration de la Partie</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Nombre maximum de joueurs
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 4, 5, 6, 7, 8].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setMaxPlayers(count)}
                        className={`p-3 rounded-lg border transition-all duration-200 ${
                          maxPlayers === count
                            ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border-neon-purple text-white'
                            : 'bg-dark-surface border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Durée par manche
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {durationOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRoundDuration(option.value)}
                        className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                          roundDuration === option.value
                            ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border-neon-purple text-white'
                            : 'bg-dark-surface border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-400">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Choisissez la durée qui convient le mieux à votre groupe
                  </p>
                </div>

                <div className="bg-dark-surface border border-gray-600 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-neon-cyan mb-3">Récapitulatif</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Joueurs maximum:</span>
                        <span className="text-white">{maxPlayers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Joueurs minimum:</span>
                        <span className="text-white">3</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Durée par manche:</span>
                        <span className="text-white">{formatDuration(roundDuration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Durée de vote:</span>
                        <span className="text-white">2 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    glow
                    className="flex-1"
                  >
                    Créer la Partie
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Join Game Form */}
          {showJoinForm && (
            <Card className="max-w-md mx-auto animate-slide-up">
              <form onSubmit={handleJoinGame} className="space-y-4">
                <h3 className="text-lg font-semibold text-white text-center">Rejoindre une Partie</h3>
                <div>
                  <Input
                    placeholder="Code de la partie (ex: ABC123)"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value.toUpperCase())}
                    className="text-center text-lg tracking-wider font-mono"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Entrez le code à 6 caractères fourni par l'hôte de la partie
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowJoinForm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={!gameId.trim() || gameId.trim().length !== 6}
                    className="flex-1"
                  >
                    Rejoindre
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Game Rules Preview */}
        <Card className="mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Comment Jouer</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={onShowAbout}
              className="flex items-center space-x-2"
            >
              <Info className="w-4 h-4" />
              <span>Voir les Règles Complètes</span>
            </Button>
          </div>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center text-white font-bold mx-auto">1</div>
              <p className="text-sm text-gray-300">Créez votre persona fictif</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center text-white font-bold mx-auto">2</div>
              <p className="text-sm text-gray-300">Interagissez avec les autres</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center text-white font-bold mx-auto">3</div>
              <p className="text-sm text-gray-300">Votez pour deviner les identités</p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center text-white font-bold mx-auto">4</div>
              <p className="text-sm text-gray-300">Découvrez qui vous a trompé</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};