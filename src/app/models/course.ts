import { CollectionModel } from "./collection"

export interface IdOrderTable {
    id: string,
    order_num: number
}

export interface CourseModel {
    display_name: string,
    owner: string,
    course_description: string,
    list_of_collections: CollectionModel[],
    user_code: string,
    id: string
    coll_order: string
}

export const EmptyCourse: CourseModel = {
    display_name: '',
    course_description: '',
    list_of_collections: [],
    owner: '',
    user_code: '',
    id: '',
    coll_order: 'empty',
  }
