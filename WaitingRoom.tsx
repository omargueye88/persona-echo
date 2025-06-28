import React from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { GameState } from '../types';
import { Users, Clock, CheckCircle, XCircle, Copy, Share2, Crown, Wifi, WifiOff } from 'lucide-react';

interface WaitingRoomProps {
  gameState: GameState;
  onStartGame: () => void;
  onBack: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({ gameState, onStartGame, onBack }) => {
  const readyPlayers = gameState.players.filter(p => p.isReady);
  const canStart = readyPlayers.length >= (gameState.gameSettings?.minPlayers || 3);
  const maxPlayers = gameState.gameSettings?.maxPlayers || 8;

  const copyGameId = () => {
    if (gameState.gameId) {
      navigator.clipboard.writeText(gameState.gameId);
      // You could add a toast notification here
    }
  };

  const shareGame = () => {
    if (gameState.gameId && navigator.share) {
      navigator.share({
        title: 'Rejoignez ma partie Persona Echo',
        text: `Code de la partie: ${gameState.gameId}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-4">
            Salle d'Attente
          </h1>
          <p className="text-gray-300 mb-4">
            En attente des autres joueurs... La partie commencera dès que tout le monde sera prêt.
          </p>
          
          {/* Game ID Display */}
          <Card className="max-w-md mx-auto">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Code de la partie</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl font-mono font-bold text-neon-cyan tracking-wider bg-dark-surface px-4 py-2 rounded-lg border border-neon-cyan/30">
                  {gameState.gameId}
                </span>
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={copyGameId}
                    className="p-2"
                    title="Copier le code"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {navigator.share && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={shareGame}
                      className="p-2"
                      title="Partager"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Partagez ce code avec vos amis pour qu'ils rejoignent la partie
              </p>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Players List */}
          <div className="lg:col-span-2">
            <Card glow className="animate-slide-up">
              <div className="flex items-center space-x-2 mb-6">
                <Users className="w-5 h-5 text-neon-purple" />
                <h3 className="text-xl font-semibold text-white">
                  Joueurs ({gameState.players.length}/{maxPlayers})
                </h3>
              </div>

              {gameState.players.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Chargement des joueurs...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gameState.players.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 bg-dark-surface rounded-lg border border-gray-600 animate-slide-up transition-all duration-200 ${
                        player.id === gameState.currentPlayer.id
                          ? 'ring-2 ring-neon-purple/50 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10'
                          : 'hover:border-gray-500'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {player.avatar ? (
                            <img
                              src={player.avatar}
                              alt={player.username}
                              className="w-10 h-10 rounded-full border-2 border-neon-purple"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full flex items-center justify-center text-white font-bold">
                              {player.persona?.name?.[0] || player.username[0]}
                            </div>
                          )}
                          {gameState.isHost && index === 0 && (
                            <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium flex items-center space-x-2">
                            <span>{player.persona?.name || player.username}</span>
                            {player.id === gameState.currentPlayer.id && (
                              <span className="text-xs text-neon-cyan bg-neon-cyan/20 px-2 py-1 rounded-full">
                                Vous
                              </span>
                            )}
                            {gameState.isHost && index === 0 && (
                              <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full">
                                Hôte
                              </span>
                            )}
                          </p>
                          {player.persona && (
                            <p className="text-sm text-gray-400">
                              {player.persona.profession}, {player.persona.age}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Connection Status */}
                        <div className="flex items-center space-x-1">
                          {player.isConnected ? (
                            <Wifi className="w-4 h-4 text-green-400" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        
                        {/* Ready Status */}
                        <div className="flex items-center space-x-2">
                          {player.isReady ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-500" />
                          )}
                          <span className={`text-sm font-medium ${player.isReady ? 'text-green-400' : 'text-gray-500'}`}>
                            {player.isReady ? 'Prêt' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: maxPlayers - gameState.players.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="flex items-center p-4 bg-dark-surface/50 rounded-lg border border-gray-700 border-dashed opacity-60"
                    >
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-500">En attente d'un joueur...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-neon-cyan" />
                <h3 className="text-lg font-semibold text-white">Statut de la Partie</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Joueurs connectés:</span>
                  <span className="text-white">{gameState.players.filter(p => p.isConnected).length}/{gameState.players.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Joueurs prêts:</span>
                  <span className="text-white">{readyPlayers.length}/{gameState.players.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum requis:</span>
                  <span className="text-white">{gameState.gameSettings?.minPlayers || 3}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Maximum autorisé:</span>
                  <span className="text-white">{maxPlayers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Manche:</span>
                  <span className="text-white">#{gameState.round}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="w-full bg-dark-surface rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(readyPlayers.length / Math.max(gameState.players.length, gameState.gameSettings?.minPlayers || 3)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  {canStart ? 'Prêt à commencer!' : `${(gameState.gameSettings?.minPlayers || 3) - readyPlayers.length} joueur(s) manquant(s)`}
                </p>
              </div>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold text-white mb-4">Votre Persona</h3>
              {gameState.currentPlayer.persona ? (
                <div className="space-y-2">
                  <p className="text-neon-cyan font-medium">{gameState.currentPlayer.persona.name}</p>
                  <p className="text-sm text-gray-400">{gameState.currentPlayer.persona.profession}</p>
                  <p className="text-sm text-gray-400">{gameState.currentPlayer.persona.age}</p>
                  <p className="text-xs text-gray-500 mt-2">{gameState.currentPlayer.persona.traits}</p>
                  {gameState.currentPlayer.persona.hobbies && gameState.currentPlayer.persona.hobbies.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1">Loisirs:</p>
                      <div className="flex flex-wrap gap-1">
                        {gameState.currentPlayer.persona.hobbies.map((hobby, index) => (
                          <span key={index} className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-1 rounded">
                            {hobby}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 mb-2">Aucun persona créé</p>
                  <p className="text-xs text-gray-500">Vous devez créer un persona pour être prêt</p>
                </div>
              )}
            </Card>

            <div className="space-y-3">
              {gameState.isHost && canStart && gameState.players.length >= (gameState.gameSettings?.minPlayers || 3) && (
                <Button
                  glow
                  size="lg"
                  onClick={onStartGame}
                  className="w-full animate-slide-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  Commencer la Partie
                </Button>
              )}
              
              {gameState.isHost && (!canStart || gameState.players.length < (gameState.gameSettings?.minPlayers || 3)) && (
                <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    {gameState.players.length < (gameState.gameSettings?.minPlayers || 3) 
                      ? `Il faut au moins ${gameState.gameSettings?.minPlayers || 3} joueurs pour commencer`
                      : 'Tous les joueurs doivent être prêts pour commencer'
                    }
                  </p>
                </div>
              )}
              
              <Button
                variant="secondary"
                onClick={onBack}
                className="w-full"
              >
                Quitter la Partie
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};