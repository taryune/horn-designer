/**
 * Waveguide State Management Context
 * ===================================
 *
 * Centralized state management for all waveguide parameters using
 * React Context API with useReducer for predictable state updates.
 */

import { createContext, type Dispatch, type ReactNode, useContext, useReducer } from 'react'
import type {
  CardinalModParams,
  DiagonalModParams,
  ModulationBlendParams,
  ROSSEParams,
  ShapeBlendParams,
  WaveguideState,
} from '../lib/types/waveguide'
import { DEFAULT_PARAMS } from '../lib/types/waveguide'

/**
 * Action types for state updates
 */
type WaveguideAction =
  | { type: 'UPDATE_H_PARAM'; param: keyof ROSSEParams; value: number }
  | { type: 'UPDATE_V_PARAM'; param: keyof ROSSEParams; value: number }
  | { type: 'UPDATE_SHAPE_BLEND'; param: keyof ShapeBlendParams; value: number }
  | { type: 'UPDATE_MOD_BLEND'; param: keyof ModulationBlendParams; value: number }
  | {
      type: 'UPDATE_DIAGONAL_NUMBER'
      param: keyof Omit<DiagonalModParams, 'enabled'>
      value: number
    }
  | { type: 'UPDATE_DIAGONAL_ENABLED'; value: boolean }
  | {
      type: 'UPDATE_CARDMOD_NUMBER'
      param: keyof Omit<CardinalModParams, 'enabled'>
      value: number
    }
  | { type: 'UPDATE_CARDMOD_ENABLED'; value: boolean }
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

    case 'UPDATE_SHAPE_BLEND':
      return {
        ...state,
        shapeBlend: {
          ...state.shapeBlend,
          [action.param]: action.value,
        },
      }

    case 'UPDATE_MOD_BLEND':
      return {
        ...state,
        modBlend: {
          ...state.modBlend,
          [action.param]: action.value,
        },
      }

    case 'UPDATE_DIAGONAL_NUMBER':
      return {
        ...state,
        diagonalMod: {
          ...state.diagonalMod,
          [action.param]: action.value,
        },
      }

    case 'UPDATE_DIAGONAL_ENABLED':
      return {
        ...state,
        diagonalMod: {
          ...state.diagonalMod,
          enabled: action.value,
        },
      }

    case 'UPDATE_CARDMOD_NUMBER':
      return {
        ...state,
        cardinalMod: {
          ...state.cardinalMod,
          [action.param]: action.value,
        },
      }

    case 'UPDATE_CARDMOD_ENABLED':
      return {
        ...state,
        cardinalMod: {
          ...state.cardinalMod,
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
