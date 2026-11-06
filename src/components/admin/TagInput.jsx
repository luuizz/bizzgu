import { useRef } from 'react'
import { Tag } from '@phosphor-icons/react'
import { MultiSelect } from '../ui/MultiSelect'
import { useAsync } from '../../hooks/useAsync'
import { useToast } from '../../hooks/useToast'
import { createTag, listAllTags } from '../../services/admin'
import { slugify } from '../../lib/format'

// Campo de tags do produto: escolhe várias entre as existentes ou cria uma nova com Enter
export function TagInput({ id, value, onChange }) {
    const toast = useToast()
    const all = useAsync(() => listAllTags(), [])
    // Guarda as tags conhecidas (inclusive as recém-criadas) para converter id → tag
    const known = useRef(new Map())
    for (const tag of [...(all.data || []), ...value]) known.current.set(tag.id, tag)

    const options = (all.data || []).map((tag) => ({ value: tag.id, label: tag.name, icon: Tag }))

    const handleCreate = async (name) => {
        try {
            const tag = await createTag(name, slugify(name))
            known.current.set(tag.id, tag)
            all.setData([...(all.data || []), tag].sort((a, b) => a.name.localeCompare(b.name)))
            onChange([...value, tag])
        } catch (error) {
            toast.show(error.message, 'danger')
        }
    }

    return (
        <MultiSelect
            id={id}
            label="Tags do produto"
            options={options}
            value={value.map((tag) => tag.id)}
            onChange={(ids) => onChange(ids.map((tagId) => known.current.get(tagId)).filter(Boolean))}
            placeholder="Busque ou crie uma tag"
            onCreate={handleCreate}
            createLabel={(text) => `Criar tag “${text}”`}
            emptyText="Nenhuma tag ainda"
        />
    )
}
