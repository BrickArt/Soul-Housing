// Require library
const xl = require('excel4node');


// Create a new instance of a Workbook class
const wb = new xl.Workbook();

// Add Worksheets to the workbook
const ws = wb.addWorksheet('report');

// Create a reusable style
const style = wb.createStyle({
    font: {
        color: '#000000',
        size: 12
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
});

const headerStyle = wb.createStyle({
    font: {
        style: 'San Francisco',
        color: '#000000',
        bold: true,
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
            ws.cell(rowNumber, colNumber + 1, rowNumber, colNumber + 4, true).string(cellData).style(style);
            add = 1;
        }
        if (colNumber > 3) {
            add = 3;
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