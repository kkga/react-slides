import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(
  components: MDXComponents
): MDXComponents {
  return {
    grid: (props) => (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {props.children}
      </div>
    ),
    ...components,
  }
}
