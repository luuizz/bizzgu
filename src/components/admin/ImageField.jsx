import { useRef, useState } from 'react'
import styled from 'styled-components'
import { LinkSimple, Trash, UploadSimple } from '@phosphor-icons/react'
import { Button, Input, Spinner } from '../ui'
import { useToast } from '../../hooks/useToast'
import { canUploadImages, uploadImage } from '../../services/admin'
import { imageUrl } from '../../lib/format'

const MAX_SIZE = 4 * 1024 * 1024
const isImageLink = (value) => /^https?:\/\/\S+$/i.test(value)

// Campo de uma imagem: envio para o Vercel Blob (no site publicado) ou link.
// `folder` define a pasta no Blob: 'products' | 'banners' | 'categories' | 'blog'.
export function ImageField({ id, value, onChange, folder, ratio = '16 / 9', hint, onRemoved }) {
    const toast = useToast()
    const inputRef = useRef(null)
    const [uploading, setUploading] = useState(false)
    const [link, setLink] = useState('')

    const handleFile = async (file) => {
        if (!file) return
        if (!file.type.startsWith('image/') || file.size > MAX_SIZE) {
            toast.show('Envie uma imagem de até 4 MB.', 'danger')
            return
        }
        setUploading(true)
        try {
            const url = await uploadImage(file, folder)
            if (value) onRemoved?.(value)
            onChange(url)
        } catch (error) {
            toast.show(error.message, 'danger')
        } finally {
            setUploading(false)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    const applyLink = () => {
        const url = link.trim()
        if (!isImageLink(url)) {
            toast.show('Cole um link que comece com http:// ou https://', 'danger')
            return
        }
        if (value) onRemoved?.(value)
        onChange(url)
        setLink('')
    }

    const remove = () => {
        onRemoved?.(value)
        onChange('')
    }

    return (
        <Wrapper>
            <div className="preview" style={{ aspectRatio: ratio }}>
                {uploading ? <Spinner $size={2.8} /> : value
                    ? <img src={imageUrl(value)} alt="" />
                    : (
                        <button type="button" className="empty" onClick={() => inputRef.current?.click()} disabled={!canUploadImages}>
                            <UploadSimple size={28} />
                            <span>{canUploadImages ? 'Enviar imagem' : 'Sem imagem'}</span>
                        </button>
                    )}
            </div>

            <div className="actions">
                {canUploadImages && (
                    <>
                        <input ref={inputRef} id={id} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
                        <Button type="button" $variant="secondary" $size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
                            <UploadSimple size={18} /> {value ? 'Trocar' : 'Enviar'}
                        </Button>
                    </>
                )}
                {value && (
                    <Button type="button" $variant="ghost" $size="sm" onClick={remove} disabled={uploading}>
                        <Trash size={18} /> Remover
                    </Button>
                )}
            </div>

            <div className="link">
                <Input
                    type="url"
                    placeholder="ou cole o link de uma imagem"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyLink() } }}
                    aria-label="Link da imagem"
                />
                <Button type="button" $variant="secondary" $size="sm" onClick={applyLink} disabled={!link.trim()}>
                    <LinkSimple size={18} /> Usar
                </Button>
            </div>
            {hint && <p className="hint">{hint}</p>}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .preview {
        width: 100%;
        border-radius: 1.2rem;
        overflow: hidden;
        background: var(--white-600);
        border: 0.1rem dashed var(--gray-50);
        display: grid;
        place-items: center;
        img { width: 100%; height: 100%; object-fit: cover; }
    }
    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
        color: var(--gray-200);
        font-size: 1.3rem;
        &:not(:disabled):hover { color: var(--primary); }
    }
    .actions { display: flex; gap: 0.8rem; flex-wrap: wrap; }
    .link { display: flex; gap: 0.8rem; }
    .link input { height: 3.8rem; font-size: 1.4rem; }
    .hint { font-size: 1.25rem; color: var(--gray-200); }
`
