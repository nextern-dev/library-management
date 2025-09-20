export interface Author {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  isbn: string;
  cover: string | null;
  published: Date;
  createdAt: Date;
  userId: string;
  authorId: number;
  author: {
    id: number;
    name: string;
  };
}
