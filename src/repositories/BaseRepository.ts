export interface BaseRepository<T> {
  create(entity: T): Promise<T>;
  update(id: string, partial: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}
