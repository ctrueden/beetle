import { env } from '$env/dynamic/public'

export function load({ fetch, params }) {

  const p = Promise.all([
    fetch(env.BEETLE_API + '/album/query/' + params.slug).then(r => r.json()),
    fetch(env.BEETLE_API + '/item/query/' + params.slug).then(r => r.json())
  ])
  
  return p.then(answers => {
    return {
      albums: answers[0].results,
      items: answers[1].results,
      query: params.slug
    };
  });
}
