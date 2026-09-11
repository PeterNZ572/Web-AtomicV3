'use client'

import { useField } from '@payloadcms/ui'
import { Editor } from '@tinymce/tinymce-react'

type Props = {
  path: string
  field?: { label?: string; required?: boolean }
}

export const TinyMCEField = ({ path, field }: Props) => {
  const { value, setValue } = useField<string>({ path })

  return (
    <div className="field-type">
      {field?.label && (
        <label className="field-label" style={{ display: 'block', marginBottom: 8 }}>
          {field.label}
          {field?.required ? <span className="required"> *</span> : null}
        </label>
      )}
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        value={value || ''}
        onEditorChange={(content) => setValue(content)}
        init={{
          height: 480,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount',
          ],
          toolbar:
            'code | undo redo | blocks | bold italic underline strikethrough | ' +
            'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image media table | removeformat | fullscreen help',
          skin: 'oxide-dark',
          content_css: 'dark',
          promotion: false,
          branding: false,
          resize: true,

          // Several pages are hand-authored HTML with their own <style> block.
          // TinyMCE's default HTML5 schema strips <style> from the body and
          // rewrites markup it considers invalid, so opening such a page and
          // saving silently destroyed the layout. Everything below turns the
          // editor into a faithful round-tripper instead of a sanitiser.
          valid_elements: '*[*]',
          extended_valid_elements: 'style[*],svg[*],path[*],use[*]',
          valid_children: '+body[style],+div[style]',
          verify_html: false,
          cleanup: false,
          entity_encoding: 'raw',
          convert_urls: false,
          // Hide <style> blocks behind a placeholder so their contents are
          // passed through byte-for-byte and can't be edited by accident.
          protect: [/<style[\s\S]*?<\/style>/g],
        }}
      />
    </div>
  )
}
