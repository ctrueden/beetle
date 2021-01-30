<script context="module">
 export function preload({ params, query }) {
     return this.fetch(process.env.BEETLE_API + '/album/query/added-').then(r => r.json()).then(albums => {
	 return { albums: albums.results };
     });
 }
</script>

<script>
 export let albums;

 import AlbumList from '../components/AlbumList.svelte'

</script>

<svelte:head>
    <title>Beetle</title>
</svelte:head>

<h2>Recent Albums</h2>

<AlbumList albumList={albums} />
