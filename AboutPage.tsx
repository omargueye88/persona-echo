import React from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Logo } from './ui/Logo';
import { 
  Users, 
  MessageCircle, 
  Vote, 
  Trophy, 
  Clock, 
  Target, 
  Lightbulb,
  ArrowLeft,
  Play,
  CheckCircle
} from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Logo size="lg" />
            </div>
            <p className="text-gray-300 text-lg">
              Découvrez les règles et stratégies de ce jeu de déduction sociale
            </p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Game Overview */}
        <Card glow className="mb-8 animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Qu'est-ce que Persona Echo ?</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Persona Echo est un jeu social narratif où l'art de la tromperie rencontre la psychologie humaine. 
              Chaque joueur crée une fausse identité convaincante et tente de découvrir qui se cache derrière 
              les personas des autres joueurs, tout en gardant sa propre identité secrète.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-neon-purple mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">3-8 Joueurs</h3>
              <p className="text-gray-400 text-sm">
                Parfait pour les soirées entre amis ou les événements en ligne
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 text-neon-cyan mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Temps Flexible</h3>
              <p className="text-gray-400 text-sm">
                De 5 minutes à 1 heure par manche selon vos préférences
              </p>
            </div>
            <div className="text-center">
              <Target className="w-12 h-12 text-neon-purple mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Déduction</h3>
              <p className="text-gray-400 text-sm">
                Analysez, déduisez et percez les secrets de vos adversaires
              </p>
            </div>
          </div>
        </Card>

        {/* How to Play */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Play className="w-6 h-6 text-neon-cyan mr-3" />
              Comment Jouer
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Création du Persona</h3>
                  <p className="text-gray-400 text-sm">
                    Inventez une identité fictive complète : nom, âge, profession, traits de personnalité, 
                    histoire personnelle. Plus votre persona sera crédible et cohérent, plus vous aurez 
                    de chances de tromper vos adversaires.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phase de Discussion</h3>
                  <p className="text-gray-400 text-sm">
                    Interagissez naturellement avec les autres joueurs en restant dans votre rôle. 
                    Posez des questions, racontez des anecdotes, réagissez aux conversations. 
                    Observez attentivement les réponses des autres pour détecter les incohérences.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-neon-purple rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phase de Vote</h3>
                  <p className="text-gray-400 text-sm">
                    Choisissez un joueur que vous pensez avoir percé à jour et formulez votre hypothèse 
                    sur sa vraie identité. Vous ne pouvez voter que pour un seul joueur par manche.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-neon-cyan rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Révélation</h3>
                  <p className="text-gray-400 text-sm">
                    Découvrez qui se cachait derrière chaque persona et voyez si vos déductions étaient correctes. 
                    Les points sont attribués selon la précision de vos votes et votre capacité à rester incognito.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="w-6 h-6 text-neon-purple mr-3" />
              Système de Points
            </h2>
            
            <div className="space-y-4">
              <div className="bg-dark-surface rounded-lg p-4 border border-green-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400 font-semibold">Vote Correct</span>
                  <span className="text-green-400 font-bold">+100 points</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Vous avez correctement deviné l'identité d'un autre joueur
                </p>
              </div>

              <div className="bg-dark-surface rounded-lg p-4 border border-blue-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-400 font-semibold">Persona Non Découvert</span>
                  <span className="text-blue-400 font-bold">+150 points</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Personne n'a réussi à percer votre identité fictive
                </p>
              </div>

              <div className="bg-dark-surface rounded-lg p-4 border border-yellow-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-400 font-semibold">Bonus Participation</span>
                  <span className="text-yellow-400 font-bold">+25 points</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Pour chaque message envoyé pendant la discussion
                </p>
              </div>

              <div className="bg-dark-surface rounded-lg p-4 border border-red-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-red-400 font-semibold">Vote Incorrect</span>
                  <span className="text-red-400 font-bold">-25 points</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Pénalité pour un vote erroné
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-lg border border-neon-purple/30">
              <h3 className="text-white font-semibold mb-2">🏆 Objectif</h3>
              <p className="text-gray-300 text-sm">
                Le joueur avec le plus de points à la fin de toutes les manches remporte la partie !
              </p>
            </div>
          </Card>
        </div>

        {/* Strategies */}
        <Card className="mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 text-neon-cyan mr-3" />
            Stratégies et Conseils
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-neon-purple mb-4">Pour Créer un Bon Persona</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span>Mélangez vérité et fiction pour plus de crédibilité</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span>Préparez des anecdotes cohérentes avec votre personnage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span>Évitez les clichés trop évidents ou les détails trop parfaits</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span>Pensez aux réactions naturelles de votre personnage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span>Ajoutez des petites manies ou habitudes spécifiques</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-neon-cyan mb-4">Pour Démasquer les Autres</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Posez des questions spécifiques sur leur "expérience"</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Observez les incohérences dans leurs réponses</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Repérez qui évite certains sujets ou questions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Analysez le style d'écriture et les expressions utilisées</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <span>Faites confiance à votre instinct sur les comportements suspects</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Game Phases */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 text-neon-purple mr-3" />
            Déroulement d'une Partie
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-dark-surface rounded-lg border border-gray-600">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Préparation</h3>
              <p className="text-gray-400 text-xs">
                Création des personas et attente des joueurs
              </p>
            </div>
            
            <div className="text-center p-4 bg-dark-surface rounded-lg border border-gray-600">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Discussion</h3>
              <p className="text-gray-400 text-xs">
                Interaction libre entre les personas
              </p>
            </div>
            
            <div className="text-center p-4 bg-dark-surface rounded-lg border border-gray-600">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-3">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Vote</h3>
              <p className="text-gray-400 text-xs">
                Chacun vote pour démasquer un joueur
              </p>
            </div>
            
            <div className="text-center p-4 bg-dark-surface rounded-lg border border-gray-600">
              <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Révélation</h3>
              <p className="text-gray-400 text-xs">
                Dévoilement des identités et calcul des scores
              </p>
            </div>
          </div>
        </Card>

        {/* Tips for Success */}
        <Card glow className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Prêt à Jouer ?</h2>
            <p className="text-gray-300 mb-6">
              Maintenant que vous connaissez les règles, il est temps de tester vos talents de déduction 
              et de tromperie ! Créez votre première partie et invitez vos amis pour une expérience 
              inoubliable de psychologie sociale.
            </p>
            <Button
              glow
              size="lg"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Commencer à Jouer</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};