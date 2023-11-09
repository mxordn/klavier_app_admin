export let HOST: string = 'http://127.0.0.1:8000'


export interface ChapterModel {
    name: String,
    collection_id: String,
    owner: String,
    chapter_description: String,
    order_num: Number,
    id: String
}
