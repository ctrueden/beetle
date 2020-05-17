<script context="module">
 export async function preload({ params, query }) {
     // the `slug` parameter is available because
     // this file is called [slug].svelte
     const res = await this.fetch(process.env.BEETLE_API + `/album/${params.slug}?expand`);

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
        <img class="cover" src="{process.env.BEETLE_API}/album/{album.id}/art" alt="{album.album} cover" />
    <h1 class="album">{album.album}</h1>
    <h2 class="artist"><a href="/artist/{album.mb_albumartistid}">{album.albumartist}</a></h2>

    <p class="year">{album.original_year}</p>
    <div class="controls-wrapper">
        <PlaylistControllers items={album.items} />
    </div>
</header>

<div class="tracks">
    <h2>Pistes</h2>
    <div class="tracklist">
        {#each album.items.sort((a,b) => b.track < a.track) as item}
            <div class="track">
                <div class="first-wrapper">
                    <div class="number">
                        {item.track}
                    </div>
                    <div class="controls-wrapper">
                        <PlaylistControllers items={[item]} />
                    </div>
                </div>
                <div class="item-wrapper">
                    <Item item="{item}"/>
                </div>
            </div>
        {/each}
    </div>
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

 .track {
     display: flex;
     align-content: baseline;
     width: 100%;
     border-bottom: 1px solid gray;
 }

 .track:last-child {
     border-bottom: none;
 }

 .track .first-wrapper {
     display: flex;
     flex-basis: 4em;
     flex-grow: 0;
     flex-shrink: 0;
     align-items: stretch;
 }

 .track .number {
     display: flex;
     color: white;
     flex-grow: 1;
     background-color: black;
     font-weight: bold;
     align-items:  center;
     justify-content: center;
 }

 .track:hover .number {
     display: none;
 }

 .track .controls-wrapper {
     display:none;
 }

 .track:hover .controls-wrapper {
     display: flex;
     align-items:  center;
     justify-content: center;
 }

 .track .item-wrapper {
     flex-grow: 1;
 }

 .item-wrapper {
     padding: 0 1em;
 }
</style>
