# Move Clinic

Site institucional da Move Clinic — saúde, movimento e bem-estar, em Ribeirão Preto/SP.

## Versão incluída

- 20 atendimentos com filtros e busca.
- Pilates com três imagens diferentes e navegação entre os momentos.
- Esfera animada de serviços com controle de pausa.
- Apresentação da Priscila, formação, endereço e horários.
- Mapa e links de WhatsApp, Instagram e Facebook.
- Layout responsivo e suporte à preferência por movimento reduzido.

Site na Hostinger: https://yellow-spider-954759.hostingersite.com/

## Abrir localmente

Requer Node.js. Não é necessário instalar dependências.

```sh
npm start
```

Abra http://127.0.0.1:4173.

## Editar

O site está em `dist/`. Edite `index.html` e os arquivos CSS/JS sem hash, por exemplo `cinema.css` e `cinema.js`.
Depois de alterar CSS ou JavaScript, execute:

```sh
npm run version:assets
```

Esse comando atualiza os nomes de arquivo usados no HTML para evitar cache de versões antigas. Imagens e bibliotecas locais ficam em `dist/assets/`.

## Publicar na Hostinger

Envie **o conteúdo** de `dist/` para a pasta `public_html` da hospedagem. O arquivo `index.html` deve ficar diretamente nessa pasta. Não é necessário servidor Node.js em produção nem banco de dados; os agendamentos são feitos pelos links de WhatsApp.

## Imagens e bibliotecas

A foto da Priscila e o logotipo foram fornecidos pela responsável pelo projeto. As imagens ilustrativas criadas com IA estão identificadas no site; detalhes ficam em `dist/assets/cinema-image-provenance.json`. Licenças das bibliotecas de terceiros ficam em `dist/assets/vendor/`.

Este repositório guarda uma cópia independente dos arquivos do site. Alterações no GitHub não são publicadas automaticamente na Hostinger.
