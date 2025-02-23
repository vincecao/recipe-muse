import { useReducer } from 'react';
import { DeepseekModel, LLMRequest } from '~/app/api/_services/llm-client';
import { DbRecipe } from '~/core/type';

type State = {
  model: LLMRequest['model'];
  step: number;
  generatedNames: string[];
  selectedName: string;
  isLoading: boolean;
  generatedRecipes: DbRecipe[];
  progress?: {
    message?: string;
    value: number;
  };
};

type Action =
  | { type: 'SET_MODEL'; payload: LLMRequest['model'] }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_GENERATED_NAMES'; payload: string[] }
  | { type: 'SET_SELECTED_NAME'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_RECIPE'; payload: DbRecipe }
  | {
      type: 'SET_PROGRESS';
      payload?: {
        message?: string;
        value: number;
      };
    };

export function generateReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, model: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_GENERATED_NAMES':
      return { ...state, generatedNames: action.payload };
    case 'SET_SELECTED_NAME':
      return { ...state, selectedName: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_RECIPE':
      return { ...state, generatedRecipes: [...state.generatedRecipes, action.payload] };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    default:
      return state;
  }
}

export function useGenerateReducer(): [
  State,
  {
    setStartLoading: () => void;
    setStopLoading: () => void;
    resetProgress: () => void;
    setProgress: (progress: { message?: string; value: number } | undefined) => void;
    setStep: (step: 1 | 2) => void;
    setGeneratedNames: (names: string[]) => void;
    addRecipe: (recipe: DbRecipe) => void;
    setModel: (model: LLMRequest['model']) => void;
    setSelectedName: (name: string) => void;
  },
] {
  const [state, dispatch] = useReducer(generateReducer, {
    model: DeepseekModel.CHAT,
    step: 1,
    generatedNames: [],
    selectedName: '',
    isLoading: false,
    generatedRecipes: [],
    progress: undefined,
  });

  const setStartLoading = () => dispatch({ type: 'SET_LOADING', payload: true });
  const setStopLoading = () => dispatch({ type: 'SET_LOADING', payload: false });
  const resetProgress = () => dispatch({ type: 'SET_PROGRESS', payload: undefined });
  const setProgress = (progress: { message?: string; value: number } | undefined) =>
    dispatch({ type: 'SET_PROGRESS', payload: progress });
  const setStep = (step: 1 | 2) => dispatch({ type: 'SET_STEP', payload: step });
  const setGeneratedNames = (names: string[]) => dispatch({ type: 'SET_GENERATED_NAMES', payload: names });
  const addRecipe = (recipe: DbRecipe) => dispatch({ type: 'ADD_RECIPE', payload: recipe });

  const setModel = (model: LLMRequest['model']) => dispatch({ type: 'SET_MODEL', payload: model });
  const setSelectedName = (name: string) => dispatch({ type: 'SET_SELECTED_NAME', payload: name });

  return [
    state,
    {
      setStartLoading,
      setStopLoading,
      resetProgress,
      setProgress,
      setStep,
      setGeneratedNames,
      addRecipe,
      setModel,
      setSelectedName,
    },
  ];
}
