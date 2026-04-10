type JsonLdProps = {
  /** Optional id for the script element (useful if multiple graphs on one page). */
  id?: string
  data: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Renders schema.org JSON-LD. Safe for RSC: no client hooks.
 */
function jsonLdStringify(value: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")
}

export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdStringify(data) }}
    />
  )
}
