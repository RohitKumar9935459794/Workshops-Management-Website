const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// Common filter processing
exports.processFilters = (query) => {
    const { subject, from_date, till_date, technology, project, centre, mode, speaker } = query;
    
    let filters = [];
    let queryParams = [];
    let filterDescriptions = [];

    if (from_date && till_date) {
        filters.push(`from_date >= ? AND till_date <= ?`);
        queryParams.push(from_date, till_date);
        filterDescriptions.push(`Date Range: ${new Date(from_date).toLocaleDateString()} to ${new Date(till_date).toLocaleDateString()}`);
    }
    if (subject) {
        filters.push(`subject = ?`);
        queryParams.push(subject);
        filterDescriptions.push(`Subject: ${subject}`);
    }
    if (project) {
        filters.push(`project = ?`);
        queryParams.push(project);
        filterDescriptions.push(`Project: ${project}`);
    }
    if (centre) {
        filters.push(`centre = ?`);
        queryParams.push(centre);
        filterDescriptions.push(`Centre: ${centre}`);
    }
    if (mode) {
        filters.push(`mode = ?`);
        queryParams.push(mode);
        filterDescriptions.push(`Mode: ${mode}`);
    }
    if (technology) {
        filters.push(`wt.technology = ?`);
        queryParams.push(technology);
        filterDescriptions.push(`Technology: ${technology}`);
    }
    if (speaker) {
        filters.push(`ws.speaker_name = ?`);
        queryParams.push(speaker);
        filterDescriptions.push(`Speaker: ${speaker}`);
    }

    return {
        whereClause: filters.length ? `WHERE ${filters.join(" AND ")}` : "",
        queryParams,
        filterDescriptions
    };
};


// Format rows from database
exports.formatRows = (rows) => {
    // Format dates and ensure all values are strings
    let formattedRows = rows.map((workshop) => {
        const formatted = {};
        for (const key in workshop) {
            if (workshop[key] instanceof Date) {
                formatted[key] = workshop[key].toLocaleDateString("en-CA");
            } else {
                formatted[key] = String(workshop[key] || "");
            }
        }
        return formatted;
    });

    // Identify columns with all empty values
    const columnsToKeep = new Set();
    if (formattedRows.length > 0) {
        const allColumns = Object.keys(formattedRows[0]);
        allColumns.forEach((column) => {
            const hasData = formattedRows.some(
                (row) => row[column] && row[column].trim() !== ""
            );
            if (hasData) {
                columnsToKeep.add(column);
            }
        });
    }

    // Filter the rows to only keep columns with data
    return formattedRows.map((row) => {
        const filteredRow = {};
        columnsToKeep.forEach((column) => {
            filteredRow[column] = row[column];
        });
        return filteredRow;
    });
};


// Generate Excel report
exports.generateExcelReport = async (formattedRows, filterDescriptions, reportType = "workshop-report",res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Workshops");
    let currentRow = 1;

    // Add title row
    const titleRow = worksheet.addRow([
        "NATIONAL INSTITUTE OF ELECTRONICS AND INFORMATION TECHNOLOGY, NIELIT DELHI CENTRE",
    ]);
    titleRow.font = { name: "Times New Roman" ,bold: true, size: 16 };
    titleRow.alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 60;
    worksheet.mergeCells(currentRow, 1, currentRow, Object.keys(formattedRows[0] || {}).length);
    titleRow.getCell(1).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
    };
    currentRow++;

    // Add report title
    const reportTitle = reportType === "workshop-report"?"Workshop Report":"Participants Report";
    const reportTitleRow = worksheet.addRow([reportTitle]);
    reportTitleRow.font = {name: "Times New Roman" , bold: true, size: 14 };
    reportTitleRow.alignment = { vertical: "middle", horizontal: "center" };
    reportTitleRow.height = 40;
    worksheet.mergeCells(currentRow, 1, currentRow, Object.keys(formattedRows[0] || {}).length);
    reportTitleRow.getCell(1).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
    };
    currentRow++;

    // Add filters if any
    if (filterDescriptions.length > 0) {
        const filterRow = worksheet.addRow([
            "Filtered on: " + filterDescriptions.join(", "),
        ]);
        filterRow.font = { name: "Times New Roman" ,italic: true, size: 14 };
        filterRow.alignment = { vertical: "middle", horizontal: "center" };
        filterRow.height = 40;
        worksheet.mergeCells(currentRow, 1, currentRow, Object.keys(formattedRows[0] || {}).length);
        filterRow.getCell(1).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
        currentRow++;
    }

    // Add data if exists
    if (formattedRows.length > 0) {
        const headers = Object.keys(formattedRows[0]);
        worksheet.columns = headers.map((header) => ({
            header: header.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            key: header,
            width: Math.min(Math.max(header.length * 1.5, 10), 30),
        }));

        const headerRow = worksheet.getRow(currentRow);
        headerRow.values = headers.map((header) =>
            header.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        );
        headerRow.height = 40;
        headerRow.font = { name: "Times New Roman" ,bold: true, size: 12 };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };
        headerRow.autofit
        headerRow.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
        currentRow++;

        formattedRows.forEach((row) => {
            const dataRow = worksheet.addRow(Object.values(row));
            dataRow.alignment = { vertical: "middle", horizontal: "left",wrapText: true };
            dataRow.font = {name: "Times New Roman" , size: 12, includeEmpty: true};
            dataRow.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

         worksheet.getCell(1, 1).value = "NATIONAL INSTITUTE OF ELECTRONICS AND INFORMATION TECHNOLOGY, NIELIT DELHI CENTRE";
    } else {
        worksheet.addRow(["No data available"]);
    }

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${reportType}.xlsx`
    );
    await workbook.xlsx.write(res);
};

// Generate PDF report
exports.generatePdfReport = (formattedRows, filterDescriptions,reportType = "workshop-report", res) => {
    const doc = new PDFDocument({
        margin: 30,
        size: "A4",
        layout: "landscape",
        bufferPages: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${reportType}.pdf`);
    doc.pipe(res);

    // Title
    doc.fontSize(16).font('Times-Bold')
       .text("NATIONAL INSTITUTE OF ELECTRONICS AND INFORMATION TECHNOLOGY, NIELIT DELHI CENTRE", {
           align: "center",
           lineGap: 5
       });
    doc.moveDown(0.5);

    // Report title
    const reportTitle = reportType === "workshop-report"?"Workshop Report":"Participants Report";
    doc.fontSize(14).text(reportTitle, {
        align: "center",
        lineGap: 5,
    });
    doc.moveDown(0.5);

    // Filters applied
    if (filterDescriptions.length > 0) {
        doc.fontSize(10).font('Times-Italic')
           .text(`Filtered on: ${filterDescriptions.join(", ")}`, {
               align: "center",
               lineGap: 5,
           });
        doc.moveDown(0.5);
    }

    if (formattedRows.length > 0) {
        const headers = Object.keys(formattedRows[0]);
        const headerTitles = headers.map((header) =>
            header.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        );

        const table = {
            headers: headerTitles,
            rows: formattedRows.map((row) => headers.map((header) => row[header] || "")),
        };

        const startX = 30;
        let startY = doc.y + 20;
        const rowHeight = 20;
        const cellPadding = 5;
        const lineHeight = 12;

        const colWidths = table.headers.map((header, i) => {
            const headerWidth = doc.font('Times-Bold').widthOfString(header);
            const contentWidths = table.rows.map((row) => {
                const text = String(row[i]);
                return doc.font('Times-Bold').widthOfString(text);
            });
            return Math.min(
                Math.max(headerWidth, ...contentWidths) + cellPadding * 2,
                80
            );
        });

        const totalWidth = colWidths.reduce((sum, width) => sum + width, 0);
        const availableWidth = doc.page.width - 60;

        if (totalWidth > availableWidth) {
            const scaleFactor = availableWidth / totalWidth;
            colWidths.forEach((width, i) => (colWidths[i] = width * scaleFactor));
        }

        // Draw header
        doc.font('Times-Bold').fontSize(10);
        let x = startX;
        table.headers.forEach((header, i) => {
            doc.rect(x, startY, colWidths[i], rowHeight+10).stroke();
            doc.text(header, x + cellPadding, startY + cellPadding, {
                width: colWidths[i] - cellPadding * 2,
                align: "center",
            });
            x += colWidths[i];
        });

        startY += rowHeight+10;

        // Draw rows
        doc.font('Times-Roman').fontSize(10);
        table.rows.forEach((row) => {
            let maxLines = 1;
            const rowTexts = [];

            row.forEach((cell, i) => {
                const text = String(cell);
                const textHeight = doc.font('Times-Roman').heightOfString(text, {
                    width: colWidths[i] - cellPadding * 2,
                });
                const lines = Math.ceil(textHeight / lineHeight);
                if (lines > maxLines) maxLines = lines;
                rowTexts.push(text);
            });

            const currentRowHeight = rowHeight * Math.max(1, maxLines);
            x = startX;
            rowTexts.forEach((text, i) => {
                doc.rect(x, startY, colWidths[i], currentRowHeight).stroke();
                doc.text(text, x + cellPadding, startY + cellPadding, {
                    width: colWidths[i] - cellPadding * 2,
                    align: "left",
                    height: currentRowHeight - cellPadding * 2,
                    ellipsis: true,
                });
                x += colWidths[i];
            });

            startY += currentRowHeight;

            if (startY > doc.page.height - 50) {
                doc.addPage();
                startY = 30;
                x = startX;
                doc.font('Times-Bold').fontSize(10);
                table.headers.forEach((header, i) => {
                    doc.rect(x, startY, colWidths[i], rowHeight+10).stroke();
                    doc.text(header, x + cellPadding, startY + cellPadding, {
                        width: colWidths[i] - cellPadding * 2,
                        align: "center",
                    });
                    x += colWidths[i];
                });
                startY += rowHeight + 10;
                doc.font('Times-Bold').fontSize(10);
            }
        });

        // Footer
        const totalCount = formattedRows.length;
        const footerText = reportType === "workshop-report"?"Total Workshops: ":"Total Participants: ";
        doc.font('Times-Roman')
           .text(`${footerText} ${totalCount}`, doc.page.width - 150, doc.page.height - 50);
    } else {
        doc.fontSize(12).text("No data available", { align: "center" });
    }
    doc.end();
};
