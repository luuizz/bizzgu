import { onlyDigits } from '../lib/format'

// Consulta de CEP pela API pública ViaCEP
export async function lookupCep(value) {
    const cep = onlyDigits(value)
    if (cep.length !== 8) throw new Error('Digite um CEP com 8 números.')

    let data
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        data = await response.json()
    } catch {
        throw new Error('Não foi possível consultar o CEP agora. Preencha o endereço manualmente.')
    }

    if (data.erro) throw new Error('CEP não encontrado.')

    return {
        cep,
        street: data.logradouro || '',
        district: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
    }
}
