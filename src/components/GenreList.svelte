<script>
 export let genreString

 import Link from './Link.svelte'
 
 $: genreList = genreString.split(',').map(g => g.trim())
</script>

<ul>
    {#each genreList as genre}
        <li>
            <Link path="/genre/{genre}">{genre}</Link>
        </li>
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
