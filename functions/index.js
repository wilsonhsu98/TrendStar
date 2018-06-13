const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();

exports.import_game = functions.https.onRequest((req, res) => {
    const body = req.body;
    const game = body.game;
    const teddySummary = body.summary.find(item => item['場次'] === game);
    const parseResult = parseGame(body.rawdata);
    db.collection('games').doc(game).set({
            orders: parseResult.orders,
            errors: parseResult.errors,
            result: ['win', 'lose', 'tie', ''][
                        ['勝', '敗', '和', ''].indexOf(teddySummary ? teddySummary['結果'] : 3)
                    ],
            year: teddySummary ? teddySummary['年度'] : '',
            season: teddySummary ? teddySummary['季度'] : '',
            opponent: teddySummary ? teddySummary['對手'] : '',
            league: teddySummary ? teddySummary['聯盟'] : '',
            coach: teddySummary ? teddySummary['教練'] : '',
            place: teddySummary ? teddySummary['休息區'] : '',
            group: teddySummary ? teddySummary['組別'] : '',
            timestamp,
        }).then(writeResult => {
            res.json(writeResult);
        });
});

const contentMapping = {
    '1H': '1H',
    '2H': '2H',
    '3H': '3H',
    'HR': 'HR',
    '飛球': 'FO',
    '滾地': 'GO',
    'BB': 'BB',
    'K': 'K',
    'E': 'E',
    '野選': 'FC',
    '犧飛': 'SF',
    '雙殺': 'DP',
    '三殺': 'TP',
};
const parseGame = function(arr) {
    var nameCol = arr[0].indexOf('名單'),
        errCol = arr[0].indexOf('失誤'),
        startCol = arr[0].indexOf('一'),
        row = 1,
        col = startCol,
        order = 1,
        result = [],
        scan = [],
        innArray = ['', '一', '二', '三', '四', '五', '六', '七'],
        errorArr = [];

    while (col < arr[0].length && row < arr.length) {
        if (scan.indexOf(row + '' + col) === -1) {
            scan.push(row + '' + col);
            if (arr[row][col]) {
                var run = '';
                if (arr[row][col + 2] === 'R') {
                    run = arr[row][nameCol];
                } else if (row + 1 < arr.length && arr[row + 1][col] === '' && arr[row + 1][col + 2] === 'R') {
                    run = arr[row + 1][nameCol];
                }
                result.push({
                    order: order++,
                    inn: innArray.indexOf(arr[0][col]),
                    name: arr[row][nameCol],
                    content: contentMapping[arr[row][col]],
                    r: run,
                    rbi: arr[row][col + 1],
                    _row: row
                });
            }
        }
        if (arr[row][errCol] && col === startCol) {
            errorArr.push({
                name: arr[row][nameCol],
                count: arr[row][errCol],
            });
        }
        row++;
        if (row === arr.length) {
            if (scan.indexOf('1' + col) === -1) {
                row = 1;
            } else {
                col += 3;
                if (result[result.length - 1]) {
                    if (result[result.length - 1]._row === arr.length - 1) {
                        row = 1;
                    } else {
                        row = result[result.length - 1]._row + 1
                    }
                } else {
                    row = 1;
                }
            }
        }
    }
    return {
        orders: result.map(function(item) {
            delete item._row;
            return item;
        }),
        errors: errorArr,
    };
};
