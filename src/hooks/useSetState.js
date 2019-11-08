// @ts-check
import { useReducer } from 'react';

/**
 * @callback StateChangesReducer
 * @param {State} prevState - Previous state
 * @returns {Partial<State>} - Patch for new state. This should be an object with some or all of
 *     the properties from the previous state.
 * @template {Object} State
 */

/**
 * @param {State} state
 * @param {Partial<State> | StateChangesReducer<State>} stateChanges
 * @template {Object} State
 */

function reducer(state, stateChanges) {
  const patch = typeof stateChanges === 'object'
    ? stateChanges
    : stateChanges(state);

  return {
    ...state,
    ...patch,
  };
}

/**
 * React hook that provides functionality similar to a class component's `this.useState` method
 * @param {State} initialState
 * @returns {[State, function(Partial<State> | StateChangesReducer<State>): void]}
 * @template {Object} State
 */
export default function useSetState(initialState) {
  const [state, setState] = useReducer(reducer, initialState);
  return [state, setState];
}
