// import { env } from '$env/dynamic/public'
// console.log('env : ' + JSON.stringify(env))
// import { BEETLE_API, BEETLE_FILES_URL, BEETLE_FILES_DIR } from '$env/dynamic/public'
import { env } from '$env/dynamic/public'
const FILES_URL = env.BEETLE_FILES_URL
const FILES_DIR = env.BEETLE_FILES_DIR
const IS_FILES_ACCESS_ENABLED = FILES_DIR !== undefined && FILES_URL !== undefined

export default function (item) {
  // if the file access is not enabled
  // we rely on the beet web api, which do not support partial file
  if (IS_FILES_ACCESS_ENABLED &&
      item.path &&
      item.path.indexOf(FILES_DIR) === 0) {
    const relativePath = item.path.slice(FILES_DIR.length)
    const separator = (relativePath[0] === '/' || FILES_URL[FILES_URL.length - 1] === '/') ? '' : '/'

    return FILES_URL + separator + relativePath
  } else {
    return env.BEETLE_API_CLIENT + '/item/' + item.id + '/file'
  }
}
