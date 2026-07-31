export const isLevelUnlocked = (levelId) => {
  if (levelId === 1) return true; // Level 1 is always unlocked
  return localStorage.getItem(`evieee_unlocked_level${levelId}`) === 'true';
};

export const unlockLevel = (levelId) => {
  localStorage.setItem(`evieee_unlocked_level${levelId}`, 'true');
};
