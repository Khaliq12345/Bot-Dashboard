export function useexportCSV(usersLst: Array<any>, cols: Array<any>, filename: any){
  const rows: string[] = [];

  rows.push(cols.join(","));

  for (const match of usersLst) {
    const row = cols.map((key: string) => {
      const value = match?.[key];
      if (typeof value === "string") {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? "";
    });
    rows.push(row.join(","));
  }

  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filenameo = `${filename}_${timestamp}.csv`;

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filenameo);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
