import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Persona, ChatMessage, Vote } from '../types';
import { firebaseService } from '../services/firebaseService';
import { useAuth } from './useAuth';
import { v4 as uuidv4 } from 'uuid';

export const useGameState = () => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    phase: 'home',
    players: [],
    currentPlayer: {
      id: '',
      username: '',
      score: 0,
      isReady: false,
    },
    messages: [],
    votes: [],
    timeRemaining: 300,
    round: 1,
  });

  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actualGameId, setActualGameId] = useState<string | null>(null); // Store the actual Firebase document ID

  // Initialize current player when user is authenticated
  useEffect(() => {
    if (user) {
      setGameState(prev => ({
        ...prev,
        currentPlayer: {
          id: user.uid,
          username: user.displayName || 'Joueur',
          score: 0,
          isReady: false,
          avatar: user.photoURL || undefined,
        }
      }));
    }
  }, [user]);

  const setPhase = useCallback((phase: GameState['phase']) => {
    setGameState(prev => ({ ...prev, phase }));
    setError(null);
  }, []);

  const createGame = useCallback(async (maxPlayers: number = 6, roundDuration: number = 300) => {
    if (!user) {
      setError('Vous devez être connecté pour créer une partie');
      return;
    }

    try {
      setError(null);
      const gameCode = await firebaseService.createGame(user.uid, user.displayName || 'Hôte', maxPlayers, roundDuration);
      
      // Get the actual game data to retrieve the document ID
      const gameData = await firebaseService.getGame(gameCode);
      if (gameData) {
        setActualGameId(gameData.id);
        
        // Set up real-time listeners immediately after creating the game
        setupRealtimeListeners(gameData.id);
      }
      
      setGameState(prev => ({
        ...prev,
        gameId: gameCode, // Store the game code for display
        isHost: true,
        phase: 'create-persona',
        gameSettings: {
          roundDuration: roundDuration,
          votingDuration: 120,
          minPlayers: 3,
          maxRounds: 5,
          maxPlayers
        }
      }));

      return gameCode;
    } catch (error: any) {
      console.error('Failed to create game:', error);
      setError('Erreur lors de la création de la partie');
    }
  }, [user]);

  const joinGame = useCallback(async (gameCode: string) => {
    if (!user) {
      setError('Vous devez être connecté pour rejoindre une partie');
      return;
    }

    try {
      setError(null);
      const game = await firebaseService.getGame(gameCode);
      
      if (!game) {
        setError('Partie non trouvée. Vérifiez le code de la partie.');
        return;
      }

      if (game.currentPlayers >= game.maxPlayers) {
        setError('La partie est complète');
        return;
      }

      if (!game.isActive) {
        setError('Cette partie n\'est plus active');
        return;
      }

      // Check if player is already in the game
      const existingPlayers = await firebaseService.getGamePlayers(game.id);
      const isAlreadyInGame = existingPlayers.some(p => p.playerId === user.uid);

      if (!isAlreadyInGame) {
        await firebaseService.addPlayerToGame(game.id, user.uid, user.displayName || 'Joueur');
      }

      setActualGameId(game.id);
      
      // Set up real-time listeners immediately after joining
      setupRealtimeListeners(game.id);
      
      setGameState(prev => ({
        ...prev,
        gameId: gameCode, // Store the game code for display
        isHost: false,
        phase: 'create-persona',
        gameSettings: {
          roundDuration: game.settings.roundDuration,
          votingDuration: game.settings.votingDuration,
          minPlayers: game.settings.minPlayers,
          maxRounds: game.settings.maxRounds,
          maxPlayers: game.maxPlayers
        }
      }));

    } catch (error: any) {
      console.error('Failed to join game:', error);
      setError('Erreur lors de la connexion à la partie');
    }
  }, [user]);

  const createPersona = useCallback(async (persona: Persona) => {
    if (!actualGameId || !user) return;

    try {
      setError(null);
      
      await firebaseService.updatePlayerPersona(actualGameId, user.uid, persona);
      
      setGameState(prev => ({
        ...prev,
        currentPlayer: { ...prev.currentPlayer, persona, isReady: true },
        phase: 'waiting',
      }));

      // Send system message
      await firebaseService.sendSystemMessage(
        actualGameId,
        `${persona.name} a rejoint la partie!`
      );

    } catch (error: any) {
      console.error('Failed to create persona:', error);
      setError('Erreur lors de la création du persona');
    }
  }, [actualGameId, user]);

  const sendMessage = useCallback(async (message: string) => {
    if (!actualGameId || !user || !gameState.currentPlayer.persona) return;

    try {
      await firebaseService.sendMessage(
        actualGameId,
        user.uid,
        gameState.currentPlayer.persona.name,
        message
      );
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setError('Erreur lors de l\'envoi du message');
    }
  }, [actualGameId, user, gameState.currentPlayer.persona]);

  const submitVote = useCallback(async (targetId: string, guess: string) => {
    if (!actualGameId || !user) return;

    try {
      setError(null);
      
      await firebaseService.submitVote(actualGameId, user.uid, targetId, guess);
      
      const vote: Vote = {
        voterId: user.uid,
        targetId,
        guess,
      };

      setGameState(prev => ({
        ...prev,
        votes: [...prev.votes, vote],
        phase: 'reveal',
      }));

    } catch (error: any) {
      console.error('Failed to submit vote:', error);
      setError('Erreur lors de l\'envoi du vote');
    }
  }, [actualGameId, user]);

  const startGame = useCallback(async () => {
    if (!actualGameId || !gameState.isHost) return;

    try {
      const roundDuration = gameState.gameSettings?.roundDuration || 300;
      await firebaseService.updateGamePhase(actualGameId, 'playing', {
        timeRemaining: roundDuration
      });
      
      await firebaseService.sendSystemMessage(
        actualGameId,
        'La partie commence! Interagissez avec les autres joueurs pour découvrir leurs vraies identités.'
      );

    } catch (error: any) {
      console.error('Failed to start game:', error);
      setError('Erreur lors du démarrage de la partie');
    }
  }, [actualGameId, gameState.isHost, gameState.gameSettings]);

  const startVoting = useCallback(async () => {
    if (!actualGameId || !gameState.isHost) return;

    try {
      await firebaseService.updateGamePhase(actualGameId, 'voting', {
        timeRemaining: 120
      });
      
      await firebaseService.sendSystemMessage(
        actualGameId,
        'Phase de vote! Choisissez qui vous pensez avoir démasqué.'
      );

    } catch (error: any) {
      console.error('Failed to start voting:', error);
      setError('Erreur lors du démarrage du vote');
    }
  }, [actualGameId, gameState.isHost]);

  // Setup real-time listeners function
  const setupRealtimeListeners = useCallback((gameId: string) => {
    console.log('Setting up real-time listeners for game:', gameId);

    const unsubscribeGame = firebaseService.onGameUpdate(gameId, (game) => {
      console.log('Game update received:', game);
      setGameState(prev => ({
        ...prev,
        phase: game.phase === 'waiting' ? prev.phase : game.phase,
        timeRemaining: game.timeRemaining,
        round: game.round,
        gameSettings: {
          ...prev.gameSettings,
          maxPlayers: game.maxPlayers,
          roundDuration: game.settings.roundDuration,
          votingDuration: game.settings.votingDuration,
          minPlayers: game.settings.minPlayers,
          maxRounds: game.settings.maxRounds
        }
      }));
    });

    const unsubscribePlayers = firebaseService.onPlayersUpdate(gameId, (players) => {
      console.log('Players update received:', players);
      const mappedPlayers: Player[] = players.map(p => ({
        id: p.playerId,
        username: p.playerName,
        persona: p.persona || undefined,
        score: p.score,
        isReady: p.isReady,
        isConnected: p.isConnected,
      }));

      setGameState(prev => {
        // Update current player if found in the players list
        const currentPlayerData = mappedPlayers.find(p => p.id === prev.currentPlayer.id);
        const updatedCurrentPlayer = currentPlayerData 
          ? { ...prev.currentPlayer, ...currentPlayerData }
          : prev.currentPlayer;

        return {
          ...prev,
          players: mappedPlayers,
          currentPlayer: updatedCurrentPlayer
        };
      });
    });

    const unsubscribeMessages = firebaseService.onMessagesUpdate(gameId, (messages) => {
      console.log('Messages update received:', messages.length, 'messages');
      const mappedMessages: ChatMessage[] = messages.map(m => ({
        id: m.id,
        playerId: m.playerId,
        playerName: m.playerName,
        message: m.message,
        timestamp: m.timestamp instanceof Date ? m.timestamp : new Date(),
        isSystemMessage: m.isSystemMessage,
      }));

      setGameState(prev => ({
        ...prev,
        messages: mappedMessages,
      }));
    });

    // Store unsubscribe functions for cleanup
    return () => {
      console.log('Cleaning up real-time listeners');
      unsubscribeGame();
      unsubscribePlayers();
      unsubscribeMessages();
    };
  }, []);

  // Real-time listeners effect
  useEffect(() => {
    if (!actualGameId) return;

    const cleanup = setupRealtimeListeners(actualGameId);
    return cleanup;
  }, [actualGameId, setupRealtimeListeners]);

  // Timer countdown
  useEffect(() => {
    if ((gameState.phase === 'playing' || gameState.phase === 'voting') && gameState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));

        // Update Firebase timer every 10 seconds
        if (gameState.timeRemaining % 10 === 0 && actualGameId && gameState.isHost) {
          firebaseService.updateGameTimer(actualGameId, gameState.timeRemaining - 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else if (gameState.phase === 'playing' && gameState.timeRemaining === 0 && gameState.isHost) {
      startVoting();
    } else if (gameState.phase === 'voting' && gameState.timeRemaining === 0 && gameState.isHost) {
      firebaseService.updateGamePhase(actualGameId!, 'reveal');
    }
  }, [gameState.phase, gameState.timeRemaining, actualGameId, gameState.isHost, startVoting]);

  // Update player connection status
  useEffect(() => {
    if (actualGameId && user) {
      // Mark player as connected when component mounts
      firebaseService.updatePlayerConnection(actualGameId, user.uid, true);

      // Mark player as disconnected when component unmounts
      return () => {
        firebaseService.updatePlayerConnection(actualGameId, user.uid, false);
      };
    }
  }, [actualGameId, user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const leaveGame = useCallback(async () => {
    if (!actualGameId || !user) return;

    try {
      await firebaseService.removePlayerFromGame(actualGameId, user.uid);
      setGameState(prev => ({
        ...prev,
        gameId: undefined,
        phase: 'home',
        players: [],
        messages: [],
        votes: [],
        isHost: false,
      }));
      setActualGameId(null);
    } catch (error: any) {
      console.error('Failed to leave game:', error);
      setError('Erreur lors de la sortie de la partie');
    }
  }, [actualGameId, user]);

  return {
    gameState,
    isConnected,
    error,
    setPhase,
    createGame,
    joinGame,
    createPersona,
    sendMessage,
    submitVote,
    startGame,
    startVoting,
    leaveGame,
    clearError,
  };
};