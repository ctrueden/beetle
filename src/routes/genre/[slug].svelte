<script context="module">
 export async function preload({ params, query }) {
     // the `slug` parameter is available because
     // this file is called [slug].svelte
     return this.fetch(process.env.BEETLE_API + `/album/query/genre::${params.slug}`)
                .then(r => r.json()).then(res => {
	            return {
                        genre: params.slug,
                        albums: res.results
                    };
                });
 }
</script>

<script>
 export let albums;
 export let genre;

 import AlbumList from '../../components/AlbumList.svelte'

</script>

<svelte:head>
    <title>{genre} - Beetle</title>
</svelte:head>

<h2>Albums: #{genre}</h2>

<AlbumList albumList={albums} />
