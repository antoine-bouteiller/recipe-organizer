import { ScreenLayout } from '@/components/layout/screen-layout'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { AddUnit } from '@/features/units/components/add-unit'
import { DeleteUnit } from '@/features/units/components/delete-unit'
import { EditUnit } from '@/features/units/components/edit-unit'
import { PlusIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { useMemo, useState } from 'react'

const UnitsManagement = () => {
  const { data: units } = useSuspenseQuery(getUnitsListOptions())
  const [search, setSearch] = useState('')

  const { isAdmin } = Route.useRouteContext()

  const filteredUnits = useMemo(() => {
    if (!search.trim()) {
      return units
    }

    const query = search.toLowerCase()
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) || unit.parent?.name.toLowerCase().includes(query)
    )
  }, [units, search])

  return (
    <ScreenLayout withGoBack title="Unitées">
      <div className="sticky top-0 bg-background px-4 pt-4 pb-2  z-10 flex items-center gap-4">
        <SearchInput search={search} setSearch={setSearch} />
        <AddUnit>
          <Button size="icon-lg" variant="outline">
            <PlusIcon />
          </Button>
        </AddUnit>
      </div>

      <div className="px-4">
        {filteredUnits.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {search
              ? 'Aucune unité trouvée pour cette recherche.'
              : 'Aucune unité trouvée. Ajoutez-en une pour commencer.'}
          </p>
        ) : (
          <ItemGroup>
            {filteredUnits.map((unit, index) => (
              <React.Fragment key={unit.id}>
                <Item>
                  <ItemContent>
                    <ItemTitle>
                      {unit.name}
                      {unit.parent && unit.factor && (
                        <span className="text-muted-foreground text-sm">
                          = {unit.factor} {unit.parent.name}
                        </span>
                      )}
                    </ItemTitle>
                    <ItemDescription />
                  </ItemContent>
                  {isAdmin && (
                    <ItemActions>
                      <EditUnit unit={unit} />
                      <DeleteUnit unitId={unit.id} unitName={unit.name} />
                    </ItemActions>
                  )}
                </Item>
                {index !== filteredUnits.length - 1 && <ItemSeparator />}
              </React.Fragment>
            ))}
          </ItemGroup>
        )}
      </div>
    </ScreenLayout>
  )
}

const RouteComponent = () => <UnitsManagement />

export const Route = createFileRoute('/settings/units')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getUnitsListOptions()),
})
