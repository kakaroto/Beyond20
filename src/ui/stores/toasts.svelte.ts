import type { ToastItem, ToastKind } from "../types";

let nextId = 1;

class ToastStore {
  items = $state<ToastItem[]>([]);

  push(message: string, kind: ToastKind = "info", durationMs = 2600): void {
    const id = nextId++;
    this.items = [...this.items, { id, message, kind }];
    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  dismiss(id: number): void {
    this.items = this.items.filter((t) => t.id !== id);
  }
}

export const toasts = new ToastStore();
