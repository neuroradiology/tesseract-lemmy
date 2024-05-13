import { type GetSiteResponse, LemmyHttp } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { profile, profileData } from '$lib/auth.js'
import { error } from '@sveltejs/kit'
import { LINKED_INSTANCE_URL, instance } from '$lib/instance.js'

export interface BlockInstanceResponse {
    blocked: boolean
}

// Override Lemmy's stupid cache on the goddamned only endpoint that will return the user profile
async function customFetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
    if (init) init.cache = 'no-store'
    else init = { cache: 'no-store'}
    
    const res = await fetch(input, init)
    if (!res.ok) throw error(res.status, await res.text())
    return res
}


export function getClient(instanceURL?: string, jwt?:string): LemmyHttp {
    if (!instanceURL)   instanceURL = get(instance)
    
    try { if (!jwt && instanceURL == get(instance)) jwt = get(profile)?.jwt }
    catch { jwt = '' }

    const headers = {
        Authorization: jwt ? `Bearer ${jwt}` : ''
    }

    return new LemmyHttp(`https://${instanceURL}`, 
        {
            fetchFunction: (input: RequestInfo | URL, init: RequestInit | undefined) => customFetch(input, init),
            headers: headers
        }
    )
}

export const getInstance = () => get(instance)

export const site = writable<GetSiteResponse | undefined>(undefined)

export async function validateInstance(instance: string, setSite:boolean=false): Promise<boolean> {
    if (instance == '') return false
    try {
        let siteData = await getClient(instance).getSite()
        // Optionally 
        if (setSite) {
            site.set(siteData);
        }
        return true
    } catch (err) {
        return false
    }
}


export async function blockInstance(instance_id: number, block:boolean = false): Promise<BlockInstanceResponse> {
    if (!instance_id || !get(profile)?.jwt) return { blocked: !block }

    try {
        const body = {
            instance_id: instance_id,
            block: block
        }
        const response = await fetch(`https://${get(instance)}/api/v3/site/block`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${get(profile)?.jwt}`,
                },
                body: JSON.stringify(body)
            }
        )

        if (response.ok)    return { blocked: block }
        else                return { blocked: !block }
    }
    catch (err) {
        console.log(err)
        return { blocked: !block }
    }
}

export async function hideCommunity(communityID:number, hidden:boolean, reason:string = '') {
    if (!communityID || !get(profile)?.jwt) return

    try {
        const body = {
            community_id: communityID,
            auth: get(profile)?.jwt,
            hidden: hidden,
            reason: reason
        }
        const response = await fetch(`https://${get(instance)}/api/v3/community/hide`,
            {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${get(profile)?.jwt}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            }
        )

        const json = await response.json();
        
        if (response.status != 200) {
            throw new Error(
                `${
                    (await response.text().catch((_) => undefined)) ??
                    'Failed to hide community'
                }: ${response.status}: ${response.statusText}`
            )
        }

        return
    } 
    catch {
        throw new Error(
            `API call failed`
        )
    }

    


}


export async function uploadImage(image: File | null | undefined): Promise<string | undefined> {
    if (!image || !get(profile)?.jwt) return
    
    const formData = new FormData()
    formData.append('images[]', image)

    const response = await fetch(
        `${window.location.origin}/cors/${getInstance()}/pictrs/image?`,
        {
            method: 'POST',
            body: formData,
            headers: { 'Authorization': `Bearer ${get(profile)?.jwt}`}
        }
    )

    const json = await response.json()

    if (json.msg == 'ok') {
        return `https://${get(profile)?.instance}/pictrs/image/${
            json.files?.[0]?.file
        }`
    }

    throw new Error(
        `${
            (await response.text().catch((_) => undefined)) ??
            'Failed to upload image'
        }: ${response.status}: ${response.statusText}`
    )
}


export let sortOptions:string[] = [
    'Active',
    'Scaled',
    'Hot',
    'New',
    'Old',
    'TopAll',
    'TopNineMonths',
    'TopSixMonths',
    'TopThreeMonths',
    'TopMonth',
    'TopWeek',
    'TopDay',
    'TopTwelveHour',
    'TopSixHour',
    'TopHour',
    'MostComments',
    'NewComments',
];

export let sortOptionNames:string[] = [
    'Active',
    'Scaled',
    'Hot',
    'New',
    'Old',
    'Top All',
    'Top 9 Months',
    'Top 6 Months',
    'Top 3 Months',
    'Top Month',
    'Top Week',
    'Top Day',
    'Top 12 Hour',
    'Top 6 Hour',
    'Top Hour',
    'Most Comments',
    'New Comments',
];

// Set the current site
/*
getClient(LINKED_INSTANCE_URL ? LINKED_INSTANCE_URL : getInstance())
    .getSite()
    .then((s) => {
            site.set(s)
        }
    )
*/