<script>
 export let data
 let playlists = data.playlists
 import Link from '../../components/Link.svelte'

</script>

<svelte:head>
    <title>Playlists - Beetle</title>
</svelte:head>

<h2>Playlists</h2>

<ul>
{#each playlists as name}
    <li>
        <Link path="/playlist/{name}">{name}</Link>
    </li>
{/each}
</ul>
