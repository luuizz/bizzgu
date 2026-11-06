import { Link } from 'react-router-dom'
import { Section } from '../layout'
import { SectionTitle } from '../ui'
import { PostCard, PostGrid } from '../blog/PostCard'
import { useAsync } from '../../hooks/useAsync'
import { getPosts } from '../../services/catalog'

// "Do blog": os 3 posts mais recentes, perto do rodapé da página inicial
export function BlogSection() {
    const posts = useAsync(() => getPosts({ limit: 3 }), [])
    if (!posts.data?.length) return null

    return (
        <Section>
            <div className="container">
                <div className="section-head">
                    <SectionTitle>Do blog</SectionTitle>
                    <Link to="/blog">Ver todos os posts</Link>
                </div>
                <PostGrid>{posts.data.map((post) => <PostCard key={post.id} post={post} />)}</PostGrid>
            </div>
        </Section>
    )
}
