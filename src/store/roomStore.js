import { create } from "zustand";

export const useRoomStore = create((set, get) => ({
  // Existing state
  rooms: [],
  currentRoom: null,
  fearlessPicks: [],

  // New state for multi-game series
  gameMode: "BO3", // 'TOURNAMENT', 'BO3', 'BO5'
  blueTeamName: "Blue Team",
  redTeamName: "Red Team",
  gameSeries: {
    currentGame: 1,
    blueWins: 0,
    redWins: 0,
    games: [], // { bluePicks, redPicks, blueBans, redBans }
  },

  // Existing actions
  setRooms: (rooms) => set({ rooms }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  addFearlessPick: (champion) =>
    set((state) => ({
      fearlessPicks: [...state.fearlessPicks, champion],
    })),
  resetFearlessPicks: () => set({ fearlessPicks: [] }),

  // New actions for series management
  setGameInfo: ({ mode, blueName, redName }) =>
    set({
      gameMode: mode,
      blueTeamName: blueName,
      redTeamName: redName,
    }),

  startGameSeries: () =>
    set((state) => {
      const series = {
        currentGame: 1,
        blueWins: 0,
        redWins: 0,
        games: [],
      };
      // For BO3, pre-fill 3 game slots, for BO5, 5 slots.
      const totalGames = state.gameMode === "BO3" ? 3 : state.gameMode === "BO5" ? 5 : 1;
      for (let i = 0; i < totalGames; i++) {
        series.games.push({ bluePicks: [], redPicks: [], blueBans: [], redBans: [] });
      }
      return { gameSeries: series, fearlessPicks: [] };
    }),

  finishGame: ({ bluePicks, redPicks, blueBans, redBans, winner }) =>
    set((state) => {
      const currentGameIndex = state.gameSeries.currentGame - 1;
      const newGameSeries = { ...state.gameSeries };

      // Save the results of the current game
      newGameSeries.games[currentGameIndex] = { bluePicks, redPicks, blueBans, redBans };
      if (winner === "blue") {
        newGameSeries.blueWins += 1;
      } else if (winner === "red") {
        newGameSeries.redWins += 1;
      }

      // Move to the next game
      newGameSeries.currentGame += 1;

      // Update fearless picks for the next game
      const newFearlessPicks = [
        ...state.fearlessPicks,
        ...bluePicks.filter(Boolean),
        ...redPicks.filter(Boolean),
      ];

      return { gameSeries: newGameSeries, fearlessPicks: newFearlessPicks };
    }),
}));
