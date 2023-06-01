import { ColumnDef } from "@tanstack/react-table"

export type DivergentColumn<TData, TColumn = never> = Partial<
  ColumnDef<TData, TColumn>
> & {
  title?: string
}
