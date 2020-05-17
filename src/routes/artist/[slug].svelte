<script context="module">
 export async function preload({ params, query }) {
     // the `slug` parameter is available because
     // this file is called [slug].svelte
     return this.fetch(process.env.BEETLE_API + `/item/query/mb_artistid::${params.slug}`)
                .then(r => r.json()).then(res => {
	            return { items: res.results };
                });
 }
</script>

<script>
 export let items;
 let artist = (items.length) ? items[0].artist : undefined

let albumOfTracks = function(items) {
     return Object.values(items.reduce((res, it) => {
         if (!res[it.album_id])  {
             res[it.album_id] = {
                 id: it.album_id,
                 album: it.album
             }
         }

         return res
     }, {}))
        }
                                       
         let albums = albumOfTracks(items.filter(it => it.mb_albumartistid == it.mb_artistid))

         let otherTracks = []
</script>

<svelte:head>
    <title>{artist}</title>
</svelte:head>

<h1>{artist}</h1>

<h2>Albums</h2>
<div class="cards">
    {#each albums as album}
	<!-- we're using the non-standard `rel=prefetch` attribute to
	     tell Sapper to load the data for the page as soon as
	     the user hovers over the link or taps it, instead of
	     waiting for the 'click' event -->
	<div class="card">
            <a rel='prefetch' href='album/{album.id}'>
                <img class="poster" src="{process.env.BEETLE_API}/album/{album.id}/art" alt="{album.album} cover" />
                <p>{album.album}</p>
            </a>
        </div>
    {/each}
</div>

{#if otherTracks.length}
    <h2>Autre Morceaux</h2>
    <ul>
        {#each otherTracks as item}
            <li><a href="/item/{item.id}">{item.title}</a></li>
        {/each}
    </ul>
{/if}
<style>
 .cards {
     display: flex;
     align-items: baseline;
     justify-content: center;
     flex-wrap: wrap;
     max-width: 70em;
     margin: auto;
 }

 .cards .card {
     min-width: 14em;
     min-height: 18em;
     margin: 1em;
     width: 15em;
     text-align: center;
 }

 .poster {
     border: 1px rgba(255,255,255,.3) solid;
     width: 100%;
 }

 .card p {
     margin: 0.1em;
 }
</style>
