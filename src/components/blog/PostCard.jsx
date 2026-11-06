import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Article, CalendarBlank } from '@phosphor-icons/react'
import { formatPostDate } from '../../lib/posts'
import { imageUrl } from '../../lib/format'

export function PostCard({ post, headingLevel = 3 }) {
    const Heading = `h${headingLevel}`
    return (
        <Card to={`/blog/${post.slug}`}>
            <div className="cover">
                {post.cover_image ? <img src={imageUrl(post.cover_image)} alt="" loading="lazy" /> : <Article size={48} />}
            </div>
            <div className="body">
                <span className="date"><CalendarBlank size={16} /> {formatPostDate(post.published_at)}</span>
                <Heading>{post.title}</Heading>
                {post.excerpt && <p>{post.excerpt}</p>}
                <span className="more">Ler post</span>
            </div>
        </Card>
    )
}

const Card = styled(Link)`
    display: flex;
    flex-direction: column;
    background: var(--white);
    border-radius: 1.6rem;
    overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
    &:hover { transform: translateY(-0.4rem); box-shadow: 0 1.6rem 3.2rem rgba(16, 7, 23, 0.08); }
    &:hover h2, &:hover h3 { color: var(--primary); }
    .cover {
        aspect-ratio: 1200 / 630;
        background: var(--primary-50);
        color: var(--primary);
        display: grid;
        place-items: center;
        img { width: 100%; height: 100%; object-fit: cover; }
    }
    .body { padding: 2rem 2.4rem 2.4rem; display: flex; flex-direction: column; gap: 1rem; flex: 1; }
    .date { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 1.3rem; color: var(--gray-200); }
    h2, h3 { font-size: 2rem; line-height: 1.3; color: var(--gray-800); transition: color .2s ease; }
    p { font-size: 1.5rem; line-height: 1.55; color: var(--gray-300); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .more { margin-top: auto; padding-top: 0.6rem; font-family: var(--font-red-hat); font-weight: 700; font-size: 1.5rem; color: var(--primary); }
`

export const PostGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.4rem;
    @media (max-width: 1000px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    @media (max-width: 640px) { grid-template-columns: 1fr; }
`
