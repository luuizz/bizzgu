import styled from 'styled-components'

export const StyleNoItems = styled.div`
    padding: 4rem 0;
    height: 60rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .area-top {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            h3 {
                font-size: 3.2rem;
                margin-bottom: 2.4rem;
                text-align: center;
            }
            a {
                width: 40rem;
            }
        }
        .area-bottom {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 3.2rem;
            img {
                width: 100%;
                max-width: 30rem;
            }
        }
    }
`