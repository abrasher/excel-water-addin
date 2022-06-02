export const setupHooks = () => {
  Excel.run(async (context) => {
    if (Office.context.document.settings.get("setup")) {
      context.workbook.tables.onChanged.add(onTableChanged)
    }
  })
}

export const onTableChanged = async (args: Excel.TableChangedEventArgs) => {
  console.log("table changed")
}
