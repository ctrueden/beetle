<script>
  import {getContext, onMount} from 'svelte'
  import { writable } from 'svelte/store'
  import utils from '../libs/playlist-utils'
  
  $: user = ''
  $: playlist = ''
  $: playlistName = utils.getPlaylistName({user, playlist})
  let beatingTO = null;
let hearth;
const playlistContext = getContext('playlist')

playlistContext.handleAppending = function() {
  hearth.style.fill = 'red'
  if (beatingTO)
    clearTimeout(beatingTO)
  beatingTO = setTimeout(() => {
     hearth.style.fill = null
  }, 300)
}

function handleAccount() {
  localStorage.setItem('account_user', user)
  localStorage.setItem('account_playlist', playlist)
  playlistContext.name.set(utils.getPlaylistName({user, playlist}))
}

onMount(() => {
  playlist = (localStorage.getItem('account_playlist') != null) ? localStorage.getItem('account_playlist') : ''
  user = (localStorage.getItem('account_user') != null) ? localStorage.getItem('account_user') : ''
  playlistContext.name.set(utils.getPlaylistName({user, playlist}))
})
</script>


<div class="account">
  <input type="checkbox" id="account-info" checked/>
  <label for="account-info">
  <svg viewBox="0 0 512 512" class="icon" >
  <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" stroke-miterlimit="10"></path><path d="M256 360a16 16 0 01-9-2.78c-39.3-26.68-56.32-45-65.7-56.41-20-24.37-29.58-49.4-29.3-76.5.31-31.06 25.22-56.33 55.53-56.33 20.4 0 35 10.63 44.1 20.41a6 6 0 008.72 0c9.11-9.78 23.7-20.41 44.1-20.41 30.31 0 55.22 25.27 55.53 56.33.28 27.1-9.31 52.13-29.3 76.5-9.38 11.44-26.4 29.73-65.7 56.41A16 16 0 01256 360z" bind:this="{hearth}"></path>
  </svg>
  </label>
  <div class="info" >
    <label>User:</label>
  <input type="text" name="user" bind:value="{user}" on:keyup="{handleAccount}"/><br/>
    <label>Playlist</label><br/>
    <input type="text" bind:value={playlist} on:keyup="{handleAccount}"/>
  <p>
    {#if playlistName}
       Editing <a href="/playlist/{playlistName}">{playlistName}</a>.
      {:else}
   Setting these information allows you to edit the playlist playlist@user.
    {/if}
    <label for="account-info" class="button">
      close
  </label>
  </p>
  </div>
</div>

<style>


#account-info:checked ~ .info {
  display: none;
}

label path:nth-of-type(2) {
    transition: fill 0.3s ease;
    fill: red;
}

#account-info:checked ~ label path {
    fill: white;
}

.account {
     display: flex;
     position: relative;
     justify-content: center;
     flex-basis: 2.2em;
     flex-shrink: 0;
 }
 .account .icon {
     display: flex;
     height: 2.2em;
     flex-basis: 2.2em;
}
.info {
   position: absolute;
   top: 2.2em;
   right: 0; 
   background-color: white;
   padding: 0.2em;
   border: 1px solid black;
}

input[type=checkbox] {
   display: none;
}

.button {
   font-weight: bold;
   text-decoration: underline;
}
</style>
