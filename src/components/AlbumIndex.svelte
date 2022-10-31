<script>
 export let selectionName
 import Link from './Link.svelte'
</script>

<ul class="index">
    {#each "abcdefghijklmnopqrstuvwxyz#".split("") as letter}
        <li class="letter" aria-current='{(selectionName === letter.toUpperCase()) ? "page" : undefined}'>
            <Link path="/artistIndex/{encodeURIComponent(letter)}" >{letter.toUpperCase()}</Link>
        </li>
    {/each}
</ul>

<style>

 .index {
     text-align: center;
     margin: 2em 0;
 }

 .letter {
     display: inline-block;
     font-size: 1.5em;
     width: 1em;
 }

 [aria-current] {
     font-weight: bold;
     position: relative;
     display: inline-block;
 }

 [aria-current]::after {
     position: absolute;
     content: '';
     width: 100%;
     height: 2px;
     background-color: rgb(255,62,0);
     display: block;
     bottom: -1px;
 }

</style>
