<script>
 import { env } from '$env/dynamic/public'
 import PlaylistControllers from '../../../components/PlaylistControllers.svelte'
 import TrackList from '../../../components/TrackList.svelte'
 import GenreList from '../../../components/GenreList.svelte'
 import Link from '../../../components/Link.svelte'

 export let data
 let {album} = data
</script>

<svelte:head>
    <title>{album.album}</title>
</svelte:head>

<header>
    <img class="cover" src="{env.BEETLE_API}/album/{album.id}/art" alt="{album.album} cover" />
    <h1 class="album">{album.album}</h1>
    <h2 class="artist"><Link path="/artist/{album.mb_albumartistid}">{album.albumartist}</Link></h2>

    <p class="year">{album.original_year}</p>
    <GenreList genreString="{album.genre}" />
    <div class="controls-wrapper">
        <PlaylistControllers items={album.items} />
    </div>
</header>

<div class="tracks">
    <h2>Pistes</h2>
    <TrackList tracklist="{album.items.sort((a,b) => b.track < a.track)}" />
</div>

<style>

    header {
    text-align: center;
    }

    .cover {
    margin-bottom: 1.7em;
    box-shadow: 10px 10px 5px gray;
    max-width: 15em;
    }
    
    header .controls-wrapper {
    text-align: center;
    }

    .album {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: .3em;
    }
    
    .artist {
    font-size: 1.5em;
    margin-bottom: .2em;
    }

    .year {
    margin-top: 0;
    }
    
    .tracks {
    margin-top: 2em;
    }

</style>
