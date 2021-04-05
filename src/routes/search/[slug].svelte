<script context="module">
 export function preload({ params, query }) {

     const p = Promise.all([
         this.fetch(process.env.BEETLE_API + '/album/query/' + params.slug).then(r => r.json()),
         this.fetch(process.env.BEETLE_API + '/item/query/' + params.slug).then(r => r.json())
     ])
     
     return p.then(answers => {
	 return {
             albums: answers[0].results,
             items: answers[1].results,
             query: params.slug
         };
     });
 }
</script>

<script>
 export let albums
 export let items
 export let query

 import AlbumList from '../../components/AlbumList.svelte'
 import Item from '../../components/Item.svelte'
 import PlaylistControllers from '../../components/PlaylistControllers.svelte'
</script>

<svelte:head>
    <title>Results for "{query}"</title>
</svelte:head>

<h1>Results for "{query}"</h1>

{#if albums.length}
    <h2>Albums</h2>
    <AlbumList albumList={albums} />
{/if}


{#if items.length}
    <div class="controls-wrapper">
        <PlaylistControllers items={items} />
    </div>
    <h2>Pistes</h2>
    {#each items as item}
        <Item item="{item}"/>
    {/each}
{/if}

