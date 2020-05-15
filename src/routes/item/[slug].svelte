<script context="module">
 export async function preload({ params, query }) {
     // the `slug` parameter is available because
     // this file is called [slug].svelte
     const res = await this.fetch(`https://k7.buron.coffee/api/item/${params.slug}`);

     const data = await res.json();
     if (res.status === 200) {
	 return { item: data };
     } else {
	 this.error(res.status, data.message);
     }
 }
</script>

<script>
 import PlaylistControllers from '../../components/PlaylistControllers.svelte'
 export let item;
 
 function htmlLyrics(text) {
     return text.replace(/[\n|\r]/g, '<br/>')
 }
</script>

<svelte:head>
    <title>{item.album}</title>
</svelte:head>

<header>
    <h1>{item.title}</h1>
    <ul>
        <li><strong>Album: </strong> <a href="/album/{item.album_id}">{item.album}</a></li>
        <li><strong>Artist: </strong> <a href="/artist/{item.mb_artistid}">{item.artist}</a></li>
        <li><strong>Date: </strong>{item.original_year}</li>
        <!-- <li><strong>MusicBrainz: </strong> <a href="https://musicbrainz.org/track/{item.mb_trackid}">{item.mb_albumid}</a></li> -->
    </ul>
    <PlaylistControllers items="{[item]}" />
</header>
{#if item.lyrics}
    <div class="lyrics">
        <h2>Paroles</h2>
        <p>{@html htmlLyrics(item.lyrics)}</p>
    </div>
{/if}


<style>
 .lyrics {
     margin-top: 2em;
 }
</style>

