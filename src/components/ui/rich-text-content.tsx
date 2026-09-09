import type { ReactNode } from 'react'

import { cn, isObject } from '../../lib/utils'

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  format?: number | string
  url?: string
  fields?: {
    url?: string
    newTab?: boolean
  }
  children?: LexicalNode[]
}

const textWithMarks = (node: LexicalNode, key: number) => {
  let content: ReactNode = node.text || null

  if (typeof node.format === 'number') {
    if (node.format & 1) content = <strong key={`${key}-b`}>{content}</strong>
    if (node.format & 2) content = <em key={`${key}-i`}>{content}</em>
    if (node.format & 8) content = <u key={`${key}-u`}>{content}</u>
    if (node.format & 16) content = <code key={`${key}-c`}>{content}</code>
  }

  return <>{content}</>
}

export const RichTextContent = ({
  content,
  className,
  dark = false,
}: {
  content: unknown
  className?: string
  dark?: boolean
}) => {
  if (!isObject(content) || !isObject(content.root) || !Array.isArray(content.root.children)) {
    return null
  }

  const renderNode = (node: LexicalNode, key: number): ReactNode => {
    const renderChildren = (children?: LexicalNode[]) => children?.map((child, index) => renderNode(child, index)) ?? null

    switch (node.type) {
      case 'heading': {
        const tag = node.tag || 'h2'
        const sizeClassName = tag === 'h3' ? 'text-2xl' : 'text-4xl'
        const children = renderChildren(node.children)

        if (tag === 'h3') {
          return (
            <h3 key={key} className={cn('font-heading font-semibold', dark ? 'text-white' : 'text-brand-dark', sizeClassName)}>
              {children}
            </h3>
          )
        }

        return (
          <h2 key={key} className={cn('font-heading font-semibold', dark ? 'text-white' : 'text-brand-dark', sizeClassName)}>
            {children}
          </h2>
        )
      }
      case 'paragraph':
        return (
          <p key={key} className={cn('text-base leading-8', dark ? 'text-white/80' : 'text-brand-gunmetal')}>
            {renderChildren(node.children)}
          </p>
        )
      case 'quote':
        return (
          <blockquote key={key} className={cn('border-l-4 pl-6 text-xl font-medium', dark ? 'border-brand-green text-white' : 'border-brand-blue text-brand-dark')}>
            {renderChildren(node.children)}
          </blockquote>
        )
      case 'list':
        return node.tag === 'ol' ? (
          <ol key={key} className={cn('list-decimal space-y-2 pl-6', dark ? 'text-white/80' : 'text-brand-gunmetal')}>
            {renderChildren(node.children)}
          </ol>
        ) : (
          <ul key={key} className={cn('list-disc space-y-2 pl-6', dark ? 'text-white/80' : 'text-brand-gunmetal')}>
            {renderChildren(node.children)}
          </ul>
        )
      case 'listitem':
        return <li key={key}>{renderChildren(node.children)}</li>
      case 'link': {
        const href = node.fields?.url || node.url || '#'

        return (
          <a
            key={key}
            href={href}
            target={node.fields?.newTab ? '_blank' : undefined}
            rel={node.fields?.newTab ? 'noreferrer' : undefined}
            className={cn('font-medium underline decoration-brand-blue/40 underline-offset-4', dark ? 'text-brand-green' : 'text-brand-blue')}
          >
            {renderChildren(node.children)}
          </a>
        )
      }
      case 'linebreak':
        return <br key={key} />
      case 'text':
        return <span key={key}>{textWithMarks(node, key)}</span>
      default:
        return <span key={key}>{renderChildren(node.children)}</span>
    }
  }

  return <div className={cn('space-y-6', className)}>{(content.root.children as LexicalNode[]).map((node, index) => renderNode(node, index))}</div>
}
