export interface PaginatedData<T> {
    values: T[];
    page: number;
    per_page: number;
    total: number;
}
