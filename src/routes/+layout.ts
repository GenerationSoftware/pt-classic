export const prerender = true
export const ssr = false

export const load = ({ url }) => {
  return { pathname: url.pathname }
}
