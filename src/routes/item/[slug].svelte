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
     return text.replace(/\n/g, '<br/>')
 }
</script>

<svelte:head>
    <title>{item.album}</title>
</svelte:head>

<h1>{item.title}</h1>

<div class='content'>
    <ul>
        <li><strong>Album: </strong> <a href="/album/{item.album_id}">{item.album}</a></li>
        <li><strong>Artist: </strong> <a href="/artist/{item.mb_artistid}">{item.artist}</a></li>
        <li><strong>Date: </strong>{item.original_year}</li>
        <li><strong>MusicBrainz: </strong> <a href="https://musicbrainz.org/track/{item.mb_trackid}">{item.mb_albumid}</a></li>
    </ul>
    <PlaylistControllers items="{[item]}" />
    {#if item.lyrics}
    <h2>Paroles</h2>
    <p>{@html htmlLyrics(item.lyrics)}</p>
    {/if}
</div>


<style>
 /*
    By default, CSS is locally scoped to the component,
    and any unused styles are dead-code-eliminated.
    In this page, Svelte can't know which elements are
    going to appear inside the {{{item.html}}} block,
    so we have to use the :global(...) modifier to target
    all elements inside .content
  */
 .content :global(h2) {
     font-size: 1.4em;
     font-weight: 500;
 }

 .content :global(pre) {
     background-color: #f9f9f9;
     box-shadow: inset 1px 1px 5px rgba(0,0,0,0.05);
     padding: 0.5em;
     border-radius: 2px;
     overflow-x: auto;
 }

 .content :global(pre) :global(code) {
     background-color: transparent;
     padding: 0;
 }

 .content :global(ul) {
     line-height: 1.5;
 }

 .content :global(li) {
     margin: 0 0 0.5em 0;
 }
</style>

