<script>
 export let data
 let albums = data.albums
 let genre = data.genre

 import AlbumList from '../../../components/AlbumList.svelte'

</script>

<svelte:head>
    <title>{genre} - Beetle</title>
</svelte:head>

<h2>Albums: #{genre}</h2>

<AlbumList albumList={albums} />
