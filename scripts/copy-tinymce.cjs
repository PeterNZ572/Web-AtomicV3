const { cpSync, existsSync } = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'node_modules', 'tinymce')
const dest = path.join(__dirname, '..', 'public', 'tinymce')

if (!existsSync(dest)) {
  cpSync(src, dest, { recursive: true })
  console.log('TinyMCE copied to public/tinymce')
} else {
  console.log('TinyMCE already exists at public/tinymce')
}
