import styled from 'styled-components'

// Tipografia do conteúdo dos posts. A mesma no editor do painel e na página
// do post, para o que se vê ao escrever ser o que aparece na loja.
export const PostContentStyles = styled.div`
    color: var(--gray-400);
    font-size: 1.75rem;
    line-height: 1.75;
    word-break: break-word;

    > * + *, .tiptap > * + * { margin-top: 1.6rem; }
    > :first-child, .tiptap > :first-child { margin-top: 0 !important; }
    h2 { font-size: 2.8rem; line-height: 1.25; color: var(--gray-800); margin-top: 4rem !important; }
    h3 { font-size: 2.2rem; line-height: 1.3; color: var(--gray-800); margin-top: 3.2rem !important; }
    strong { color: var(--gray-700); }
    a { color: var(--primary); text-decoration: underline; text-underline-offset: 0.3rem; &:hover { text-decoration-thickness: 0.2rem; } }
    ul, ol { padding-left: 2.6rem; }
    /* o CSS global zera o estilo das listas do site; no conteúdo elas voltam */
    ul > li { list-style: disc; }
    ol > li { list-style: decimal; }
    li + li { margin-top: 0.6rem; }
    li p { margin: 0; }
    li::marker { color: var(--primary); }
    blockquote {
        margin-left: 0;
        padding: 1.6rem 2.4rem;
        border-left: 0.4rem solid var(--primary);
        background: var(--primary-50);
        border-radius: 0 1.2rem 1.2rem 0;
        color: var(--gray-700);
        font-style: italic;
        p { margin: 0; }
    }
    hr { border: 0; border-top: 0.1rem solid var(--gray-50); margin: 3.2rem 0 !important; }
    img { display: block; max-width: 100%; height: auto; border-radius: 1.2rem; margin: 2.4rem auto !important; }
    code { font-size: 0.9em; background: var(--white-600); padding: 0.2rem 0.6rem; border-radius: 0.4rem; }

    @media (max-width: 700px) {
        font-size: 1.6rem;
        h2 { font-size: 2.3rem; }
        h3 { font-size: 1.9rem; }
    }
`
