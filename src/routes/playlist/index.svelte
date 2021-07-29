<script context="module">

 export function preload({ params, query }) {
     const playlists = (process.env.BEETLE_PLAYLISTS !== undefined) ? process.env.BEETLE_PLAYLISTS.split(",").map(s => s.trim()) : ""
     return Promise.resolve({playlists: playlists})
 }
</script>

<script>
 export let playlists;
</script>

<svelte:head>
    <title>Playlists - Beetle</title>
</svelte:head>

<h2>Playlists</h2>

<ul>
{#each playlists as name}
    <li>
        <a href="/playlist/{name}">{name}</a>
    </li>
{/each}
</ul>
