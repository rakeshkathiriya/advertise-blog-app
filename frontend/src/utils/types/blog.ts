export interface BloggerPost {
  id: string;
  title: string;
  content: string;
  url: string;
  published?: string | null;
}

export interface BloggerResponse {
  items?: BloggerPost[];
}
