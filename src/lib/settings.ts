import type { CommentSortType, SortType } from 'lemmy-js-client'
import { writable } from 'svelte/store'
import { env } from '$env/dynamic/public'

export const SSR_ENABLED = env.PUBLIC_SSR_ENABLED?.toLowerCase() == 'true'

// Returns a proper boolean or null.  Used to set boolean values from env var strings while allowing nullish coalescing to set default values.
const toBool = (str: string | undefined) => {
  if (!str) {
    return null
  }
  return str.toLowerCase() === 'true'
}

interface Settings {
    markReadPosts: boolean
    instance?: string
    showInstances: {
        user: boolean
        community: boolean
        comments: boolean
    }
    showCompactPosts: boolean
    defaultSort: {
        sort: SortType
        feed: 'All' | 'Subscribed' | 'Local'
        comments: CommentSortType
    }
    hidePosts: {
        deleted: boolean
        removed: boolean
    }
    notifications: {
        enabled: boolean
        pollRate: number
        // how often to check in the background
        notifRate: number
    }
    displayNames: boolean
    nsfwBlur: boolean
    moderation: {
        removalReasonPreset: string
    },
    openInNewTab: {
        postLinks: boolean,
        posts: boolean,
    },
    modlogCardView: boolean | undefined
    debugInfo: boolean
    systemUI: boolean
    embeddedMedia: {
        feed: boolean
        post: boolean
        YTFrontend: 'YouTube' | 'Invidious' 
        customInvidious: string
        autoplay: boolean
    }
    imageSize: {
        feed: 'max-w-sm' | 'max-w-md'| 'max-w-3xl' | 'max-w-4xl' | 'w-full'
        post: 'max-w-sm' | 'max-w-md'| 'max-w-3xl' | 'max-w-4xl' | 'w-full'
    }
    uiState: {
        expandSidebar: boolean
        expandCommunitySidebar: boolean
        expandModeratingList: boolean
        expandSubscribedList: boolean
        expandAccountsList: boolean
    }
    highlightCode: boolean
    highlightInlineCode: boolean
    inlineImages: boolean
    experimentalFeatures: boolean

}

export const defaultSettings: Settings = {
    notifications: {
        enabled:    false,
        pollRate:   60 * 1000,
        notifRate:  10 * 60 * 1000,
    },
    
    moderation: {
        removalReasonPreset: `Your submission in *"{{post}}"* was removed for {{reason}}.`,
    },
    
    debugInfo: false,
    systemUI: true,
    imageSize: {
        feed: 'max-w-4xl',
        post: 'w-full'
    },
    highlightCode: true,
    highlightInlineCode: false,
    inlineImages: true,
    uiState: {
        expandSidebar: true,
        expandCommunitySidebar: true,
        expandModeratingList: true,
        expandSubscribedList: true,
        expandAccountsList: true,
    },

    markReadPosts:      toBool(env.PUBLIC_MARK_READ_POSTS)              ??  false,
    
    showInstances: {
        user:           toBool(env.PUBLIC_SHOW_INSTANCES_USER)          ??  false,
        community:      toBool(env.PUBLIC_SHOW_INSTANCES_COMMUNITY)     ??  true,
        comments:       toBool(env.PUBLIC_SHOW_INSTANCES_COMMENTS)      ??  false,
    },
    
    showCompactPosts:   toBool(env.PUBLIC_SHOW_COMPACT_POSTS)           ??  false,
    
    defaultSort: {
        sort:           env.PUBLIC_DEFAULT_FEED_SORT                    ??  ('Active' as any),
        feed:           env.PUBLIC_DEFAULT_FEED                         ??  ('Local' as any),
        comments:       env.PUBLIC_DEFAULT_COMMENT_SORT                 ??  ('Hot' as any),
    },
    hidePosts: {
        deleted:    toBool(env.PUBLIC_HIDE_DELETED)                     ??  true,
        removed:    toBool(env.PUBLIC_HIDE_REMOVED)                     ??  false,
    },
   
    
    
    displayNames:   toBool(env.PUBLIC_DISPLAY_NAMES)                    ??  true,
    nsfwBlur:       toBool(env.PUBLIC_NSFW_BLUR)                        ??  true,
    
    openInNewTab: {
        postLinks:  toBool(env.PUBLIC_OPEN_LINKS_NEW_TAB)               ??  false,
        posts:      toBool(env.PUBLIC_OPEN_POSTS_NEW_TAB)               ??  false,
    },
    modlogCardView: toBool(env.PUBLIC_MODLOG_CARD_VIEW)                 ??  true,

    experimentalFeatures:                                               false,
    
    embeddedMedia: {
        feed:     toBool(env.PUBLIC_ENABLE_EMBEDDED_MEDIA_FEED)         ??  false,
        post:     toBool(env.PUBLIC_ENABLE_EMBEDDED_MEDIA_POST)         ??  true,
        YTFrontend:     env.PUBLIC_YOUTUBE_FRONTEND                     ??  'YouTube',
        customInvidious:                                                    'yewtu.be',
        autoplay:                                                           false,
    },

    
}

export const userSettings = writable(defaultSettings)

// Define Invidious and Piped instances to determine if embedded media is a Youtube et al video.
// Invidious Instance List:  https://docs.invidious.io/instances/#list-of-public-invidious-instances-sorted-from-oldest-to-newest
// Piped Instance List: https://github.com/TeamPiped/Piped/wiki/Instances
// Note:    The Invidious instances are used to both detect if a post URL is a video AND to populate the dropdown for which Invidious instance to use.
//          The Piped list is only used for detection of Piped video links; Piped is too slow to use as an embedded player.

export const YTFrontends = {
    invidious: [
        'yewtu.be',
        'vid.puffyan.us',
        'invidious.lunar.icu',
        'invidious.privacydev.net',
        'invidious.slipfox.xyz',
        'inv.tux.pizza',
        'invidious.io.lol',
        'inv.makerlab.tech',
        'inv.zzls.xyz',
        'anontube.lvkaszus.pl',
        'invidious.fdn.fr',
        'iv.datura.network',
        'invidious.asir.dev',
        'invidious.private.coffee',
        'iv.nboeck.de',
        'yt.oelrichsgarcia.de',
        'yt.artemislena.eu'
    ],

    piped: [
        'piped.video',
        'pipedapi.tokhmi.xyz',
        'pipedapi.moomoo.me',
        'pipedapi.syncpundit.io',
        'api-piped.mha.fi',
        'piped-api.garudalinux.org',
        'pipedapi.rivo.lol',
        'pipedapi.aeong.one',
        'pipedapi.leptons.xyz',
        'piped-api.lunar.icu',
        'pipedapi-libre.kavin.rocks',
        'pa.mint.lgbt',
        'pa.il.ax',
        'piped-api.privacy.com.de',
        'api.piped.projectsegfau.lt',
        'pipedapi.in.projectsegfau.lt',
        'pipedapi.us.projectsegfau.lt',
        'watchapi.whatever.social',
        'api.piped.privacydev.net',
        'pipedapi.palveluntarjoaja.eu',
        'pipedapi.smnz.de',
        'pipedapi.adminforge.de',
        'pipedapi.qdi.fi',
        'piped-api.hostux.net',
        'pdapi.vern.cc',
        'pipedapi.pfcd.me',
        'pipedapi.frontendfriendly.xyz',
        'api.piped.yt',
        'pipedapi.astartes.nl',
        'pipedapi.osphost.fi',
        'pipedapi.simpleprivacy.fr',
        'pipedapi.drgns.space',
        'piapi.ggtyler.dev',
        'watchapi.pluto.lat'
    ]
}


if (typeof window != 'undefined') {

    let oldUserSettings = JSON.parse(
        localStorage.getItem('settings') ?? JSON.stringify(defaultSettings)
    )

    // Migrations from old settings styles to new
    if (typeof oldUserSettings.imageSize == 'string') {
        delete oldUserSettings.imageSize;
        oldUserSettings.imageSize = defaultSettings.imageSize;
    }

    userSettings.set({ ...defaultSettings, ...oldUserSettings })
}



userSettings.subscribe((settings) => {
  if (typeof window != 'undefined') {
    localStorage.setItem('settings', JSON.stringify(settings))
  }
})
