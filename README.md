# Estrutura dos Ficheiros Principais 

Este projeto é uma aplicação web desenvolvida em Next.js, que permite gerir um inventário de materiais, utilizando o Airtable como base de dados e Airtable Automations para notificações por email.

## src/pages/inventario.tsx
Este ficheiro corresponde à página principal do inventário.

É responsável por:

    Mostrar a lista de materiais
    Criar novos materiais
    Editar materiais existentes
    Eliminar materiais
    Destacar visualmente materiais com stock baixo

## src/pages/api/materials.ts
Este ficheiro implementa a API, que funciona como backend da aplicação.

É responsável por:

    Comunicar com a API do Airtable
    Converter dados entre o formato do Airtable e o formato usado no frontend
    Centralizar toda a lógica de acesso aos dados

Endpoints implementados:

    GET /api/materials
    Obtém todos os materiais do Airtable e calcula se estão em stock baixo.

    POST /api/materials
    Cria um novo material.

    PATCH /api/materials
    Atualiza campos de um material existente.

    DELETE /api/materials
    Remove um material pelo seu Record ID.


# Link do repositório:
    https://github.com/leonor-a-a-ist/task2-app_movel
    