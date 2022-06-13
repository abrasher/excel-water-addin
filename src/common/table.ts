import { reactive, ref } from "vue"

interface ColumnDef {
  key: string
  label: string
}

export class StoredTable<Row extends Record<string, string | number | boolean>, Col extends ColumnDef> {
  private excelTable?: Excel.Table
  private headers: string[]
  private keys: string[]
  private vueState = reactive<Row[]>([])

  constructor(private tableName: string, sheetName: string, private colDefs: ColumnDef[]) {
    this.headers = colDefs.map((c) => c.label)
    this.keys = colDefs.map((c) => c.key)
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

      // importTable.onChanged.add(this.updateStore)
    })
  }

  getExcelTable() {
    Excel
  }

  private update() {}

  updateTable() {}

  addRow(row: Partial<Row>) {
    this.runTable(async (table) => {
      table.rows.add(-1, [this.objectToRow(row)])
    })
  }

  async updateExcelRow(index: number, value: Partial<Row>) {
    if (this.excelTable) {
      this.excelTable.rows.getItemAt(index).values = [this.objectToRow(value)]
    }
  }

  // Change internal vue state to force components to re-render
  async handleExcelUpdateEvent(args: Excel.TableChangedEventArgs) {
    //since the table event doesn't give us the row index, just replace the entire object
    const keys = this.keys

    if (args.address)
      if (this.excelTable) {
        this.vueState = this.excelTable?.rows.items.map((row) => {
          return Object.fromEntries(row.values[0].map((val, index) => [keys[index], val]))
        })
      }
  }

  async updateProperty(index: number, value: Partial<Row>) {
    Object.entries(value).forEach(() => {})
  }

  private getColumnIndex(headerName: string) {
    return this.headers.findIndex((x) => x === headerName)
  }

  // private getRowIndex() {
  //   this.runTable(async (table) => {
  //     table.columns.getItemAt(0)
  //   })
  // }

  private objectToRow(row: Partial<Row>) {
    return this.colDefs.map((col) => row[col.key] ?? "")
  }

  removeRow() {}

  loadFromExcel() {}

  saveToExcel() {}

  updateVueState(index: number, newState: Partial<Row>) {
    this.vueState[index] = {
      ...this.vueState[index],
      ...newState,
    }
  }

  async runTable(func: (table: Excel.Table) => Promise<void>) {
    Excel.run(async (context) => {
      const excelTable = context.workbook.tables.getItem(this.tableName)
      await context.sync()

      await func(excelTable)
      await context.sync()
    })
  }
}

const parseAddress = (address: string) => {
  const split = address.split(":")
  const regex = /([A-Z]+)(\d+)/g

  if (split.length === 1) {
  } else {
  }
}

type ObjectToTuple<T extends Record<string, unknown>> = [T[keyof T]]

interface Rows {
  t: string
  q: number
  j: string
}
