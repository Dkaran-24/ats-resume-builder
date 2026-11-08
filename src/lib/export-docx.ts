import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '@/types/resume';

export async function exportResumeToDocx(resume: ResumeData): Promise<void> {
  const sectionsChildren: Paragraph[] = [];

  // Header: Full Name
  sectionsChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: resume.personalInfo.fullName || 'Untitled Resume',
          bold: true,
          size: 32, // 16pt
          font: 'Calibri'
        })
      ]
    })
  );

  // Job Title
  if (resume.personalInfo.jobTitle) {
    sectionsChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resume.personalInfo.jobTitle,
            size: 24, // 12pt
            color: '4F46E5',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // Contact line
  const contacts = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedin,
    resume.personalInfo.github,
    resume.personalInfo.portfolio
  ].filter(Boolean);

  if (contacts.length > 0) {
    sectionsChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: contacts.join('  |  '),
            size: 19, // 9.5pt
            color: '555555',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  const createSectionHeader = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: 'CCCCCC',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          color: '1E293B',
          font: 'Calibri'
        })
      ]
    });
  };

  // Professional Summary
  if (resume.summary?.text) {
    sectionsChildren.push(createSectionHeader('Professional Summary'));
    sectionsChildren.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: resume.summary.text,
            size: 21,
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // Work Experience
  if (resume.experience && resume.experience.length > 0) {
    sectionsChildren.push(createSectionHeader('Work Experience'));
    resume.experience.forEach(exp => {
      // Company & Location / Dates
      sectionsChildren.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 22,
              font: 'Calibri'
            }),
            new TextRun({
              text: `  |  ${exp.company} (${exp.location || 'Remote'})`,
              color: '334155',
              size: 21,
              font: 'Calibri'
            }),
            new TextRun({
              text: `  [${exp.startDate} - ${exp.endDate || (exp.current ? 'Present' : '')}]`,
              color: '64748B',
              size: 20,
              font: 'Calibri'
            })
          ]
        })
      );

      // Bullet points
      exp.bulletPoints.forEach(bp => {
        if (!bp.trim()) return;
        sectionsChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: bp,
                size: 21,
                font: 'Calibri'
              })
            ]
          })
        );
      });

      // Tech used
      if (exp.technologies && exp.technologies.length > 0) {
        sectionsChildren.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Technologies: ',
                bold: true,
                size: 19,
                color: '475569',
                font: 'Calibri'
              }),
              new TextRun({
                text: exp.technologies.join(', '),
                size: 19,
                color: '475569',
                font: 'Calibri'
              })
            ]
          })
        );
      }
    });
  }

  // Skills
  const hasSkills = Object.values(resume.skills || {}).some(arr => arr && arr.length > 0);
  if (hasSkills) {
    sectionsChildren.push(createSectionHeader('Core Competencies & Skills'));
    if (resume.skills.technical?.length > 0) {
      sectionsChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Technical Skills: ', bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: resume.skills.technical.join(', '), size: 21, font: 'Calibri' })
          ]
        })
      );
    }
    if (resume.skills.programming?.length > 0) {
      sectionsChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Programming Languages: ', bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: resume.skills.programming.join(', '), size: 21, font: 'Calibri' })
          ]
        })
      );
    }
    if (resume.skills.frameworks?.length > 0) {
      sectionsChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Frameworks & Libraries: ', bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: resume.skills.frameworks.join(', '), size: 21, font: 'Calibri' })
          ]
        })
      );
    }
    if (resume.skills.tools?.length > 0) {
      sectionsChildren.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Tools & Platforms: ', bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: resume.skills.tools.join(', '), size: 21, font: 'Calibri' })
          ]
        })
      );
    }
    if (resume.skills.soft?.length > 0) {
      sectionsChildren.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: 'Soft Skills: ', bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: resume.skills.soft.join(', '), size: 21, font: 'Calibri' })
          ]
        })
      );
    }
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    sectionsChildren.push(createSectionHeader('Education'));
    resume.education.forEach(edu => {
      sectionsChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.fieldOfStudy}`,
              bold: true,
              size: 21,
              font: 'Calibri'
            }),
            new TextRun({
              text: `  |  ${edu.institution}`,
              size: 21,
              font: 'Calibri'
            }),
            new TextRun({
              text: ` (${edu.startDate} - ${edu.endDate})`,
              color: '64748B',
              size: 20,
              font: 'Calibri'
            })
          ]
        })
      );
      if (edu.gpa || edu.honors) {
        sectionsChildren.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: [edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join('  |  '),
                size: 20,
                color: '475569',
                font: 'Calibri'
              })
            ]
          })
        );
      }
    });
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    sectionsChildren.push(createSectionHeader('Key Projects'));
    resume.projects.forEach(proj => {
      sectionsChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 21,
              font: 'Calibri'
            }),
            proj.role ? new TextRun({ text: ` (${proj.role})`, color: '64748B', size: 20, font: 'Calibri' }) : new TextRun('')
          ]
        })
      );
      if (proj.description) {
        sectionsChildren.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: proj.description, size: 20, color: '334155', font: 'Calibri' })]
          })
        );
      }
      proj.bulletPoints.forEach(bp => {
        sectionsChildren.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [new TextRun({ text: bp, size: 20, font: 'Calibri' })]
          })
        );
      });
    });
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    sectionsChildren.push(createSectionHeader('Certifications'));
    resume.certifications.forEach(cert => {
      sectionsChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({ text: cert.name, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: ` – ${cert.issuer} (${cert.issueDate})`, size: 20, color: '475569', font: 'Calibri' })
          ]
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 inch
              bottom: 720,
              left: 720,
              right: 720
            }
          }
        },
        children: sectionsChildren
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_ATS.docx`;
  saveAs(blob, filename);
}

