import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
import { AddUnit } from '@/features/units/add-unit'
import { DeleteUnit } from '@/features/units/delete-unit'
import { EditUnit } from '@/features/units/edit-unit'
import { getUnitsListOptions } from '@/features/units/api/get-all'
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon, TrashSimpleIcon } from '@phosphor-icons/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

const UnitsManagement = () => {
  const { data: units } = useSuspenseQuery(getUnitsListOptions())
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) {return units}

    const query = searchQuery.toLowerCase()
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.symbol.toLowerCase().includes(query) ||
        unit.parent?.name.toLowerCase().includes(query) ||
        unit.parent?.symbol.toLowerCase().includes(query)
    )
  }, [units, searchQuery])

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Unités de mesure</h1>
        </div>
        <AddUnit>
          <Button variant="default" size="sm">
            <PlusIcon />
          </Button>
        </AddUnit>
      </div>

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher une unité..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredUnits.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {searchQuery
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
                    {unit.name} ({unit.symbol})
                  </ItemTitle>
                  <ItemDescription>
                    {unit.parentId && unit.parent && unit.factor ? (
                      <>
                        1 {unit.parent.symbol} = {unit.factor} {unit.symbol}
                      </>
                    ) : (
                      'Unité de base'
                    )}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <EditUnit unit={unit} />
                  <DeleteUnit unitId={unit.id} unitName={unit.name} />
                </ItemActions>
              </Item>
              {index !== filteredUnits.length - 1 && <ItemSeparator />}
            </React.Fragment>
          ))}
        </ItemGroup>
      )}
    </div>
  )
}

const RouteComponent = () => <UnitsManagement />

export const Route = createFileRoute('/settings/units')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getUnitsListOptions()),
})
