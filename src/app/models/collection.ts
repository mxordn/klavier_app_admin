import { ChapterModel } from "./chapter"

export let HOST: string = 'http://127.0.0.1:8000'


export interface CollectionModel {
    name: String,
    num_of_chapters: Number,
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