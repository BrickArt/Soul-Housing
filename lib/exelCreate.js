// Require library
const xl = require('excel4node');


// Create a new instance of a Workbook class
const wb = new xl.Workbook({
    defaultFont: {
        size: 12,
        name: 'Arial',
        color: '#000000'
    },
    dateFormat: 'm/d/yy hh:mm:ss',
    workbookView: {
      activeTab: 1, // Specifies an unsignedInt that contains the index to the active sheet in this book view.
      autoFilterDateGrouping: true, // Specifies a boolean value that indicates whether to group dates when presenting the user with filtering options in the user interface.
      firstSheet: 1, // Specifies the index to the first sheet in this book view.
      minimized: false, // Specifies a boolean value that indicates whether the workbook window is minimized.
      showHorizontalScroll: true, // Specifies a boolean value that indicates whether to display the horizontal scroll bar in the user interface.
      showSheetTabs: true, // Specifies a boolean value that indicates whether to display the sheet tabs in the user interface.
      showVerticalScroll: true, // Specifies a boolean value that indicates whether to display the vertical scroll bar.
      tabRatio: 600, // Specifies ratio between the workbook tabs bar and the horizontal scroll bar.
      visibility: 'visible', // Specifies visible state of the workbook window. ('hidden', 'veryHidden', 'visible') (§18.18.89)
      windowHeight: 17620, // Specifies the height of the workbook window. The unit of measurement for this value is twips.
      windowWidth: 28800, // Specifies the width of the workbook window. The unit of measurement for this value is twips..
      xWindow: 0, // Specifies the X coordinate for the upper left corner of the workbook window. The unit of measurement for this value is twips.
      yWindow: 440, // Specifies the Y coordinate for the upper left corner of the workbook window. The unit of measurement for this value is twips.
    },
    logLevel: 0
});

// Add Worksheets to the workbook
const ws = wb.addWorksheet('report');

// Create a reusable style
const style = wb.createStyle({
    font: {
        name: 'Arial',
        color: '#000000',
        size: 12
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
});

const headerStyle = wb.createStyle({
    
    font: {
        name: 'Arial',
        color: '#000000',
        size: 12
    },
    fill: { // §18.8.20 fill (Fill)
        type: 'pattern',
        patternType: 'lightGray',
        bgColor: '#778899',
        fgColor: '#778899'
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
});
const rowCreate = (rowNumber, dataArray, style, add) => {
    add = 1;
    //console.log("Заполняем строку " + rowNumber + " : " + dataArray);
    dataArray.forEach( (cellData, colNumber) => {
        if (!cellData) cellData = "";
        //console.log("В столбик " + colNumber + " данные " + cellData);
        if (colNumber === 3) {
            // if(isNaN(cellData)){
            // } else {
            //     ws.cell(rowNumber, colNumber + 1, rowNumber, colNumber + 4, true).number(cellData).style(style); 
            // }
            ws.cell(rowNumber, colNumber + 1, rowNumber, colNumber + 4, true).string(cellData).style(style);
            add = 1;
            return;
        }
        if (colNumber > 3) {
            add = 3;
        }
        if ((colNumber === 6 && rowNumber > 1)|| (colNumber === 8 && rowNumber > 1)) {
            if(isNaN(+cellData)){
                return ws.cell(rowNumber, colNumber + add).number(0).style(style)
            } else {
                return ws.cell(rowNumber, colNumber + add).number(+cellData).style(style)
                console.log('number')
            }
            
        }
        ws.cell(rowNumber, colNumber + add).string(cellData).style(style)
        
    });
};

const create = async (array) => {

    let headers = Object.getOwnPropertyNames(array[0]);
    rowCreate(1, headers, headerStyle);

    await array.forEach((el, count) => {
        const elArray = [];

        for (let key in el) {
            if (el.hasOwnProperty(key)) {
                elArray.push(el[key])
            }
        }

        rowCreate(count + 2, elArray, style)
    });

    return wb;
};



exports.create = create;