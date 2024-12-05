// types.ts

export interface Task {
  text: string;
  check: boolean;
}

export interface InnerTask {
  upperTaskText: string;
  mainText: string;
  check: boolean;
}

export interface HTMLElementWithValue extends HTMLElement {
  value: string;
}

export interface HTMLFormElementWithChildren extends HTMLFormElement {
  children: HTMLCollectionOf<HTMLElementWithValue>;
}

export interface DOMElements {
  upperLi: HTMLElement;
  innerLi: HTMLElement;
  mainForm: HTMLFormElementWithChildren;
  mainInput: HTMLElementWithValue;
  mainList: HTMLElement;
  delAll: HTMLElement;
}