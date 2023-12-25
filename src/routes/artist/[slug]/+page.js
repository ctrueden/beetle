import { env } from '$env/dynamic/public'

export async function load({ fetch, params }) {
  return fetch(env.BEETLE_API + `/item/query/mb_artistid:${params.slug}`)
    .then(r => r.json()).then(res => {
      return { items: res.results };
    });
}
