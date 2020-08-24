export type QueryOptions = {
  query: string;
};

export type QueryResponse = {
  results: SearchResult[];
};

export interface SearchResult {
  id: string;
  description?: string;
  urls?: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  }
};
