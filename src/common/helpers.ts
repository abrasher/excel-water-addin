interface Data {
  [key: string]: unknown
}

export const excelTableToObjectArray = async <T extends Data>(
  table: Excel.Table
): Promise<T[]> => {
  table.load({ columns: { name: true }, rows: { values: true } })
  await table.context.sync()

  const columnNames = table.columns.items.map((col) => col.name)

  const data = table.rows.items.map((row) => {
    console.log(row.values)
    return Object.fromEntries(
      row.values[0].map((val, index) => [columnNames[index], val])
    )
  })

  return data
}
