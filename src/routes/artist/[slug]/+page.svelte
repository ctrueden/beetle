<script>
 export let data
 import { env } from '$env/dynamic/public'
 import AlbumList from '../../../components/AlbumList.svelte'
 import Link from '../../../components/Link.svelte'
 let items = data.items
 let artist = (items.length) ? items[0].artist : undefined

 let albumOfTracks = function(items) {
     return Object.values(items.reduce((res, it) => {
         if (!res[it.album_id])  {
             res[it.album_id] = {
                 id: it.album_id,
                 album: it.album
             }
         }

         return res
     }, {}))
 }
 
 let albums = albumOfTracks(items.filter(it => (it.mb_albumartistid == it.mb_artistid) && it.album_id))

 let otherTracks = items.filter(it => (it.mb_albumartistid != it.mb_artistid) || !it.album_id)
</script>

<svelte:head>
    <title>{artist}</title>
</svelte:head>

<h1>{artist}</h1>

{#if albums.length != 0}
    <h2>Albums</h2>
    <AlbumList albumList="{albums}"/>
{/if}

{#if otherTracks.length}
    <h2>Other tracks</h2>
    <ul>
        {#each otherTracks as item}
            <li><Link path="/item/{item.id}">{item.title}</Link></li>
        {/each}
    </ul>
{/if}

