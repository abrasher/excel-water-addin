// const importFromExcel = () => {
//   Excel.run(async (context) => {
//     // Send error if Pond Calculator Sheet is missing
//     const sheet = context.workbook.worksheets.getItemOrNullObject("Pond Calculator")
//     await context.sync()
//     if (sheet.isNullObject) {
//       notification.error({
//         content: `ERROR: Unable to find sheet "Pond Calculator" to import from`,
//         meta: `Use "Export to Excel" first to generate correct format`,
//         duration: 3000,
//       })
//     }

//     // Send error if PondCalculatorScenarios or ParametersTable is missing
//     const scenarioTable = sheet.tables
//       .getItemOrNullObject("PondCalculatorScenarios")
//       .load({ rows: { $all: true } })
//     const parametersTable = sheet.tables
//       .getItemOrNullObject("ParametersTable")
//       .load({ rows: { $all: true } })

//     await context.sync()

//     if (scenarioTable.isNullObject || parametersTable.isNullObject) {
//       notification.error({
//         content: `ERROR: Unable to import `,
//         meta: `"Pond Calculator" sheet seems to be incorrectly formatted`,
//         duration: 3000,
//       })
//     }

//     pond.value = Object.fromEntries(
//       parametersTable.rows.items.map((row) => {
//         const [label, value] = row.values[0]
//         const key = getKeyByValue(excelLabels, label)

//         return [key, value]
//       })
//     )

//     scenarios.value = scenarioTable.rows.items.flatMap((row) => {
//       const values = row.values[0]

//       return Object.fromEntries(values.map((value, index) => [scenarioColumns[index].key, value]))
//     })
//   })
// }

// const exportToExcel = () => {
//   Excel.run(async (context) => {
//     context.workbook.worksheets.getItemOrNullObject("Pond Calculator").delete()
//     await context.sync()

//     const sheet = context.workbook.worksheets.add("Pond Calculator")

//     const scenarioTable = sheet.tables.add(
//       `A1:${numberToLetters(Object.keys(excelLabels).length)}1`,
//       true
//     )

//     scenarioTable.name = "PondCalculatorScenarios"

//     scenarioTable.getHeaderRowRange().values = [scenarioColFiltered.map((col) => col.title)]

//     const scenarioKeys = scenarioColFiltered.map((col) => col.key)

//     scenarioTable.rows.add(
//       -1,
//       scenarios.value.map((scenario) => pickObjectValues(scenario, scenarioKeys as string[]))
//     )

//     // Export the results table below the scenarios table with 1 cell of spacing
//     const offset1 = scenarios.value.length + 3

//     const resultsTable = sheet.tables.add(
//       `A${offset1}:${numberToLetters(resultsColumns.length)}${offset1}`,
//       true
//     )

//     resultsTable.name = "PondCalculatorResults"

//     resultsTable.getHeaderRowRange().values = [resultsColumns.map((col) => col.title)]

//     const resultsKeys = resultsColumns.map((col) => col.key)

//     resultsTable.rows.add(
//       -1,
//       results.value.map((result) => pickObjectValues(result, resultsKeys as string[]))
//     )

//     // Export the catchment characteristics below the results table
//     const offset2 = scenarios.value.length + results.value.length + 5

//     const paramTable = sheet.tables.add(`A${offset2}:B${offset2}`, true)

//     paramTable.name = "ParametersTable"

//     paramTable.getHeaderRowRange().values = [["Parameter", "Value"]]

//     paramTable.rows.add(
//       -1,
//       Object.entries(excelLabels).map(([key, label]) => {
//         return [label, get(pond.value, key)]
//       })
//     )

//     sheet.activate()

//     await context.sync()
//   })
// }
export {}
