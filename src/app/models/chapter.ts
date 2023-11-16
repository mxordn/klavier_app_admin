import { TabModel } from "./tab";

export interface ChapterModel {
    name: String,
    collection_id: String,
    owner: String,
    chapter_description: String,
    exercise_ids: TabModel[],
    order_num: Number,
    id: String
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