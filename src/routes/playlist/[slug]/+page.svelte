<script>
 import ControlerSet from '../../../components/ControlerSet.svelte'
 import TrackList from '../../../components/TrackList.svelte'
 export let data
 $: name = data.name
 $: tracklist = data.tracklist

</script>

<svelte:head>
    <title>{name}</title>
</svelte:head>

<header>
    <h1 class="album">{name}</h1>
    <div class="controls-wrapper">
        <ControlerSet items={tracklist} />
    </div>

</header>

<div class="tracks">
    <h2>Pistes</h2>
    <TrackList tracklist="{tracklist}" />
</div>
