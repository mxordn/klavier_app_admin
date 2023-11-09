export let HOST: string = 'http://127.0.0.1:8000'


export interface CollectionModel {
    name: String,
    num_of_chapters: Number,
    display_name: String,
    owner: String,
    collection_description: String,
    list_of_exercises: [],
    user_code: String,
    id: String
}
