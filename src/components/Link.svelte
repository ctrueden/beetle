<script>
 import { base } from '$app/paths'

 export let path
 export let alt
</script>

<a href="{base}{path}"  alt="{alt}">
    <slot></slot>
</a>
