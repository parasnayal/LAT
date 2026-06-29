import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

export function createAppStore<TState extends object>(
  name: string,
  initializer: StateCreator<TState>
) {
  return create<TState>()(devtools(initializer, { name }));
}
