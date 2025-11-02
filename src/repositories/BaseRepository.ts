export type Page<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type FindAllParams = {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
};

export interface BaseRepository<T> {
  create(entity: T): Promise<T>;
  update(id: string, partial: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(params?: FindAllParams): Promise<Page<T>>;
}
