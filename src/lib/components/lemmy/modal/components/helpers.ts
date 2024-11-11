import type { ListingType, SortType } from 'lemmy-js-client'


export interface FeedController {
    load: (initial?:boolean) => Promise<void>
    reset: (clearSnapshot?:boolean) => void,
    refresh: (clearSnapshot?: boolean) => void,
    scrollBottom: () => void,
    scrollTop: () => void,
    community_id?: number
    community_name?: string
    data: any
    disliked_only?: boolean,
    liked_only?: boolean,
    saved_only?: boolean,
    sort: SortType
    type: ListingType
}