<script>
 import { env } from '$env/dynamic/public'
 import ControlerSet from '../../../components/ControlerSet.svelte'
 import TrackList from '../../../components/TrackList.svelte'
 import GenreList from '../../../components/GenreList.svelte'
 import Link from '../../../components/Link.svelte'

 export let data
 $: album = data.album
</script>

<svelte:head>
    <title>{album.album}</title>
</svelte:head>

<header>
    <img class="cover" src="{env.BEETLE_API_CLIENT}/album/{album.id}/art" alt="{album.album} cover" />
    <h1 class="album">{album.album}</h1>
    <h2 class="artist"><Link path="/artist/{album.mb_albumartistid}">{album.albumartist}</Link></h2>

    <p class="year">{album.original_year}</p>
    <GenreList genreString="{album.genre}" />
    <div class="controls-wrapper">
        <ControlerSet items={album.items} />
    </div>
</header>

<div class="tracks">
    <h2>Tracks</h2>
    <TrackList tracklist="{album.items.sort((a,b) => a.disc - b.disc || a.track - b.track)}" />
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
    margin-top: 1em;
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
    margin-top: 1em;
    }

</style>
