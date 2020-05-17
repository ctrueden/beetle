<script context="module">
 export function preload({ params, query }) {
     return this.fetch(process.env.BEETLE_API + '/item/').then(r => r.json()).then(items => {
         console.log(Object.keys(items))
	 return { items: items.items };
     });
 }
</script>

<script>
 export let items;
</script>

<style>
 ul {
     margin: 0 0 1em 0;
     line-height: 1.5;
 }
</style>

<svelte:head>
    <title>Item</title>
</svelte:head>

<h1>Recent items</h1>

<ul>
    {#each items as item}
	<!-- we're using the non-standard `rel=prefetch` attribute to
	     tell Sapper to load the data for the page as soon as
	     the user hovers over the link or taps it, instead of
	     waiting for the 'click' event -->
	<li><a rel='prefetch' href='item/{item.id}'>{item.title}</a></li>
	{/each}
</ul>
