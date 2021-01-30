<script>

 import AlbumList from './AlbumList.svelte'
 
 export let albumList

 let artistInfo = {}
 $: artistAlbums = albumList.reduce((res, alb) => {
     if (!res[alb.mb_albumartistid]) {
         res[alb.mb_albumartistid] = [alb]
         artistInfo[alb.mb_albumartistid] = {
             name: alb.albumartist,
             sname: alb.albumartist.normalize("NFD").toLowerCase(),
         }
     } else {
         res[alb.mb_albumartistid].push(alb)
     }
     
     return res
 }, {})

 import {onMount, beforeUpdate} from 'svelte'

</script>

<div>
    {#each Object.keys(artistAlbums).sort((a,b) =>  artistInfo[a].sname > artistInfo[b].sname) as artistId}
        <div class="artist">
            <h2 class="name">{artistInfo[artistId].name}</h2>
            <AlbumList albumList={artistAlbums[artistId]}/>
        </div>
    {/each}

</div>

<style>
 .artist {
     margin: 1em 0;
 }

 .artist {
     text-align: center;
 }
</style>
