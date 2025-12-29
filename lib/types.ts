export interface Memory {
    id: string;
    record_id: string;
    author_id: string;
    title: string;
    data: object;
    valid_from: string;
    valid_to?: string;
    created_at: string;
}