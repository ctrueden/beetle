<script context="module">
</script>

<script>
 export let data
 $: albums = data.albums
 $: items = data.items
 $: query = data.query

 import AlbumList from '../../../components/AlbumList.svelte'
 import Item from '../../../components/Item.svelte'
 import PlaylistControllers from '../../../components/PlaylistControllers.svelte'
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

