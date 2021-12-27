<script>
 export let genreString
 let genreList = genreString.split(',').map(g => g.trim())
</script>

<ul>
    {#each genreList as genre}
        <li><a href="./genre/{genre}">{genre}</a></li>
    {/each}
</ul>

<style>
 ul {
     margin:0;
     padding: 0;
 }

 li {
     display: inline-block;
     padding: 0 .5em;
 }

 li:before {
     content: '#';
 }
</style>
