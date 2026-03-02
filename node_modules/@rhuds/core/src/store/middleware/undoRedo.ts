/**
 * Undo/Redo Middleware
 * Provides time-travel debugging capabilities
 */

import { Middleware, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

/**
 * History state
 */
interface HistoryState {
  past: RootState[];
  present: RootState;
  future: RootState[];
}

/**
 * Undo/Redo configuration
 */
export interface UndoRedoConfig {
  limit?: number;
  filter?: (action: AnyAction) => boolean;
  ignoreActions?: string[];
}

/**
 * Undo/Redo action types
 */
export const UNDO = '@@undoRedo/UNDO';
export const REDO = '@@undoRedo/REDO';
export const CLEAR_HISTORY = '@@undoRedo/CLEAR_HISTORY';

/**
 * Action creators
 */
export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });
export const clearHistory = () => ({ type: CLEAR_HISTORY });

/**
 * Create undo/redo middleware
 */
export function createUndoRedoMiddleware(
  config: UndoRedoConfig = {}
): Middleware<{}, RootState> {
  const {
    limit = 50,
    filter = () => true,
    ignoreActions = [],
  } = config;

  let history: HistoryState = {
    past: [],
    present: {} as RootState,
    future: [],
  };

  return (store) => (next) => (action) => {
    const currentState = store.getState();

    // Handle undo/redo actions
    if (action.type === UNDO) {
      if (history.past.length === 0) {
        return;
      }

      const previous = history.past[history.past.length - 1];
      const newPast = history.past.slice(0, history.past.length - 1);

      history = {
        past: newPast,
        present: previous,
        future: [currentState, ...history.future],
      };

      // Restore previous state
      Object.keys(previous).forEach((key) => {
        store.dispatch({
          type: `${key}/setState`,
          payload: previous[key as keyof RootState],
        });
      });

      return;
    }

    if (action.type === REDO) {
      if (history.future.length === 0) {
        return;
      }

      const next = history.future[0];
      const newFuture = history.future.slice(1);

      history = {
        past: [...history.past, currentState],
        present: next,
        future: newFuture,
      };

      // Restore next state
      Object.keys(next).forEach((key) => {
        store.dispatch({
          type: `${key}/setState`,
          payload: next[key as keyof RootState],
        });
      });

      return;
    }

    if (action.type === CLEAR_HISTORY) {
      history = {
        past: [],
        present: currentState,
        future: [],
      };
      return;
    }

    // Execute action
    const result = next(action);

    // Check if action should be recorded
    const shouldRecord =
      filter(action) &&
      !ignoreActions.includes(action.type) &&
      !action.type.startsWith('@@');

    if (shouldRecord) {
      const newState = store.getState();

      // Add to history
      history = {
        past: [...history.past, currentState].slice(-limit),
        present: newState,
        future: [], // Clear future on new action
      };
    }

    return result;
  };
}

/**
 * Selectors for undo/redo state
 */
export const canUndo = () => history.past.length > 0;
export const canRedo = () => history.future.length > 0;

// Export history for external access
let history: HistoryState = {
  past: [],
  present: {} as RootState,
  future: [],
};
