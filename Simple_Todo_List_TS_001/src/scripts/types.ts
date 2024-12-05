// Task interface
export interface Task {
  text: string;
  check: boolean;
}

// InnerTask interface
export interface InnerTask {
  upperTaskText: string;
  mainText: string;
  check: boolean;
}

// DOM Element types
export type DOMElement = HTMLElement | null;

// Event listener types
export type EventListener = (event: Event) => void;

// Local Storage key types
export type LocalStorageKey = 'allTasks' | 'innerTasks';

// Function types
export type CreateNewTaskFunction = (text: string, check: boolean) => void;
export type AddNewItemFunction = (e: Event) => void;
export type AddInnerTaskFunction = (upperText: string, mainText: string, check: boolean) => void;
export type TaskStufFunction = (e: Event) => void;
export type DeleteAllFunction = (e: Event) => void;
export type LoadLSFunction = () => void;
export type LoadInnerTasksFunction = () => void;
export type SaveLSFunction = (text: string, index: number) => void;
export type SaveInnerTasksFunction = (item: InnerTask | string, index: number, upperText?: string) => void;

// Export constants
export const COLLAPSE_ID_PREFIX = 'collapse';