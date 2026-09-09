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
        }}
      />
    </div>
  )
}
