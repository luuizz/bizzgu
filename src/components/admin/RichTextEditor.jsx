import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extensions'
import {
    ArrowArcLeft,
    ArrowArcRight,
    Image as ImageIcon,
    LinkSimple,
    LinkBreak,
    ListBullets,
    ListNumbers,
    Minus,
    Paragraph,
    Quotes,
    TextB,
    TextHTwo,
    TextHThree,
    TextItalic,
    TextStrikethrough,
    TextUnderline,
} from '@phosphor-icons/react'
import { Button, Input, Spinner } from '../ui'
import { useToast } from '../../hooks/useToast'
import { canUploadImages, uploadImage } from '../../services/admin'
import { PostContentStyles } from '../blog/PostContentStyles'

const MAX_SIZE = 4 * 1024 * 1024

// Editor visual (tipo Word) dos posts do blog. Entrega HTML em onChange.
export function RichTextEditor({ value, onChange, placeholder = 'Escreva o post...' }) {
    const toast = useToast()
    const fileRef = useRef(null)
    const [panel, setPanel] = useState(null) // 'link' | 'image' | null
    const [url, setUrl] = useState('')
    const [uploading, setUploading] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                codeBlock: false,
                // Sem target/rel fixos: a loja decide (externos em nova aba, internos na mesma)
                link: { openOnClick: false, autolink: true, defaultProtocol: 'https', HTMLAttributes: { target: null, rel: null } },
            }),
            Image.configure({ HTMLAttributes: { loading: 'lazy' } }),
            Placeholder.configure({ placeholder }),
        ],
        content: value || '',
        onUpdate: ({ editor: current }) => onChange(current.isEmpty ? '' : current.getHTML()),
    })

    // Estado dos botões (ativo/desativado) atualizado a cada mudança de seleção
    const state = useEditorState({
        editor,
        selector: ({ editor: current }) => (current ? {
            paragraph: current.isActive('paragraph'),
            h2: current.isActive('heading', { level: 2 }),
            h3: current.isActive('heading', { level: 3 }),
            bold: current.isActive('bold'),
            italic: current.isActive('italic'),
            underline: current.isActive('underline'),
            strike: current.isActive('strike'),
            bullet: current.isActive('bulletList'),
            ordered: current.isActive('orderedList'),
            quote: current.isActive('blockquote'),
            link: current.isActive('link'),
            canUndo: current.can().undo(),
            canRedo: current.can().redo(),
        } : {}),
    })

    // Conteúdo carregado depois (edição de post existente)
    useEffect(() => {
        if (editor && value !== undefined && value !== editor.getHTML() && !editor.isFocused) {
            editor.commands.setContent(value || '', { emitUpdate: false })
        }
    }, [editor, value])

    if (!editor) return null
    const chain = () => editor.chain().focus()

    const openLink = () => {
        setUrl(editor.getAttributes('link').href || '')
        setPanel(panel === 'link' ? null : 'link')
    }
    const applyLink = () => {
        const href = url.trim()
        if (!href) chain().extendMarkRange('link').unsetLink().run()
        else if (!/^(https?:\/\/|\/|mailto:)/i.test(href)) return toast.show('Use https://..., um caminho da loja (/categoria/...) ou mailto:', 'danger')
        else chain().extendMarkRange('link').setLink({ href }).run()
        setPanel(null)
        setUrl('')
    }
    const applyImageLink = () => {
        const src = url.trim()
        if (!/^https?:\/\/\S+$/i.test(src)) return toast.show('Cole um link de imagem que comece com https://', 'danger')
        chain().setImage({ src }).run()
        setPanel(null)
        setUrl('')
    }
    const handleFile = async (file) => {
        if (!file) return
        if (!file.type.startsWith('image/') || file.size > MAX_SIZE) return toast.show('Envie uma imagem de até 4 MB.', 'danger')
        setUploading(true)
        try {
            const src = await uploadImage(file, 'blog')
            chain().setImage({ src, alt: '' }).run()
            setPanel(null)
        } catch (error) {
            toast.show(error.message, 'danger')
        } finally {
            setUploading(false)
            if (fileRef.current) fileRef.current.value = ''
        }
    }

    const tools = [
        [
            { icon: Paragraph, label: 'Parágrafo', active: state.paragraph, run: () => chain().setParagraph().run() },
            { icon: TextHTwo, label: 'Título', active: state.h2, run: () => chain().toggleHeading({ level: 2 }).run() },
            { icon: TextHThree, label: 'Subtítulo', active: state.h3, run: () => chain().toggleHeading({ level: 3 }).run() },
        ],
        [
            { icon: TextB, label: 'Negrito (Ctrl+B)', active: state.bold, run: () => chain().toggleBold().run() },
            { icon: TextItalic, label: 'Itálico (Ctrl+I)', active: state.italic, run: () => chain().toggleItalic().run() },
            { icon: TextUnderline, label: 'Sublinhado (Ctrl+U)', active: state.underline, run: () => chain().toggleUnderline().run() },
            { icon: TextStrikethrough, label: 'Riscado', active: state.strike, run: () => chain().toggleStrike().run() },
        ],
        [
            { icon: ListBullets, label: 'Lista', active: state.bullet, run: () => chain().toggleBulletList().run() },
            { icon: ListNumbers, label: 'Lista numerada', active: state.ordered, run: () => chain().toggleOrderedList().run() },
            { icon: Quotes, label: 'Citação', active: state.quote, run: () => chain().toggleBlockquote().run() },
            { icon: Minus, label: 'Linha divisória', run: () => chain().setHorizontalRule().run() },
        ],
        [
            { icon: LinkSimple, label: 'Link', active: state.link || panel === 'link', run: openLink },
            ...(state.link ? [{ icon: LinkBreak, label: 'Remover link', run: () => chain().extendMarkRange('link').unsetLink().run() }] : []),
            { icon: ImageIcon, label: 'Imagem', active: panel === 'image', run: () => { setUrl(''); setPanel(panel === 'image' ? null : 'image') } },
        ],
        [
            { icon: ArrowArcLeft, label: 'Desfazer (Ctrl+Z)', disabled: !state.canUndo, run: () => chain().undo().run() },
            { icon: ArrowArcRight, label: 'Refazer', disabled: !state.canRedo, run: () => chain().redo().run() },
        ],
    ]

    return (
        <Wrapper>
            <div className="toolbar" role="toolbar" aria-label="Formatação">
                {tools.map((group, index) => (
                    <div className="group" key={index}>
                        {group.map(({ icon: Icon, label, active, disabled, run }) => (
                            <button
                                key={label}
                                type="button"
                                className={active ? 'on' : ''}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={run}
                                disabled={disabled}
                                title={label}
                                aria-label={label}
                                aria-pressed={Boolean(active)}
                            >
                                <Icon size={20} weight={active ? 'bold' : 'duotone'} />
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            {panel === 'link' && (
                <div className="panel">
                    <Input autoFocus value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyLink() } }} placeholder="https://... ou /categoria/games" aria-label="Endereço do link" />
                    <Button type="button" $size="sm" onClick={applyLink}>Aplicar</Button>
                    <Button type="button" $size="sm" $variant="ghost" onClick={() => setPanel(null)}>Cancelar</Button>
                </div>
            )}
            {panel === 'image' && (
                <div className="panel">
                    {canUploadImages && (
                        <>
                            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
                            <Button type="button" $size="sm" $variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                                {uploading ? <Spinner /> : <ImageIcon size={18} />} Enviar do computador
                            </Button>
                            <span className="or">ou</span>
                        </>
                    )}
                    <Input value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyImageLink() } }} placeholder="cole o link da imagem (https://...)" aria-label="Link da imagem" />
                    <Button type="button" $size="sm" onClick={applyImageLink}>Inserir</Button>
                </div>
            )}

            <PostContentStyles className="editor">
                <EditorContent editor={editor} />
            </PostContentStyles>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    border: 0.1rem solid var(--gray-50);
    border-radius: 1.2rem;
    background: var(--white);
    &:focus-within { border-color: var(--primary); box-shadow: 0 0 0 0.3rem var(--primary-50); }
    .toolbar {
        position: sticky;
        top: 6.4rem;
        z-index: 5;
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        padding: 0.8rem;
        background: var(--white);
        border-bottom: 0.1rem solid var(--white-500);
        border-radius: 1.2rem 1.2rem 0 0;
    }
    .group { display: flex; gap: 0.2rem; padding-right: 0.6rem; margin-right: 0.2rem; border-right: 0.1rem solid var(--white-500); }
    .group:last-child { border-right: 0; }
    .toolbar button {
        width: 3.6rem;
        height: 3.6rem;
        border-radius: 0.8rem;
        display: grid;
        place-items: center;
        color: var(--gray-300);
        &:hover:not(:disabled) { background: var(--white-600); color: var(--primary); }
        &.on { background: var(--primary-50); color: var(--primary); }
        &:disabled { opacity: 0.35; }
    }
    .panel {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex-wrap: wrap;
        padding: 1rem 1.2rem;
        background: var(--white-600);
        border-bottom: 0.1rem solid var(--white-500);
        input { flex: 1; min-width: 20rem; height: 3.8rem; font-size: 1.4rem; }
        .or { font-size: 1.3rem; color: var(--gray-200); }
    }
    .editor .tiptap {
        min-height: 40rem;
        padding: 2.4rem 2.8rem;
        outline: none;
    }
    .editor .tiptap p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        color: var(--gray-100);
        float: left;
        height: 0;
        pointer-events: none;
    }
    .editor .tiptap img.ProseMirror-selectednode { outline: 0.3rem solid var(--primary); }
`
