import type { Permission } from './../types/index';

export const flattenPermissions = (
  permObject: Record<number, number[]>
): number[] => {
  const flat: number[] = [];
  for (const [parent, children] of Object.entries(permObject)) {
    flat.push(parseInt(parent));
    flat.push(...children);
  }
  return [...new Set(flat)];
};

export const groupPermissions = (
  selectedIds: number[],
  allPermissions: Permission[]
): Record<number, number[]> => {
  const grouped: Record<number, number[]> = {};

  allPermissions.forEach((parent) => {
    const childIds = parent?.children?.map((c) => c.id) || [];
    const selectedChildren = childIds.filter((id) =>
      selectedIds.includes(id)
    );

    if (selectedChildren.length > 0) {
      grouped[parent.id] = selectedChildren;
    } else if (selectedIds.includes(parent.id)) {
      grouped[parent.id] = [];
    }
  });

  return grouped;
};
