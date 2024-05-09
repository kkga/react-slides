import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import { u } from 'unist-builder'

function isHrElement(node) {
  return (
    node.type === 'element' &&
    'tagName' in node &&
    node.tagName === 'hr'
  )
}

const wrapSectionsPlugin = () => {
  return (tree) => {
    const sections = []
    let currentSection = []

    if (!('children' in tree)) {
      throw new Error('Expected a node with children')
    }

    tree.children.forEach((node) => {
      if (isHrElement(node)) {
        if (currentSection.length > 0) {
          // Wrap the current section in a <section> tag with additional properties
          sections.push(
            u(
              'element',
              {
                tagName: 'section',
                properties: {
                  className: ['slide'],
                  dataNumber: sections.length + 1,
                  id: sections.length + 1,
                },
              },
              currentSection
            )
          )
          currentSection = [] // Reset current section
        }
      } else {
        // Accumulate nodes into the current section
        currentSection.push(node)
      }
    })

    // Wrap and add the last section if it has any nodes
    if (currentSection.length > 0) {
      sections.push(
        u(
          'element',
          {
            tagName: 'section',
            properties: {
              className: ['slide'],
              dataNumber: sections.length + 1,
              id: sections.length + 1,
            },
          },
          currentSection
        )
      )
    }

    // Replace the original children with the new sections
    tree.children = sections
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

/** @type {import('rehype-pretty-code').Options} */
const options = {
  theme: 'vitesse-light',
  defaultLang: 'jsx',
  keepBackground: false,
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    experimental: {
      mdxRs: true,
    },
    remarkPlugins: [],
    rehypePlugins: [
      wrapSectionsPlugin,
      [rehypePrettyCode, options],
    ],
  },
})

export default withMDX(nextConfig)
