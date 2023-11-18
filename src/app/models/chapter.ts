import { TabModel } from "./tab";

export interface ChapterModel {
    name: string,
    collection_id: string,
    owner: string,
    chapter_description: string,
    exercise_ids: TabModel[],
    order_num: number,
    id: string
}

export const EmptyChapter: ChapterModel = {
    name: '',
    collection_id: '',
    owner: '',
    chapter_description: '',
    exercise_ids: [],
    order_num: 0,
    id: ''
}