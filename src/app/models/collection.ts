import { ChapterModel } from "./chapter"

export interface IdOrderTable {
    id: string,
    order_num: number
}

export interface CollectionModel {
    name: String,
    num_of_chapters: number,
    display_name: String,
    owner: String,
    collection_description: String,
    list_of_exercises: ChapterModel[],
    user_code: String,
    id: String
}

export const EmptyColl: CollectionModel = {
    name: '',
    display_name: '',
    collection_description: '',
    list_of_exercises: [],
    owner: '',
    num_of_chapters: 0,
    user_code: '',
    id: ''
  }