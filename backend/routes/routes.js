const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../config/db');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// new workshops

// enter new workshop detail

//expected data format
// {
//     "subject": "React Workshop",
//     "from_date": "2025-05-01",
//     "till_date": "2025-05-02",
//     "duration": 2,
//     "technology": ["React", "Node.js"],
//     "project": "Web Development",
//     "centre": "Janakpuri",
//     "mode": "offline",
//     "speaker_name": ["Alice", "Bob"],
//     "workshop_type": "Technical",
//     "other1": "Option 1",
//     "other2": "Option 2",
//     "other3": "Option 3"
//   }

// Function to generate workshop_id
const generateWorkshopId = async (from_date, centre) => {
  const year = new Date(from_date).getFullYear();
  const centreCode = centre.toUpperCase().slice(0, 1);

  const [result] = await db.query(
    `SELECT COUNT(*) AS count FROM workshop_details WHERE YEAR(from_date) = ?`,
    [year]
  );
  const count = result[0].count + 1;
  const sequence = String(count).padStart(3, '0');

  return `WS${year}${centreCode}${sequence}`;
};
//API 1
router.post('/workshops/new', async (req, res) => {
  const {
    subject, from_date, till_date, duration, technology = [], project,
    centre, mode, speaker_name = [], workshop_type, other1, other2, other3
  } = req.body;

  const connection = await db.getConnection(); // assuming you're using mysql2/promise pool

  try {
    await connection.beginTransaction();

    // 1. Generate workshop_id
    const workshop_id = await generateWorkshopId(from_date, centre);

    // 2. Insert workshop details into workshop_details
    const [result] = await connection.query(
      `INSERT INTO workshop_details 
        (workshop_id, subject, from_date, till_date, duration, project, centre, mode, workshopType, otherOption1, otherOption2, otherOption3) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [workshop_id, subject, from_date, till_date, duration, project, centre, mode, workshop_type, other1, other2, other3]
    );

    // 3. Insert technologies
    for (const tech of technology) {
      await connection.query(
        `INSERT INTO workshop_technologies (workshop_id, technology) VALUES (?, ?)`,
        [workshop_id, tech]
      );
    }

    // 4. Insert speakers
    for (const speaker of speaker_name) {
      await connection.query(
        `INSERT INTO workshop_speakers (workshop_id, speaker_name) VALUES (?, ?)`,
        [workshop_id, speaker]
      );
    }

    await connection.commit();
    res.json({ success: true, message: "Workshop added!", workshop_id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// upload excel for workshop with workshop id
//API 2
const upload = multer({ dest: 'uploads/' });
// Upload participant data for workshop id
router.post('/workshops/:workshopId/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;

    try {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        for (let row of data) {
            const name = row.Name || null;
            const fathers_name = row.Fathers_Name || null;
            const qualification = row.Qualification || null;
            const email = row.Email || null;
            const mobile_number = row.Mobile_Number || null;
            const working = row.Working || null;
            const designation = row.Designation || null;
            const department = row.Department || null;
            const college_name = row.College_Name || null;
            const degree = row.Degree || null;

            await db.query(
                "INSERT INTO participant_details (name, fathers_name, Highestqualifications, mobileNo, email, working, designation, department, collegename, degree, workshop_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [name, fathers_name, qualification, mobile_number, email, working, designation, department, college_name, degree, req.params.workshopId]
            );
        }

        // Delete file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete file:", err);
        });

        res.json({ success: true, message: "Participants added!" });
    } catch (err) {
        // Ensure file is deleted even if an error occurs
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error("Failed to delete file after error:", unlinkErr);
        });

        res.status(500).json({ success: false, error: err.message });
    }
});


//API 3
//fetching filters for participant reports as well as for workshop reports
router.get('/workshops/filters', async (req, res) => {
    try {

        const[subjects] = await db.query(`SELECT DISTINCT subject FROM workshop_details`);
        const[technologies] = await db.query(`SELECT DISTINCT technology FROM workshop_technologies`);
        const[projects] = await db.query(`SELECT DISTINCT project FROM workshop_details`);
        const[speakers] = await db.query(`SELECT DISTINCT speaker_name FROM workshop_speakers`);


        res.json({
            subjects: subjects.map(s => s.subject),
            technologies: technologies.map(t => t.technology),
            projects: projects.map(p => p.project),
            speakers: speakers.map(s => s.speaker_name),
            centres: ["Janakpuri", "Karkardooma", "Inderlok"],
            modes: ["Offline", "Online", "Hybrid"]
        });
    } catch (error) {
        console.error('Error fetching filters:', error); // Better logging
        res.status(500).json({ success: false, message: error.message });
    }
});


// fetching total(participant, workshop) for session wise
//API 4
// get total workshops and participant in particular financial year
router.get('/workshops/stats/:year', async (req, res) => {
    try {
        const year = req.params.year;

        // Financial year starts from April 1st of the given year to March 31st of the next year
        const startDate = `${year}-04-01`;
        const endDate = `${parseInt(year) + 1}-03-31`;

        // Count total workshops
        const [workshopCount] = await db.query(
            "SELECT COUNT(*) AS total_workshops FROM workshop_details WHERE from_date BETWEEN ? AND ?",
            [startDate, endDate]
        );

        // Count total participants
        const [participantCount] = await db.query(
            "SELECT COUNT(*) AS total_participants FROM participant_details p JOIN workshop_details w ON p.workshop_id = w.workshop_id WHERE w.from_date BETWEEN ? AND ?",
            [startDate, endDate]
        );

        res.json({
            total_workshops: workshopCount[0].total_workshops,
            total_participants: participantCount[0].total_participants
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



//view workshop details
//API 5
// Fetch workshops with filtering and pagination
router.get('/workshops/reports', async (req, res) => {
    try {
        const { page = 1,  subject, from_date, till_date, technology, project, centre, mode, speaker } = req.query;
        const limit = 20;
        const offset = (page - 1) * limit;
        let filters = [];
        let queryParams = [];

        if (from_date && till_date) {
            filters.push(`from_date <= ? AND till_date >= ?`);
            queryParams.push(till_date, from_date);
          }
        if (subject) {
            filters.push(`subject = ?`);
            queryParams.push(subject);
        }
        if (project) {
            filters.push(`project = ?`);
            queryParams.push(project);
        }
        if (centre) {
            filters.push(`centre = ?`);
            queryParams.push(centre);
        }
        if (mode) {
            filters.push(`mode = ?`);
            queryParams.push(mode);
        }

        // Filters on technologies
        if (technology) {
            filters.push(`wt.technology = ?`);
            queryParams.push(technology);
        }
        // Filters on speakers
        if (speaker) {
            filters.push(`ws.speaker_name = ?`);
            queryParams.push(speaker);
        }

        // Combine everything
        const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

        const sql = `
        SELECT 
          w.workshop_id,
          w.subject,
          w.from_date,
          w.till_date,
          w.duration,
          w.project,
          w.centre,
          w.mode, 
          GROUP_CONCAT(DISTINCT wt.technology) AS technologies,
          GROUP_CONCAT(DISTINCT ws.speaker_name) AS speakers,
          COUNT(DISTINCT p.regid) AS participant_count,
          w.workshoptype,
          w.otheroption1,
          w.otheroption2,
          w.otheroption3
        FROM workshop_details w
        LEFT JOIN participant_details p ON p.workshop_id = w.workshop_id
        LEFT JOIN workshop_technologies wt ON wt.workshop_id = w.workshop_id
        LEFT JOIN workshop_speakers ws ON ws.workshop_id = w.workshop_id
        ${whereClause}
        GROUP BY w.workshop_id
        ORDER BY w.from_date DESC
        LIMIT ? OFFSET ?
      `;        
      const countSql = `SELECT COUNT(DISTINCT w.workshop_id) as total FROM workshop_details w   LEFT JOIN participant_details p ON p.workshop_id = w.workshop_id
        LEFT JOIN workshop_technologies wt ON wt.workshop_id = w.workshop_id
        LEFT JOIN workshop_speakers ws ON ws.workshop_id = w.workshop_id ${whereClause}`;

        queryParams.push(limit, offset);

        const [workshops] = await db.query(sql, queryParams);
        const [[{ total }]] = await db.query(countSql, queryParams.slice(0, -2)); // Exclude limit+offset for count
        workshops.forEach(workshop => {
            workshop.from_date = new Date(workshop.from_date).toLocaleDateString('en-CA');
            workshop.till_date = new Date(workshop.till_date).toLocaleDateString('en-CA');
        });
        res.json({
            success: true,
            data: {
              workshops,
              pagination: {
                total_items: total,
                current_page: parseInt(page),
                items_per_page: limit,
                total_pages: Math.ceil(total / limit),
                has_next_page: page * limit < total,
                has_prev_page: page > 1
              }
            }
          });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// view participant details
//API 6
// to show all participants from all workshops with total counts of workshops and total participants (with/without filter only one api) by default filter is date from jan current year to till now
router.get('/participants/reports', async (req, res) => {
    try {
      const {page = 1, subject, from_date, till_date, technology, project, centre, mode, speaker} = req.query;
      const limit = 20;
      const offset = (page - 1) * limit;
      let filters = [];
      let queryParams = [];
  
      if (from_date && till_date) {
        filters.push(`from_date >= ? AND till_date <= ?`);
        queryParams.push(from_date, till_date);
      }
  
      if (subject) {
        filters.push(`w.subject = ?`);
        queryParams.push(subject);
      }
      if (project) {
        filters.push(`w.project = ?`);
        queryParams.push(project);
      }
      if (centre) {
        filters.push(`w.centre = ?`);
        queryParams.push(centre);
      }
      if (mode) {
        filters.push(`w.mode = ?`);
        queryParams.push(mode);
      }
  
      // JOIN for technology
      if (technology) {
        filters.push(`wt.technology = ?`);
        queryParams.push(technology);
      }
  
      // JOIN for speaker
      if (speaker) {
        filters.push(`ws.speaker_name = ?`);
        queryParams.push(speaker);
      }
    
      const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  
      const sql = `
        SELECT Distinct p.* FROM participant_details p
        JOIN workshop_details w ON w.workshop_id = p.workshop_id
        JOIN workshop_technologies wt ON wt.workshop_id = w.workshop_id
        JOIN workshop_speakers ws ON ws.workshop_id = w.workshop_id
        ${whereClause}
        ORDER BY p.regid DESC
        LIMIT ? OFFSET ?
      `;
  
      // For pagination count
      const countSql = `
        SELECT COUNT(DISTINCT p.regid) AS total_participants,
               COUNT(DISTINCT w.workshop_id) AS total_workshops
        FROM participant_details p
        JOIN workshop_details w ON w.workshop_id = p.workshop_id
        JOIN workshop_technologies wt ON wt.workshop_id = w.workshop_id
        JOIN workshop_speakers ws ON ws.workshop_id = w.workshop_id
        ${whereClause}
      `;
  
      queryParams.push(limit, offset);
  
      const [participants] = await db.query(sql, queryParams);
      const [[counts]] = await db.query(countSql, queryParams.slice(0, -2)); // exclude limit and offset
  
      res.json({
        success: true,
        data: {
          total_participants: counts.total_participants || 0,
          total_workshops: counts.total_workshops || 0,
          participants,
          pagination: {
            total_items: counts.total_participants,
            current_page: parseInt(page),
            items_per_page: limit,
            total_pages: Math.ceil(counts.total_participants / limit),
            has_next_page: page * limit < counts.total_participants,
            has_prev_page: page > 1
          }
        }
      });
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });   

//API 7
// to show participants for particular workshop. view participant option.
// Fetch participants for a specific workshop by its ID (VARCHAR) with pagination

router.get('/participants/:workshopId', async (req, res) => {
    try {
      // 1️⃣ Use workshop ID directly (do NOT convert to number)
      const workshopId = req.params.workshopId?.trim();
  
      if (!workshopId) {
        return res.status(400).json({
          success: false,
          error: 'Workshop ID is required and cannot be empty.',
        });
      }
  
      // 2️⃣ Setup pagination (defaults with max limit of 100)
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
      const offset = (page - 1) * limit;
  
      // 3️⃣ Check if workshop exists
      const [workshop] = await db.query(
        `SELECT workShop_ID FROM workshop_details WHERE workShop_ID = ?`,
        [workshopId]
      );
  
      if (!workshop.length) {
        return res.status(404).json({
          success: false,
          error: `Workshop not found with ID '${workshopId}'`,
        });
      }
  
      // 4️⃣ Fetch participants for that workshop
      const [participants] = await db.query(
        `SELECT regid, name, fathers_name, Highestqualifications, mobileNo, email, working, designation, department, collegename, degree FROM participant_details
         WHERE workshop_id = ? ORDER BY regid ASC LIMIT ? OFFSET ?`, [workshopId, limit, offset]
      );
  
      // 5️⃣ Get total participant count for pagination
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total FROM participant_details WHERE workshop_id = ?`,
        [workshopId]
      );
  
      // 6️⃣ Send the response
      res.json({
        success: true,
        data: {
          workshop_id: workshopId,
          participants,
          pagination: {
            total_items: total,
            current_page: page,
            items_per_page: limit,
            total_pages: Math.ceil(total / limit),
            has_next_page: page * limit < total,
            has_prev_page: page > 1,
          },
        },
      });
    } catch (err) {
      console.error(`Error fetching participants for workshop ${req.params.workshopId}:`, err);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          details: err.message,
          stack: err.stack,
        }),
      });
    }
  });
  


//API 8 download reports
//  to download filtered workshop reports as excel/pdf (one api format as query parameter)
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

router.get('/workshops/reports/download', async (req, res) => {
  try {
    const { format, subject, from_date, till_date, technology, project, centre, mode, speaker } = req.query;

    let filters = [];
    let queryParams = [];

    if (from_date && till_date) {
      filters.push(`from_date >= ? AND till_date <= ?`);
      queryParams.push(from_date, till_date);
    }
    if (subject) {
      filters.push(`subject = ?`);
      queryParams.push(subject);
    }
    if (project) {
      filters.push(`project = ?`);
      queryParams.push(project);
    }
    if (centre) {
      filters.push(`centre = ?`);
      queryParams.push(centre);
    }
    if (mode) {
      filters.push(`mode = ?`);
      queryParams.push(mode);
    }

    if (technology) {
      filters.push(`wt.technology = ?`);
      queryParams.push(technology);
    }

    if (speaker) {
      filters.push(`ws.speaker_name = ?`);
      queryParams.push(speaker);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const sql = `
      SELECT 
          w.workshop_id,
          w.subject,
          w.from_date,
          w.till_date,
          w.duration,
          w.project,
          w.centre,
          w.mode, 
          GROUP_CONCAT(DISTINCT wt.technology) AS technologies,
          GROUP_CONCAT(DISTINCT ws.speaker_name) AS speakers,
          COUNT(DISTINCT p.regid) AS participant_count,
          w.workshoptype,
          w.otheroption1,
          w.otheroption2,
          w.otheroption3
        FROM workshop_details w
        LEFT JOIN participant_details p ON p.workshop_id = w.workshop_id
        LEFT JOIN workshop_technologies wt ON wt.workshop_id = w.workshop_id
        LEFT JOIN workshop_speakers ws ON ws.workshop_id = w.workshop_id
        ${whereClause}
        GROUP BY w.workshop_id
        ORDER BY w.from_date DESC
    `;

    const [rows] = await db.query(sql, queryParams);
    rows.forEach(workshop => {
        workshop.from_date = new Date(workshop.from_date).toLocaleDateString('en-CA');
        workshop.till_date = new Date(workshop.till_date).toLocaleDateString('en-CA');
    });

    if (format === 'excel') {
      // Generate Excel file
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Workshops');

      worksheet.columns = Object.keys(rows[0] || {}).map(key => ({
        header: key,
        key: key,
        width: 10
      }));

      rows.forEach(row => {
        worksheet.addRow(row);
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=workshop_report.xlsx');

      await workbook.xlsx.write(res);
      res.end();

    } else if (format === 'pdf') {
  const doc = new PDFDocument({ margin: 30 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=workshop_report.pdf');
  doc.pipe(res);

  doc.fontSize(14).text('Workshop Report', { align: 'center' });
  doc.moveDown();

  if (rows.length > 0) {
    const keys = Object.keys(rows[0]);

    // Table header
    doc.fontSize(10).font('Helvetica-Bold');
    keys.forEach((key, i) => {
      doc.text(key, { continued: i !== keys.length - 1, width: 100 });
    });
    doc.moveDown(0.5);

    // Table rows
    doc.font('Helvetica');
    rows.forEach(row => {
      keys.forEach((key, i) => {
        doc.text(String(row[key]), { continued: i !== keys.length - 1, width: 100 });
      });
      doc.moveDown(0.5);
    });
  } else {
    doc.text('No data available.');
  }

  doc.end();
}else {
      res.status(400).json({ success: false, message: "Invalid format. Use 'excel' or 'pdf'." });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


//API 9
//  to download filtered participant reports as excel/pdf 

router.get('/participants/reports/download', async (req, res) => {
    try {
      const { format, subject, from_date, till_date, technology, project, centre, mode, speaker } = req.query;
  
      let filters = [];
      let queryParams = [];        
      
      if (from_date && till_date) {
        filters.push(`from_date >= ? AND till_date <= ?`);
        queryParams.push(from_date, till_date);
      }
      // Filters
      if (subject) {
        filters.push(`w.subject = ?`);
        queryParams.push(subject);
      }
      if (project) {
        filters.push(`w.project = ?`);
        queryParams.push(project);
      }
      if (centre) {
        filters.push(`w.centre = ?`);
        queryParams.push(centre);
      }
      if (mode) {
        filters.push(`w.mode = ?`);
        queryParams.push(mode);
      }
  
      // JOIN for technology
      if (technology) {
        filters.push(`wt.technology = ?`);
        queryParams.push(technology);
      }
  
      // JOIN for speaker
      if (speaker) {
        filters.push(`ws.speaker_name = ?`);
        queryParams.push(speaker);
      }
    
      const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  
      const sql = `
        SELECT distinct p.* FROM participant_details p
        JOIN workshop_details w ON w.workshop_id = p.workshop_id
        JOIN workshop_technologies wt ON wt.workshop_id = w.workshop_id
        JOIN workshop_speakers ws ON ws.workshop_id = w.workshop_id
        ${whereClause}
        ORDER BY p.regid DESC
      `;
  

      const [rows] = await db.query(sql, queryParams);

      if (format === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Participants');
  
        worksheet.columns = Object.keys(rows[0] || {}).map(key => ({
          header: key,
          key: key,
          width: 10
        }));
  
        rows.forEach(row => {
          worksheet.addRow(row);
        });
  
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=participants_report.xlsx');
        await workbook.xlsx.write(res);
        res.end();
  
      } else if (format === 'pdf') {
        const doc = new PDFDocument({ margin: 30 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=workshop_report.pdf');
        doc.pipe(res);
      
        doc.fontSize(14).text('Participant Report', { align: 'center' });
        doc.moveDown();
      
        if (rows.length > 0) {
          const keys = Object.keys(rows[0]);
      
          // Table header
          doc.fontSize(10).font('Helvetica-Bold');
          keys.forEach((key, i) => {
            doc.text(key, { continued: i !== keys.length - 1, width: 100 });
          });
          doc.moveDown(0.5);
      
          // Table rows
          doc.font('Helvetica');
          rows.forEach(row => {
            keys.forEach((key, i) => {
              doc.text(String(row[key]), { continued: i !== keys.length - 1, width: 100 });
            });
            doc.moveDown(0.5);
          });
        } else {
          doc.text('No data available.');
        }
      
        doc.end();
      }else {
        res.status(400).json({ success: false, message: "Invalid format. Use 'excel' or 'pdf'." });
      }
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });  



module.exports = router;