# Pokemón

Aplicação desenvolvida em Angular consumindo a API https://pokemontcg.io/

# Instalação e Execução

1. Faça um clone desse repositório: `git clone https://github.com/caiqueadesouza/Pokemon-App.git`;
2. Execute o comando `npm install` para instalar as dependências;
3. Execute o comando `ng serve` para iniciar a aplicação.

# Introdução

Este repositório contém uma aplicação Angular criada com o objetivo de avaliar e expandir os conhecimentos do desenvolvedor nesta poderosa estrutura. A aplicação demonstra a implementação de conceitos fundamentais do Angular, como componentes, serviços, roteamento e interação com APIs externas. O projeto é uma oportunidade para explorar as melhores práticas de desenvolvimento Angular V16.

# Arquitetura 

1. Módulos (Modules):
- Angular utiliza o conceito de módulos para organizar a aplicação em funcionalidades coesas e independentes.
- Os módulos são definidos usando a função NgModule e podem conter componentes, diretivas, pipes e serviços relacionados.

2. Componentes (Components):
- Componentes são os blocos de construção fundamentais de uma aplicação Angular.
- Eles encapsulam a lógica de apresentação e comportamento da interface do usuário.
- Cada componente possui seu próprio template HTML, estilos CSS e lógica TypeScript.

3. Templates e Data Binding:
- O sistema de templates do Angular permite a ligação de dados bidirecional entre o modelo de dados e a interface do usuário.
- Isso significa que as alterações no modelo de dados são refletidas automaticamente na interface do usuário e vice-versa.

4. Diretivas (Directives):
- Diretivas são instruções no DOM que o Angular manipula e transforma.
- Existem dois tipos de diretivas: diretivas de atributo e diretivas estruturais. As diretivas de atributo alteram a aparência ou comportamento de um elemento, enquanto as diretivas estruturais alteram a estrutura do DOM.

5. Serviços (Services):
- Serviços são classes que realizam tarefas específicas e podem ser injetadas em componentes ou outros serviços.
- Eles são usados para encapsular a lógica de negócios, compartilhar dados entre componentes e realizar chamadas de API.
 
6. Injeção de Dependência (Dependency Injection):
- Angular utiliza o padrão de injeção de dependência para fornecer dependências necessárias aos componentes e serviços.
- Isso promove a reutilização de código, facilita os testes unitários e torna a aplicação mais modular e escalável.

7. Rotas (Routing):
- O roteamento é usado para navegar entre as diferentes partes da aplicação Angular.
- As rotas são definidas em um módulo de roteamento separado e associadas a componentes específicos.

8. Observables e RxJS:
- O Angular faz uso extensivo de Observables do RxJS para trabalhar com fluxos de dados assíncronos.
- Eles são usados para lidar com eventos, fazer chamadas de API assíncronas e realizar operações reativas.

# Bibliotecas Utilizadas

- Tailwindcss
- Uuid

# Implementando o Projeto

Partindo para a implementação do projeto, iremos desenvolver do início, sem as bibliotecas, e em seguida refatorando etapa por etapa.

# Services

Utlizado o BaseService para centralizar a lógica de comunicação com a API, visando reutilização de código, simplificação da manutenção, facilitação da extensão, padronização e melhor testabilidade. Ele encapsula operações comuns como leitura e pesquisa, fornecendo métodos genéricos que outros serviços podem usar para interagir de forma consistente e eficiente com a API.

    export class BaseService<T> {

      baseUrl = environment.apiUrl;
  
      constructor(protected http: HttpClient) { }
  
      read(): Observable<T[]> {
          return this.http.get<{ data: T[] }>(`${this.baseUrl}`).pipe(
              map(response => response.data),
              catchError((e: any) => {
                  return EMPTY;
              })
          );
      }
  
      searchCards(query: string): Observable<T[]> {
          const params = { q: query };
          return this.http.get<{ data: T[] }>(this.baseUrl, { params }).pipe(
              map(response => response.data),
              catchError((e: any) => {
                  return EMPTY;
              })
          );
      }
    }

# Create e Update

Reutilização componentes sempre que possível, use lógica condicional no template, gerencie o estado do formulário e manipule as rotas para determinar o comportamento do componente. Manter o código organizado e fácil de entender é fundamental para garantir a eficácia e a manutenibilidade do componente.

# Componentização 

Componentização no Angular é a prática de dividir a interface do usuário em pequenos blocos independentes e reutilizáveis chamados de componentes.

# Estrutura de Pastas

├── app/
   ├── colors/        # Arquivos relacionados às cores da aplicação
   ├── helpers/       # Funções e utilitários auxiliares                   
   ├── models/        # Módulos da aplicação
   ├── services/      # Serviços compartilhados
   ├── pages/         # Componentes de páginas principais
   ├── shared/        # Componentes e utilitários compartilhados
      ├── components/   # Componentes reutilizáveis  
      ├── pipes/        # Componentes reutilizáveis  
├── app.component.ts    # Componente raiz da aplicação├── app.module.ts     

# Validação 

A validação personalizada em Angular é uma maneira de criar regras de validação específicas para atender às necessidades exclusivas de sua aplicação. Isso pode incluir a validação de campos com base em regras de negócios, validação de formato de dados personalizados ou qualquer outra lógica de validação específica do domínio.

export function cardCountValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const cardCount = control.value ? control.value.length : 0;
        return cardCount >= min && cardCount <= max ? null : { cardCount: true };
    };
}

    export function uniqueCardNameValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const cards = control.value as Array<any>;
            if (!cards || cards.length === 0) {
                return null;
            }
    
            const cardCounts = cards.reduce((counts, card) => {
                counts[card.name] = (counts[card.name] || 0) + 1;
                return counts;
            }, {});
    
            const invalidNames = Object.keys(cardCounts).filter(name => cardCounts[name] > 4);
    
            return invalidNames.length > 0 ? { uniqueCardName: true } : null;
        };
    }

# Armazenamento dos Baralhos em Memória

Esses métodos formam uma maneira simples de gerenciar operações CRUD (criar, ler, atualizar e excluir) para baralhos em memória dentro de sua aplicação Angular. O uso de Observable permite uma comunicação reativa e assíncrona entre componentes que dependem desses dados.

ddToDeck(deck: Deck): boolean {
    deck.id = uuidv4();
    this.deck.push(deck);
    this.deckSubject.next([...this.deck]);
    return true;
}

getDeck(): Observable<Deck[]> {
    return this.deckSubject.asObservable();
}

getDeckById(deckId: string): Observable<Deck | undefined> {
    return this.deckSubject.asObservable().pipe(
        map(decks => decks.find(deck => deck.id === deckId))
    );
}

updateDeck(deck: Deck): boolean {
    const index = this.deck.findIndex(d => d.id === deck.id);
    if (index !== -1) {
        this.deck[index] = { ...deck };
        this.deckSubject.next([...this.deck]);
        return true;
    } else {
        return false;
    }
}

deleteDeck(deckId: string): void {
    const index = this.deck.findIndex(deck => deck.id === deckId);
    if (index !== -1) {
        this.deck.splice(index, 1);
        this.deckSubject.next([...this.deck]);
    }
}

countDecks(): number {
    return this.deck.length;
}

# Filtros na API

Método permite buscar cartas da API com base em um critério de pesquisa fornecido, retornando um Observable que emite os dados correspondentes. Isso é útil para implementar funcionalidades de busca e filtragem na sua aplicação Angular, mantendo a lógica de comunicação com a API encapsulada dentro de um serviço reutilizável.

    searchCards(query: string): Observable<T[]> {
        const params = { q: query };
        return this.http.get<{ data: T[] }>(this.baseUrl, { params }).pipe(
            map(response => response.data),
            catchError((e: any) => {
                return EMPTY;
            })
        );
    }
