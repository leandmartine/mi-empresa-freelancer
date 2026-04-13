import { google } from 'googleapis'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

interface SyncRecord {
  fecha: string
  empresa_nombre: string
  proyecto_nombre: string
  horas: number
  descripcion: string | null
}

export async function syncToGoogleSheets(
  spreadsheetId: string,
  tokenData: { access_token: string; refresh_token: string; expiry_date: number },
  records: SyncRecord[],
  mes: string
): Promise<{ success: boolean; records_synced: number; error?: string }> {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    oauth2Client.setCredentials(tokenData)

    // Refrescar token si está cerca de expirar
    if (tokenData.expiry_date && tokenData.expiry_date < Date.now() + 60000) {
      const { credentials } = await oauth2Client.refreshAccessToken()
      oauth2Client.setCredentials(credentials)
    }

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })

    // Nombre de la hoja: "2026-04"
    const sheetName = mes

    // Obtener hojas existentes
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
    const existingSheets = spreadsheet.data.sheets?.map((s) => s.properties?.title) ?? []

    // Crear hoja si no existe
    if (!existingSheets.includes(sheetName)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                  gridProperties: { rowCount: 1000, columnCount: 6 },
                },
              },
            },
          ],
        },
      })
    }

    // Preparar datos
    const mesLabel = format(parseISO(`${mes}-01`), "MMMM yyyy", { locale: es })
    const headers = [['Fecha', 'Empresa', 'Proyecto', 'Horas', 'Descripción', 'Registrado']]
    const rows = records.map((r) => [
      format(parseISO(r.fecha), 'dd/MM/yyyy'),
      r.empresa_nombre || '-',
      r.proyecto_nombre || '-',
      r.horas,
      r.descripcion || '',
      new Date().toLocaleDateString('es-CL'),
    ])
    const totalRow = [['TOTAL', '', '', `=SUM(D2:D${rows.length + 1})`, `${mesLabel}`, '']]

    const values = [...headers, ...rows, ...totalRow]

    // Limpiar y escribir
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}!A1:F1000`,
    })

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    })

    // Formatear encabezado (negrita, color rosa)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: spreadsheet.data.sheets?.find((s) => s.properties?.title === sheetName)?.properties?.sheetId ?? 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.98, green: 0.81, blue: 0.91 },
                  textFormat: { bold: true },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          },
        ],
      },
    })

    return { success: true, records_synced: records.length }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { success: false, records_synced: 0, error: message }
  }
}
