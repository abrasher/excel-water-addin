export {}

import { reactive } from "vue"

interface ColumnDef {
  key: string
  label: string
}

export class StoredTable<Row extends Record<string, string | number | boolean>, Col extends ColumnDef> {
  private rows = reactive([])
  private excelTable?: Excel.Table
  private headers: string[]

  constructor(private tableName: string, sheetName: string, private colDefs: ColumnDef[]) {
    this.headers = colDefs.map((c) => c.label)
  }

  setup() {
    Excel.run(async (context) => {
      let importSheet = context.workbook.worksheets.getItemOrNullObject("Catchment Definitions")
      await context.sync()

      if (importSheet.isNullObject) {
        importSheet = context.workbook.worksheets.add("Catchment Definitions")
      }

      let importTable = importSheet.tables.getItemOrNullObject("CatchmentDefinitionTable")
      await context.sync()

      if (importTable.isNullObject) {
        importSheet.getRange("A1:H1").values = [this.headers]

        importTable = importSheet.tables.add("A1:H1", true)
        importTable.name = "CatchmentDefinitionTable"
      }

      this.excelTable = importTable

      // importTable.onChanged.add(this.updateStore)
    })
  }

  private update() {}

  updateTable() {}

  addRow(row: Partial<Row>) {
    this.excelTable?.rows.add(-1, [this.objectToRow(row)])
  }

  async updateRow(index: number, value: Partial<Row>) {
    if (this.excelTable) {
      this.excelTable.rows.getItemAt(index).values = [this.objectToRow(value)]
    }
  }

  async updateProperty(index: number, value: Partial<Row>) {
    Object.entries(value).forEach(() => {})
  }

  private getIndex(headerName: string) {
    return this.headers.findIndex((x) => x === headerName)
  }

  private objectToRow(row: Partial<Row>) {
    return this.colDefs.map((col) => row[col.key] ?? "")
  }

  removeRow() {}

  loadFromExcel() {}

  saveToExcel() {}
}

type ObjectToTuple<T extends Record<string, unknown>> = [T[keyof T]]

interface Rows {
  t: string
  q: number
  j: string
}
