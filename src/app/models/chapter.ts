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