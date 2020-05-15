<script context="module">
 export async function preload({ params, query }) {
     // the `slug` parameter is available because
     // this file is called [slug].svelte
     const res = await this.fetch(`https://k7.buron.coffee/api/album/${params.slug}?expand`);

     const data = await res.json();
     if (res.status === 200) {
	 return { album: data };
     } else {
	 this.error(res.status, data.message);
     }
 }
</script>

<script>
 import PlaylistControllers from '../../components/PlaylistControllers.svelte'
 import Item from '../../components/Item.svelte'
 export let album;
</script>

<svelte:head>
    <title>{album.album}</title>
</svelte:head>

<header>
    <h1>{album.album}</h1>
    <h2><a href="/artist/{album.mb_albumartistid}">{album.albumartist}</a></h2>

    <img class="cover" src="https://k7.buron.coffee/api/album/{album.id}/art" alt="{album.album} cover" />
    <ul class="details">
        <li><strong>Date: </strong>{album.original_year}</li>
        <li><strong>MusicBrainz: </strong> <a href="https://musicbrainz.org/release/{album.mb_albumid}">{album.mb_albumid}</a></li>
    </ul>
    <PlaylistControllers items={album.items} />
</header>

<div class="tracks">
    <h2>Pistes</h2>

    <ol>
        {#each album.items as item}
            <li><Item item="{item}"/></li>
        {/each}
    </ol>
</div>

<style>
 .details {
     display: inline-block;
 }
 .cover {
     max-width: 20em;
 }
</style>
