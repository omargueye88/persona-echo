import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GameData, PlayerData, PersonaData, MessageData, VoteData, GameStats } from '../types/firebase';

export class FirebaseService {
  // Collections references
  private gamesCollection = collection(db, 'games');
  private playersCollection = collection(db, 'players');
  private messagesCollection = collection(db, 'messages');
  private votesCollection = collection(db, 'votes');
  private statsCollection = collection(db, 'gameStats');

  // Generate a short, user-friendly game code
  private generateGameCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Check if game code already exists
  private async isGameCodeUnique(gameCode: string): Promise<boolean> {
    const q = query(this.gamesCollection, where('gameCode', '==', gameCode));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }

  // Generate unique game code
  private async generateUniqueGameCode(): Promise<string> {
    let gameCode: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      gameCode = this.generateGameCode();
      isUnique = await this.isGameCodeUnique(gameCode);
      attempts++;
    } while (!isUnique && attempts < maxAttempts);

    if (!isUnique) {
      throw new Error('Unable to generate unique game code');
    }

    return gameCode;
  }

  // Game Management
  async createGame(hostId: string, hostName: string, maxPlayers: number = 6, roundDuration: number = 300): Promise<string> {
    const gameCode = await this.generateUniqueGameCode();
    
    const gameData: Omit<GameData, 'id'> = {
      gameCode,
      hostId,
      hostName,
      phase: 'waiting',
      round: 1,
      maxPlayers,
      currentPlayers: 0, // Will be incremented when host is added
      timeRemaining: roundDuration,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      settings: {
        roundDuration: roundDuration,
        votingDuration: 120,
        minPlayers: 3,
        maxRounds: 5
      }
    };

    const docRef = await addDoc(this.gamesCollection, gameData);
    
    // Add host as first player
    await this.addPlayerToGame(docRef.id, hostId, hostName);
    
    return gameCode; // Return the game code instead of document ID
  }

  async getGame(gameCode: string): Promise<GameData | null> {
    // First try to get by game code
    const q = query(this.gamesCollection, where('gameCode', '==', gameCode.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as GameData;
    }
    
    // Fallback: try to get by document ID for backward compatibility
    try {
      const docRef = doc(this.gamesCollection, gameCode);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as GameData;
      }
    } catch (error) {
      // Document ID doesn't exist, which is fine
    }
    
    return null;
  }

  async getGameById(gameId: string): Promise<GameData | null> {
    const docRef = doc(this.gamesCollection, gameId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as GameData;
    }
    return null;
  }

  async updateGamePhase(gameId: string, phase: GameData['phase'], additionalData?: Partial<GameData>): Promise<void> {
    const docRef = doc(this.gamesCollection, gameId);
    await updateDoc(docRef, {
      phase,
      updatedAt: serverTimestamp(),
      ...additionalData
    });
  }

  async updateGameTimer(gameId: string, timeRemaining: number): Promise<void> {
    const docRef = doc(this.gamesCollection, gameId);
    await updateDoc(docRef, {
      timeRemaining,
      updatedAt: serverTimestamp()
    });
  }

  // Player Management
  async addPlayerToGame(gameId: string, playerId: string, playerName: string): Promise<void> {
    // Check if player already exists in this game
    const existingPlayerQuery = query(
      this.playersCollection,
      where('gameId', '==', gameId),
      where('playerId', '==', playerId)
    );
    
    const existingPlayerSnapshot = await getDocs(existingPlayerQuery);
    
    if (!existingPlayerSnapshot.empty) {
      // Player already exists, just update their connection status
      const playerDoc = existingPlayerSnapshot.docs[0];
      await updateDoc(playerDoc.ref, {
        isConnected: true,
        lastSeen: serverTimestamp()
      });
      return;
    }

    const playerData: Omit<PlayerData, 'id'> = {
      gameId,
      playerId,
      playerName,
      isReady: false,
      isConnected: true,
      score: 0,
      persona: null,
      joinedAt: serverTimestamp(),
      lastSeen: serverTimestamp()
    };

    await addDoc(this.playersCollection, playerData);
    
    // Update game player count
    const gameRef = doc(this.gamesCollection, gameId);
    await updateDoc(gameRef, {
      currentPlayers: increment(1),
      updatedAt: serverTimestamp()
    });
  }

  async updatePlayerPersona(gameId: string, playerId: string, persona: PersonaData): Promise<void> {
    const q = query(
      this.playersCollection,
      where('gameId', '==', gameId),
      where('playerId', '==', playerId)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const playerDoc = querySnapshot.docs[0];
      await updateDoc(playerDoc.ref, {
        persona,
        isReady: true,
        updatedAt: serverTimestamp()
      });
    }
  }

  async updatePlayerConnection(gameId: string, playerId: string, isConnected: boolean): Promise<void> {
    const q = query(
      this.playersCollection,
      where('gameId', '==', gameId),
      where('playerId', '==', playerId)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const playerDoc = querySnapshot.docs[0];
      await updateDoc(playerDoc.ref, {
        isConnected,
        lastSeen: serverTimestamp()
      });
    }
  }

  async getGamePlayers(gameId: string): Promise<PlayerData[]> {
    const q = query(
      this.playersCollection,
      where('gameId', '==', gameId)
    );
    
    const querySnapshot = await getDocs(q);
    const players = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PlayerData[];

    // Sort players client-side by joinedAt timestamp
    return players.sort((a, b) => {
      const aTime = a.joinedAt && typeof a.joinedAt === 'object' && 'seconds' in a.joinedAt 
        ? a.joinedAt.seconds 
        : 0;
      const bTime = b.joinedAt && typeof b.joinedAt === 'object' && 'seconds' in b.joinedAt 
        ? b.joinedAt.seconds 
        : 0;
      return aTime - bTime;
    });
  }

  // Message Management
  async sendMessage(gameId: string, playerId: string, playerName: string, message: string): Promise<void> {
    const messageData: Omit<MessageData, 'id'> = {
      gameId,
      playerId,
      playerName,
      message,
      timestamp: serverTimestamp(),
      isSystemMessage: false
    };

    await addDoc(this.messagesCollection, messageData);
  }

  async sendSystemMessage(gameId: string, message: string): Promise<void> {
    const messageData: Omit<MessageData, 'id'> = {
      gameId,
      playerId: 'system',
      playerName: 'Système',
      message,
      timestamp: serverTimestamp(),
      isSystemMessage: true
    };

    await addDoc(this.messagesCollection, messageData);
  }

  async getGameMessages(gameId: string, limitCount: number = 50): Promise<MessageData[]> {
    const q = query(
      this.messagesCollection,
      where('gameId', '==', gameId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .reverse() as MessageData[];
  }

  // Vote Management
  async submitVote(gameId: string, voterId: string, targetId: string, guess: string): Promise<void> {
    const voteData: Omit<VoteData, 'id'> = {
      gameId,
      voterId,
      targetId,
      guess,
      round: 1, // This should be dynamic based on current round
      timestamp: serverTimestamp()
    };

    await addDoc(this.votesCollection, voteData);
  }

  async getGameVotes(gameId: string, round?: number): Promise<VoteData[]> {
    let q = query(
      this.votesCollection,
      where('gameId', '==', gameId)
    );

    if (round !== undefined) {
      q = query(q, where('round', '==', round));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VoteData[];
  }

  // Real-time listeners
  onGameUpdate(gameId: string, callback: (game: GameData) => void): () => void {
    const docRef = doc(this.gamesCollection, gameId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as GameData);
      }
    }, (error) => {
      console.error('Error in game listener:', error);
    });
  }

  onPlayersUpdate(gameId: string, callback: (players: PlayerData[]) => void): () => void {
    // Removed orderBy to avoid composite index requirement
    // Sorting will be done client-side instead
    const q = query(
      this.playersCollection,
      where('gameId', '==', gameId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const players = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PlayerData[];
      
      // Sort players client-side by joinedAt timestamp
      const sortedPlayers = players.sort((a, b) => {
        const aTime = a.joinedAt && typeof a.joinedAt === 'object' && 'seconds' in a.joinedAt 
          ? a.joinedAt.seconds 
          : 0;
        const bTime = b.joinedAt && typeof b.joinedAt === 'object' && 'seconds' in b.joinedAt 
          ? b.joinedAt.seconds 
          : 0;
        return aTime - bTime;
      });
      
      callback(sortedPlayers);
    }, (error) => {
      console.error('Error in players listener:', error);
    });
  }

  onMessagesUpdate(gameId: string, callback: (messages: MessageData[]) => void): () => void {
    const q = query(
      this.messagesCollection,
      where('gameId', '==', gameId),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MessageData[];
      callback(messages);
    }, (error) => {
      console.error('Error in messages listener:', error);
    });
  }

  // Game Statistics
  async updateGameStats(gameId: string, stats: Partial<GameStats>): Promise<void> {
    const statsData: Omit<GameStats, 'id'> = {
      gameId,
      totalMessages: 0,
      totalVotes: 0,
      averageGuessAccuracy: 0,
      mostActivePlayer: '',
      gameEndedAt: serverTimestamp(),
      ...stats
    };

    await addDoc(this.statsCollection, statsData);
  }

  // Cleanup functions
  async cleanupGame(gameId: string): Promise<void> {
    // Mark game as inactive
    const gameRef = doc(this.gamesCollection, gameId);
    await updateDoc(gameRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });

    // Note: In a production app, you might want to archive data instead of deleting
    // This is a simplified cleanup
  }

  async removePlayerFromGame(gameId: string, playerId: string): Promise<void> {
    const q = query(
      this.playersCollection,
      where('gameId', '==', gameId),
      where('playerId', '==', playerId)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const playerDoc = querySnapshot.docs[0];
      await deleteDoc(playerDoc.ref);
      
      // Update game player count
      const gameRef = doc(this.gamesCollection, gameId);
      await updateDoc(gameRef, {
        currentPlayers: increment(-1),
        updatedAt: serverTimestamp()
      });
    }
  }
}

export const firebaseService = new FirebaseService();