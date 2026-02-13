/**
 * Waveguide State Management Context
 * ===================================
 *
 * Centralized state management for all waveguide parameters using
 * React Context API with useReducer for predictable state updates.
 */

import { createContext, type Dispatch, type ReactNode, useContext, useReducer } from 'react'
import type {
  ROSSEParams,
  SuperellipseParams,
  WaveguideState,
  XModParams,
} from '../lib/types/waveguide'
import { DEFAULT_PARAMS } from '../lib/types/waveguide'

/**
 * Action types for state updates
 */
type WaveguideAction =
  | { type: 'UPDATE_H_PARAM'; param: keyof ROSSEParams; value: number }
  | { type: 'UPDATE_V_PARAM'; param: keyof ROSSEParams; value: number }
  | { type: 'UPDATE_SUPERELLIPSE'; param: keyof SuperellipseParams; value: number }
  | { type: 'UPDATE_XMOD_NUMBER'; param: keyof Omit<XModParams, 'enabled'>; value: number }
  | { type: 'UPDATE_XMOD_ENABLED'; value: boolean }
  | { type: 'SET_VISUALIZATION_MODE'; mode: WaveguideState['visualizationMode'] }
  | { type: 'RESET_TO_DEFAULTS' }

/**
 * Context type definition
 */
interface WaveguideContextType {
  state: WaveguideState
  dispatch: Dispatch<WaveguideAction>
}

/**
 * Reducer function for state updates
 */
function waveguideReducer(state: WaveguideState, action: WaveguideAction): WaveguideState {
  switch (action.type) {
    case 'UPDATE_H_PARAM':
      return {
        ...state,
        horizontal: {
          ...state.horizontal,
          [action.param]: action.value,
        },
      }

    case 'UPDATE_V_PARAM':
      return {
        ...state,
        vertical: {
          ...state.vertical,
          [action.param]: action.value,
        },
      }

    case 'UPDATE_SUPERELLIPSE':
      return {
        ...state,
        superellipse: {
          ...state.superellipse,
          [action.param]: action.value,
        },
      }

    case 'UPDATE_XMOD_NUMBER':
      return {
        ...state,
        xMod: {
          ...state.xMod,
          [action.param]: action.value,
        },
      }

    case 'UPDATE_XMOD_ENABLED':
      return {
        ...state,
        xMod: {
          ...state.xMod,
          enabled: action.value,
        },
      }

    case 'SET_VISUALIZATION_MODE':
      return {
        ...state,
        visualizationMode: action.mode,
      }

    case 'RESET_TO_DEFAULTS':
      return { ...DEFAULT_PARAMS }

    default:
      return state
  }
}

/**
 * Context instance
 */
const WaveguideContext = createContext<WaveguideContextType | null>(null)

/**
 * Provider component
 */
export function WaveguideProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(waveguideReducer, DEFAULT_PARAMS)

  return (
    <WaveguideContext.Provider value={{ state, dispatch }}>{children}</WaveguideContext.Provider>
  )
}

/**
 * Custom hook to access waveguide context
 */
export function useWaveguide(): WaveguideContextType {
  const context = useContext(WaveguideContext)
  if (!context) {
    throw new Error('useWaveguide must be used within a WaveguideProvider')
  }
  return context
}
