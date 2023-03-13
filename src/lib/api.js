import dotenv from 'dotenv';
dotenv.config();
const API_URL = process.env.WP_URL;

/* Main Fetch function */
async function fetchAPI(query, { variables } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });
  
    const json = await res.json();

    if (json.errors) {
      console.log(json.errors);
      throw new Error('Failed to fetch API');
    }
  
    return json.data;
}

/* Fetch all WP Pages that have a slug */
export async function getAllPagesWithSlugs() {

    const data = await fetchAPI(`
    {
      pages(first: 10000) {
        edges {
          node {
            slug
          }
        }
      }
    }
    `);

    return data?.pages;
}

/* Fetch page content based on it's slug */
export async function getPageBySlug(slug) {
    
    const data = await fetchAPI(`
    {
      page(id: "${slug}", idType: URI) {
        title
        content
      }
    }
    `);

    return data?.page;
}

/* Fetch menu by name */
export async function getMenuByName() {

    const data = await fetchAPI(`
    query GET_MENU_BY_NAME {
      menu(id: "Main Menu", idType: NAME) {
        count
        id
        databaseId
        name
        slug
        menuItems {
          nodes {
            id
            databaseId
            url
            cssClasses
            label
          }
        }
      }
    }
    `);
    
    return data?.menu;
}