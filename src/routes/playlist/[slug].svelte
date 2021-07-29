<script context="module">
 export async function preload({ params, query }) {
     // the `slug` parameter is available because
     // this file is called [slug].svelte
     const url = process.env.BEETLE_API + `/item/query/playlist:${params.slug}`
     const res = await this.fetch(url);

     const data = await res.json();
     if (res.status === 200) {
	 return {
             tracklist: data.results,
             name: params.slug
         };
     } else {
	 this.error(res.status, data.message);
     }
 }
</script>

<script>
 import PlaylistControllers from '../../components/PlaylistControllers.svelte'
 import TrackList from '../../components/TrackList.svelte'
 export let name;
 export let tracklist;

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
