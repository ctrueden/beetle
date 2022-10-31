<script>
 import AlbumArtistList from '../../../components/AlbumArtistList.svelte'
 import AlbumIndex from '../../../components/AlbumIndex.svelte'
 export let data
 $: albums = data.albums
 $: selectionName = data.selectionName

</script>

<svelte:head>
    <title>Album</title>
</svelte:head>

<h1>Artists</h1>

<AlbumIndex selectionName={selectionName} />

<AlbumArtistList albumList={albums}/>

<AlbumIndex selectionName={selectionName} />

<style>

</style>
