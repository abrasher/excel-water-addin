export const bindTable = (tableName: string) => {
  Office.context.document.bindings.addFromNamedItemAsync(
    tableName,
    Office.BindingType.Table,
    { id: tableName },
    async (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
      }
    }
  )
}
