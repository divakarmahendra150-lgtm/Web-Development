import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { questService } from '../services/questService';
import { AuthContext } from './AuthContext';

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { user } = useContext(AuthContext);
  
  const [character, setCharacter] = useState(null);
  const [stats, setStats] = useState(null);
  const [progression, setProgression] = useState(null);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gamification overlay events
  const [levelUpData, setLevelUpData] = useState(null);
  const [completionFeedback, setCompletionFeedback] = useState(null);

  const fetchGameState = useCallback(async () => {
    if (!user) {
      setCharacter(null);
      setStats(null);
      setQuests([]);
      return;
    }
    setLoading(true);
    try {
      const [charData, statsData, progData, questsData] = await Promise.all([
        questService.getCharacter(),
        questService.getStats(),
        questService.getProgression(),
        questService.getQuests(),
      ]);
      setCharacter(charData);
      setStats(statsData);
      setProgression(progData);
      setQuests(questsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch game state:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGameState();
  }, [fetchGameState]);

  // Create Quest
  const createQuest = async (questData) => {
    const newQuest = await questService.createQuest(questData);
    setQuests((prev) => [newQuest, ...prev]);
    return newQuest;
  };

  // Update Quest
  const updateQuest = async (id, questData) => {
    const updated = await questService.updateQuest(id, questData);
    setQuests((prev) => prev.map((q) => (q.id === id ? updated : q)));
    return updated;
  };

  // Delete Quest
  const deleteQuest = async (id) => {
    await questService.deleteQuest(id);
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  // Complete Quest (Authoritative Server Side Calculation)
  const completeQuest = async (id) => {
    try {
      const result = await questService.completeQuest(id);
      
      // Update local quest list
      setQuests((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: 'completed', completed_at: new Date().toISOString() } : q))
      );

      // Trigger completion feedback
      setCompletionFeedback({
        task_id: result.task_id,
        xp_earned: result.xp_earned,
        gold_earned: result.gold_earned,
        attribute_gained: result.attribute_gained,
        attribute_points: result.attribute_points,
      });

      // Update character state with authoritative values
      setCharacter((prev) => ({
        ...prev,
        level: result.level,
        total_xp: result.total_xp,
        gold: result.gold,
        current_streak: result.current_streak,
        longest_streak: result.longest_streak,
        xp_in_level: result.xp_in_level,
        xp_needed: result.xp_needed,
        xp_progress_percent: result.xp_progress_percent,
        strength: result.character.strength,
        intellect: result.character.intellect,
        discipline: result.character.discipline,
        vitality: result.character.vitality,
        charisma: result.character.charisma,
      }));

      // Check for Level Up
      if (result.leveled_up) {
        setLevelUpData({
          level_before: result.level_before,
          level_after: result.level_after,
          total_xp: result.total_xp,
          gold: result.gold,
          attribute_gained: result.attribute_gained,
        });
      }

      // Refresh full progression & stats in background
      Promise.all([
        questService.getStats().then(setStats).catch(() => {}),
        questService.getProgression().then(setProgression).catch(() => {}),
      ]);

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const closeLevelUpModal = () => {
    setLevelUpData(null);
  };

  const clearCompletionFeedback = () => {
    setCompletionFeedback(null);
  };

  const updateCharacterGold = (newGold) => {
    setCharacter((prev) => (prev ? { ...prev, gold: newGold } : prev));
  };

  const value = {
    character,
    stats,
    progression,
    quests,
    loading,
    error,
    levelUpData,
    completionFeedback,
    createQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
    closeLevelUpModal,
    clearCompletionFeedback,
    updateCharacterGold,
    refetchGameState: fetchGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
