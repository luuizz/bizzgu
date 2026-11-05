import styled from 'styled-components'
import logo from '/src/assets/logo-theme-light.svg'

// Exibido quando o .env ainda não tem os endereços do Neon
export function SetupNotice() {
    return (
        <Wrapper>
            <div className="box">
                <img src={logo} alt="Bizzgu" />
                <h1>Falta conectar o Neon</h1>
                <p>Crie um arquivo <code>.env.local</code> na raiz do projeto com os endereços do Neon Auth e da Data API do seu projeto e reinicie o servidor:</p>
                <pre>{`VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.../neondb/auth
VITE_NEON_DATA_API_URL=https://ep-xxx.apirest.../neondb/rest/v1`}</pre>
                <p>O passo a passo completo (ativar Auth e Data API, tabelas, dados de exemplo e usuário admin) está no <strong>README.md</strong>.</p>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.4rem;
    .box {
        background: var(--white);
        border-radius: 1.6rem;
        padding: 4rem;
        max-width: 60rem;
        box-shadow: var(--shadow);
    }
    img { width: 10rem; margin-bottom: 3.2rem; }
    h1 { font-size: 3rem; margin-bottom: 1.6rem; }
    p { font-size: 1.6rem; color: var(--gray-300); margin-bottom: 1.6rem; }
    code { background: var(--white-600); padding: 0.2rem 0.6rem; border-radius: 0.4rem; font-family: monospace; }
    pre {
        background: var(--gray-500);
        color: var(--white);
        padding: 1.6rem;
        border-radius: 0.8rem;
        font-size: 1.4rem;
        overflow-x: auto;
        margin-bottom: 1.6rem;
        font-family: monospace;
    }
`
