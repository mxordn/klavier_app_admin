export interface TabModel {
    exercise_tab_name: string,
    img_url: string,
    audio_url: string,
    icon: string,
    chapter_id: string,
    exercise_description: string,
    order_num: number,
    id: string
}

export const EmptyTab: TabModel = {
    exercise_tab_name: '',
    img_url: '',
    audio_url: '',
    icon: '',
    chapter_id: '',
    exercise_description: '',
    order_num: 0,
    id: ''
}
