<script>
 import PlaylistControllers from '../../../components/PlaylistControllers.svelte'
 import TrackList from '../../../components/TrackList.svelte'
 export let data
 let name = data.name
 let tracklist = data.tracklist

</script>

<svelte:head>
    <title>{name}</title>
</svelte:head>

<header>
    <h1 class="album">{name}</h1>
    <div class="controls-wrapper">
        <PlaylistControllers items={tracklist} />
    </div>

</header>

<div class="tracks">
    <h2>Pistes</h2>
    <TrackList tracklist="{tracklist}" />
</div>
