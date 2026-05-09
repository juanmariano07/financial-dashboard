# Mock API contract

Os dados desta pasta simulam respostas de API mantendo o mesmo formato dos DTOs em `src/dtos`.

- Os objetos usam `snake_case`, como uma API externa normalmente faria.
- Os services chamam esta camada quando `VITE_USE_MOCKS` não é `false`.
- Os mappers continuam responsáveis por converter DTOs para tipos de domínio em `camelCase`.
- A simulação acelerada altera preços e volume em memória para demonstrar a UI reagindo a mudanças de mercado.

Para trocar por uma API real, o objetivo é preservar os DTOs e substituir a origem dos dados nos services.
