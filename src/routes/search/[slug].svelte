<script context="module">
 export function preload({ params, query }) {

     const p = Promise.all([
         this.fetch('https://k7.buron.coffee/api/album/query/' + params.slug).then(r => r.json()),
         this.fetch('https://k7.buron.coffee/api/item/query/' + params.slug).then(r => r.json())
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

 
</script>

<svelte:head>
    <title>Résultat pour "{query}"</title>
</svelte:head>

<h1>Résultat pour "{query}"</h1>

{#if albums.length}
<h2>Albums</h2>
<AlbumList albumList={albums} />
{/if}

{#if items.length}
    <h2>Pistes</h2>
    {#each items as item}
        <Item item="{item}"/>
    {/each}
{/if}

