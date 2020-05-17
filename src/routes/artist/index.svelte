<script context="module">
 export function preload({ params, query }) {
     return this.fetch(process.env.BEETLE_API + '/album/').then(r => r.json()).then(albums => {
	 return { albums: albums.albums };
     });
 }
</script>

<script>
 export let albums;

 const initialAlbums = albums
 
 function search(query) {
     return fetch(process.env.BEETLE_API + '/album/query/' + query)
         .then(r => r.json())
         .then(res => {
             console.log(res)
             const results = res.results
	     albums = results
         });
 }

 function init() {
     albums = initialAlbums
 }
 
 function handleSearch(event) {
     const query = document.querySelector('#query').value
     if (query) {
         return search(query)
     } else {
         return init()
     }
 }

</script>

<svelte:head>
    <title>Album</title>
</svelte:head>

<h1>Albums</h1>
<nav>
    <form on:submit|preventDefault="{handleSearch}">
        <input id="query" name="query" placeholder="query" value="">
        <label for="query" class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M337.509 305.372h-17.501l-6.571-5.486c20.791-25.232 33.922-57.054 33.922-93.257C347.358 127.632 283.896 64 205.135 64 127.452 64 64 127.632 64 206.629s63.452 142.628 142.225 142.628c35.011 0 67.831-13.167 92.991-34.008l6.561 5.487v17.551L415.18 448 448 415.086 337.509 305.372zm-131.284 0c-54.702 0-98.463-43.887-98.463-98.743 0-54.858 43.761-98.742 98.463-98.742 54.7 0 98.462 43.884 98.462 98.742 0 54.856-43.762 98.743-98.462 98.743z"></path></svg>
        </label>
    </form>
</nav>
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

 .icon {
     align-self: center;
 }

 .icon svg {
     fill: currentColor;
     height: 1em;
     width: 1em;
     top: .125em;
     position: relative;
 }

</style>
