import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import { deleteUnitOptions } from "@/features/units/api/delete";
import { useMutation } from "@tanstack/react-query";
import { useState, type JSX } from "react";

interface DeleteUnitProps {
  unitId: number;
  unitName: string;
  children: JSX.Element;
}

export const DeleteUnit = ({ unitId, unitName, children }: DeleteUnitProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteMutation = useMutation(deleteUnitOptions());

  const handleDelete = () => {
    deleteMutation.mutate(
      { data: { id: unitId } },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogTrigger render={children} />
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Supprimer l&apos;unité</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="px-4 md:px-0 text-sm text-muted-foreground">
          Êtes-vous sûr de vouloir supprimer &quot;{unitName}&quot; ? Cette
          action est irréversible.
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline" />}>
            Annuler
          </ResponsiveDialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
