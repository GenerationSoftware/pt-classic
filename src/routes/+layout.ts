export const prerender = true
export const ssr = false
export const trailingSlash = 'always'

export const load = ({ url }) => {
  return { pathname: url.pathname }
}
