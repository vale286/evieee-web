const bgmOverall = new Audio('/music/overall-music.mp3');
const bgmLevel1 = new Audio('/music/level-1.mp3');
const bgmLevel2 = new Audio('/music/level-2.mp3');
const bgmLevel3 = new Audio('/music/level-3.mp3');
const bgmLevel4 = new Audio('/music/level-4.mp3');
const bgmLevel5 = new Audio('/music/level-5.mp3');
const bgmLevel6 = new Audio('/music/level-6.mp3');
const bgmCongrats = new Audio('/music/congratulations.mp3');

const allTracks = [bgmOverall, bgmLevel1, bgmLevel2, bgmLevel3, bgmLevel4, bgmLevel5, bgmLevel6, bgmCongrats];
allTracks.forEach(t => t.loop = true);

let currentTrack = null;
let isAudioMuted = localStorage.getItem('evieee_audio_muted') === 'true';

export const playMusic = (trackName) => {
  allTracks.forEach(t => { t.pause(); });
  
  let track = null;
  switch(trackName) {
    case 'overall': track = bgmOverall; break;
    case 'level1': track = bgmLevel1; break;
    case 'level2': track = bgmLevel2; break;
    case 'level3': track = bgmLevel3; break;
    case 'level4': track = bgmLevel4; break;
    case 'level5': track = bgmLevel5; break;
    case 'level6': track = bgmLevel6; break;
    case 'congrats': track = bgmCongrats; break;
  }

  currentTrack = track;
  if (track && !isAudioMuted) {
    track.play().catch(e => console.log("Audio play blocked:", e));
  }
};

export const toggleMuteGlobal = (muted) => {
  isAudioMuted = muted;
  localStorage.setItem('evieee_audio_muted', muted ? 'true' : 'false');
  if (muted) {
    allTracks.forEach(t => t.pause());
  } else if (currentTrack) {
    currentTrack.play().catch(e => console.log("Audio play blocked:", e));
  }
};

export const isMuted = () => isAudioMuted;
