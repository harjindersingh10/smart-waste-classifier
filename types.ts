export interface ClassificationResult {
  category: string;
  confidence: string;
  disposalTip: string;
}

export interface HistoryEntry extends ClassificationResult {
  id: string;
  timestamp: number;
  imagePreview: string;
}

export interface Stats {
  total: number;
  streak: number;
  lastClassification: number; // timestamp
}
