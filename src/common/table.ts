import { Ref, ref } from "vue"
import { numberToLetters } from "./utils"

interface ColumnDef {
  key: string
  label: string
}

interface RowData {
  [k: string]: never
}

export class StoredTable<Row extends RowData> {
  private excelTable?: Excel.Table
  private headers: string[]
  private keys: string[]
  vueState = ref<Row[]>([]) as Ref<Row[]>
  private numColumns: number
  isLoading = true

  constructor (private tableName: string, private sheetName: string, private colDefs: ColumnDef[]) {
    this.headers = colDefs.map((c) => c.label)
    this.keys = colDefs.map((c) => c.key)
    this.numColumns = colDefs.length - 1
  }

  setup() {
    Excel.run(async (context) => {
      const rangeStr = `A1:${numberToLetters(this.numColumns)}1`

      let importSheet = context.workbook.worksheets.getItemOrNullObject(this.sheetName)
      await context.sync()

      if (importSheet.isNullObject) {
        importSheet = context.workbook.worksheets.add(this.sheetName)
      }

      let importTable = importSheet.tables.getItemOrNullObject(this.tableName)
      await context.sync()

      if (importTable.isNullObject) {
        importSheet.getRange(rangeStr).values = [this.headers]

        importTable = importSheet.tables.add(rangeStr, true)
        importTable.name = this.tableName
      }

      importTable.onChanged.add((args) => this.handleExcelUpdateEvent(args))

      await context.sync()
    })
  }

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

    console.log("State Updated", args.address)

    this.runTable(async (table) => {
      const rows = table.rows.items.map((row) => {
        return Object.fromEntries(row.values[0].map((val, index) => [keys[index], val]))
      }) as Row[]

      this.vueState.value = rows
    })
  }

  private getColumnIndex(headerName: string) {
    return this.headers.findIndex((x) => x === headerName)
  }

  private objectToRow(row: Partial<Row>) {
    return this.colDefs.map((col) => row[col.key] ?? "")
  }

  async runTable(func: (table: Excel.Table) => Promise<void>) {
    Excel.run(async (context) => {
      const excelTable = context.workbook.tables.getItem(this.tableName)
      excelTable.rows.load()
      await context.sync()

      await func(excelTable)
      await context.sync()
    })
  }
}

// const parseAddress = (address: string) => {
//   const split = address.split(":")
//   const regex = /([A-Z]+)(\d+)/g

//   if (split.length === 1) {
//   } else {
//   }
// }

type ObjectToTuple<T extends Record<string, unknown>> = [T[keyof T]]

