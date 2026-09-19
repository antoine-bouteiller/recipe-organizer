import { RecipeListContent } from '@client/features/recipe/components/recipe-list'
import { RecipeSearchCard } from '@client/features/search/components/recipe-search-card'
import { type ReducedRecipe } from '@client/types/recipe'
import { RouterContextProvider, createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vite-plus/test'

const recipe: ReducedRecipe = {
  cuisineTypes: [],
  id: 1,
  image: 'https://example.com/recipe.jpg',
  isMagimix: false,
  isSpice: false,
  isVegetarian: false,
  meals: [],
  name: 'Test recipe',
  servings: 2,
}

const rootRoute = createRootRoute()
const recipeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/recipe/$id' })
const router = createRouter({ history: createMemoryHistory({ initialEntries: ['/'] }), routeTree: rootRoute.addChildren([recipeRoute]) })
const TestRouterContextProvider = RouterContextProvider<typeof router>

const renderListCard = (index: number) => {
  const recipes = Array.from({ length: index + 1 }, (_value, id) => ({ ...recipe, id: id + 1 }))
  const markup = renderToStaticMarkup(
    // oxlint-disable-next-line react/no-children-prop -- JSX is unavailable in .test.ts.
    createElement(TestRouterContextProvider, { children: createElement(RecipeListContent, { canCreate: false, recipes }), router })
  )
  return markup.match(/<article\b[\s\S]*?<\/article>/g)?.[index] ?? ''
}

describe('recipe card image loading', () => {
  it('eagerly loads the recipe grid image at index 5 with asynchronous decoding', () => {
    const markup = renderListCard(5)

    expect(markup).toMatch(/<img[^>]*decoding="async"[^>]*loading="eager"/)
  })

  it('renders a single article with separate navigation and controls and a lazy image at index 6', () => {
    const markup = renderListCard(6)

    expect(markup).toMatch(/<img[^>]*decoding="async"[^>]*loading="lazy"/)
    expect(markup).toMatch(/^<article[^>]*><img[^>]*\/><a[^>]*href="\/recipe\/7"/)
    expect(markup).toMatch(/<\/a><button\b.*<\/button><\/article>$/)
  })

  it('eagerly loads the search image at index 5 with asynchronous decoding', () => {
    const markup = renderToStaticMarkup(
      // oxlint-disable-next-line react/no-children-prop -- JSX is unavailable in .test.ts.
      createElement(TestRouterContextProvider, { children: createElement(RecipeSearchCard, { index: 5, recipe }), router })
    )

    expect(markup).toMatch(/<img[^>]*decoding="async"[^>]*loading="eager"/)
  })

  it('lazily loads the search image at index 6 with asynchronous decoding', () => {
    const markup = renderToStaticMarkup(
      // oxlint-disable-next-line react/no-children-prop -- JSX is unavailable in .test.ts.
      createElement(TestRouterContextProvider, { children: createElement(RecipeSearchCard, { index: 6, recipe }), router })
    )

    expect(markup).toMatch(/<img[^>]*decoding="async"[^>]*loading="lazy"/)
  })
})
