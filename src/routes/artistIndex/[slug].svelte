<script context="module">
 export function preload({ params, query }) {

     const selectionName = params.slug[0].toUpperCase()
     
     const selections = {
         "#": "[^A-Z]"
     }

     var alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
     for (let letter of alphabet) {
         selections[letter.toUpperCase()] = '(' + letter + '|' + letter.toUpperCase() + ')'
     }
     
     return this.fetch(process.env.BEETLE_API + '/album/query/albumartist_sort::^'+ selections[selectionName])
                .then(r => r.json())
                .then(albums => {
	            return {
                        albums: albums.results,
                        selectionName: selectionName
                    };
                });
 }
</script>

<script>
 import AlbumArtistList from '../../components/AlbumArtistList.svelte'
 import AlbumIndex from '../../components/AlbumIndex.svelte'
 export let albums;
 export let selectionName;

 const initialAlbums = albums

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
