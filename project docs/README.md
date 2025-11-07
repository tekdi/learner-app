# Project Documentation

This folder contains documentation for project components.

## StandAlonePlayer Component Documentation

The file `StandAlonePlayer_Component_Documentation.md` contains comprehensive documentation for the StandAlonePlayer component.

### Converting to Word Document

To convert the Markdown file to a Word document (.docx), you can use one of the following methods:

#### Method 1: Using Pandoc (Recommended)

```bash
# Install pandoc if not already installed
# On macOS: brew install pandoc
# On Ubuntu: sudo apt-get install pandoc
# On Windows: Download from https://pandoc.org/installing.html

# Convert to Word
pandoc StandAlonePlayer_Component_Documentation.md -o StandAlonePlayer_Component_Documentation.docx
```

#### Method 2: Using Online Converters

1. Open the `.md` file in a text editor
2. Copy the content
3. Use online converters like:
   - https://www.markdowntoword.com/
   - https://cloudconvert.com/md-to-docx
   - https://www.zamzar.com/convert/md-to-docx/

#### Method 3: Using VS Code

1. Install the "Markdown PDF" extension in VS Code
2. Open the `.md` file
3. Right-click and select "Markdown PDF: Export (docx)"

#### Method 4: Using Microsoft Word

1. Open Microsoft Word
2. Go to File > Open
3. Select the `.md` file
4. Word will automatically convert it
5. Save as `.docx`

### File Structure

```
project docs/
├── README.md (this file)
└── StandAlonePlayer_Component_Documentation.md
```

