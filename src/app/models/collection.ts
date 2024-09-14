import { ChapterModel } from "./chapter"

export interface IdOrderTable {
    id: string,
    order_num: number
}

export interface CollectionModel {
    name: string,
    num_of_chapters: number,
    display_name: string,
    owner: string,
    collection_description: string,
    list_of_exercises: ChapterModel[],
    user_code: string,
    id: string
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
