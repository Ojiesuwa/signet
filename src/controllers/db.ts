type DataObject = Record<string, any>;
type Callback = (data: DataObject[]) => void;

const STORAGE_KEY = "my_local_collection";

let listeners: Callback[] = [];

/**
 * Get the current array from localStorage
 */
function getData(): DataObject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse localStorage data:", e);
    return [];
  }
}

/**
 * Save a new array to localStorage and notify listeners
 */
function setData(newData: DataObject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  notifyListeners(newData);
}

/**
 * Notify all live listeners of the latest data
 */
function notifyListeners(data: DataObject[]) {
  for (const cb of listeners) cb(data);
}

/**
 * Append a new item to the stored array
 */
export function storeData(newItem: DataObject) {
  const current = getData();
  const updated = [...current, newItem];
  setData(updated);
}

/**
 * Subscribe to changes in the stored array
 * Similar to Firestore's onSnapshot
 */
export function liveListen(cb: Callback) {
  // Register callback
  listeners.push(cb);

  // Fire immediately with current data
  cb(getData());

  // Handle external storage changes (from other tabs)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      const updated = e.newValue ? JSON.parse(e.newValue) : [];
      notifyListeners(updated);
    }
  };

  window.addEventListener("storage", handleStorage);

  // Return an unsubscribe function
  return () => {
    listeners = listeners.filter((fn) => fn !== cb);
    window.removeEventListener("storage", handleStorage);
  };
}
