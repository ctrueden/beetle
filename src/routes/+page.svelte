<script>
 export let data

 import AlbumList from '../components/AlbumList.svelte'
</script>

<svelte:head>
    <title>Beetle</title>
</svelte:head>

<h2>Recent Albums</h2>

<AlbumList albumList={data.albums} />
